import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutUrl } from '@/lib/lemonsqueezy'

const VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID ?? '1686443'
const LS_STORE = 'bitacora-suenos'

function fallbackUrl(userId: string) {
  const params = new URLSearchParams({ 'checkout[custom][user_id]': userId })
  return `https://${LS_STORE}.lemonsqueezy.com/buy/${VARIANT_ID}?${params}`
}

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const url = await createCheckoutUrl(user.email ?? '', user.id)
    return NextResponse.json({ url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn('LS API falló, usando fallback directo:', msg)
    return NextResponse.json({ url: fallbackUrl(user.id) })
  }
}
