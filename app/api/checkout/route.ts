import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutUrl } from '@/lib/lemonsqueezy'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const url = await createCheckoutUrl(user.email ?? '', user.id)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Error al generar enlace de pago' }, { status: 500 })
  }
}
