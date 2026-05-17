'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function traducirError(mensaje: string): string {
  const errores: Record<string, string> = {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'Email not confirmed': 'Correo no confirmado. Revisa tu bandeja de entrada',
    'User already registered': 'Ya existe una cuenta con ese correo electrónico',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'El formato del correo electrónico no es válido',
    'Signup is disabled': 'El registro de nuevas cuentas está desactivado',
    'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo',
    'over_email_send_rate_limit': 'Demasiados correos enviados. Espera antes de reintentar',
    'Anonymous sign-ins are disabled': 'El acceso anónimo no está habilitado',
    'For security purposes, you can only request this after': 'Por seguridad, espera antes de volver a intentarlo',
  }

  for (const [clave, traduccion] of Object.entries(errores)) {
    if (mensaje.includes(clave)) return traduccion
  }

  return 'Ocurrió un error. Por favor inténtalo de nuevo'
}

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: traducirError(error.message) }
  redirect('/dashboard')
}

export async function register(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: traducirError(error.message) }
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
