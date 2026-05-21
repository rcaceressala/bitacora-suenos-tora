import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))
}

// Mapa de status de Lemon Squeezy a nuestro status interno
function mapStatus(lsStatus: string): string {
  if (lsStatus === 'active' || lsStatus === 'on_trial') return 'active'
  if (lsStatus === 'cancelled') return 'cancelled'
  return 'expired'
}

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  try {
    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  const event = JSON.parse(payload)
  const eventName: string = event.meta?.event_name ?? ''
  const userId: string = event.meta?.custom_data?.user_id ?? ''

  const subscriptionEvents = [
    'subscription_created',
    'subscription_updated',
    'subscription_cancelled',
    'subscription_resumed',
    'subscription_expired',
    'subscription_paused',
    'subscription_unpaused',
  ]

  if (!subscriptionEvents.includes(eventName) || !userId) {
    return NextResponse.json({ ok: true })
  }

  const attrs = event.data?.attributes ?? {}
  const lsId: string = String(event.data?.id ?? '')
  const status = mapStatus(attrs.status ?? '')
  const variantId: string = String(attrs.variant_id ?? '')
  const endsAt: string | null = attrs.ends_at ?? null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('subscriptions').upsert(
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

  if (error) {
    console.error('Supabase upsert error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
