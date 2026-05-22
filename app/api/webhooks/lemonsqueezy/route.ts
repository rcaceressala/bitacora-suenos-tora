import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''
  if (!secret) {
    console.error('[webhook] LEMONSQUEEZY_WEBHOOK_SECRET no está configurado')
    return false
  }
  if (!signature) {
    console.error('[webhook] x-signature header ausente')
    return false
  }
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  // timingSafeEqual requiere misma longitud — verificar antes
  if (hash.length !== signature.length) {
    console.error(`[webhook] Longitud de firma incorrecta: esperada ${hash.length}, recibida ${signature.length}`)
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
}

function mapStatus(lsStatus: string): string {
  if (lsStatus === 'active' || lsStatus === 'on_trial') return 'active'
  if (lsStatus === 'cancelled') return 'cancelled'
  return 'expired'
}

export async function POST(request: Request) {
  console.log('[webhook] POST recibido')

  const payload = await request.text()
  const signature = request.headers.get('x-signature') ?? ''

  console.log('[webhook] signature header:', signature ? `${signature.slice(0, 10)}...` : '(vacío)')

  if (!verifySignature(payload, signature)) {
    console.error('[webhook] Firma inválida — rechazando')
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(payload)
  } catch {
    console.error('[webhook] Payload no es JSON válido')
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const eventName: string = (event.meta as Record<string, unknown>)?.event_name as string ?? ''
  const customData = (event.meta as Record<string, unknown>)?.custom_data as Record<string, string> | undefined
  const userId: string = customData?.user_id ?? ''

  console.log('[webhook] evento:', eventName)
  console.log('[webhook] user_id:', userId || '(no encontrado)')
  console.log('[webhook] custom_data completo:', JSON.stringify(customData))

  const subscriptionEvents = [
    'subscription_created',
    'subscription_updated',
    'subscription_cancelled',
    'subscription_resumed',
    'subscription_expired',
    'subscription_paused',
    'subscription_unpaused',
  ]

  if (!subscriptionEvents.includes(eventName)) {
    console.log('[webhook] Evento ignorado (no es de suscripción):', eventName)
    return NextResponse.json({ ok: true })
  }

  if (!userId) {
    console.error('[webhook] user_id ausente en custom_data — no se puede actualizar subscription')
    return NextResponse.json({ error: 'user_id requerido' }, { status: 400 })
  }

  const data = event.data as Record<string, unknown>
  const attrs = (data?.attributes as Record<string, unknown>) ?? {}
  const lsId: string = String(data?.id ?? '')
  const lsStatus: string = (attrs.status as string) ?? ''
  const status = mapStatus(lsStatus)
  const variantId: string = String(attrs.variant_id ?? '')
  const endsAt: string | null = (attrs.ends_at as string) ?? null

  console.log('[webhook] LS status:', lsStatus, '→ interno:', status)
  console.log('[webhook] lemon_squeezy_id:', lsId)
  console.log('[webhook] variant_id:', variantId)
  console.log('[webhook] ends_at:', endsAt)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('[webhook] Variables de Supabase no configuradas:', { supabaseUrl: !!supabaseUrl, serviceKey: !!serviceKey })
    return NextResponse.json({ error: 'Config error' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  const { error: upsertError } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      lemon_squeezy_id: lsId,
      status,
      variant_id: variantId,
      current_period_end: endsAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (upsertError) {
    console.error('[webhook] Error upsert Supabase:', JSON.stringify(upsertError))
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  console.log('[webhook] Subscription actualizada correctamente para user:', userId, '| status:', status)
  return NextResponse.json({ ok: true })
}
