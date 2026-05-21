'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Anthropic from '@anthropic-ai/sdk'
import {
  FREE_LIMIT,
  getSubscriptionStatus,
  getMonthlyInterpretationCount,
} from '@/lib/subscriptions'

function traducirError(mensaje: string): string {
  const errores: Record<string, string> = {
    'duplicate key': 'Ya existe un registro con esos datos',
    'violates foreign key': 'Error de referencia en la base de datos',
    'not-null violation': 'Faltan campos obligatorios',
    'JWT expired': 'Tu sesión ha expirado. Vuelve a iniciar sesión',
    'invalid input syntax': 'El formato de los datos no es válido',
  }

  for (const [clave, traduccion] of Object.entries(errores)) {
    if (mensaje.includes(clave)) return traduccion
  }

  return 'Ocurrió un error al guardar. Por favor inténtalo de nuevo'
}

export async function crearSueno(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const emociones = (formData.get('emociones') as string)
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  const { data, error } = await supabase
    .from('suenos')
    .insert({
      user_id: user.id,
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      emociones,
      fecha: formData.get('fecha') as string,
    })
    .select()
    .single()

  if (error) return { error: traducirError(error.message) }

  revalidatePath('/dashboard')
  redirect(`/sueno/${data.id}`)
}

export async function interpretarSueno(suenoId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado. Por favor inicia sesión de nuevo' }

  // Verificar límite de plan
  const { isActive } = await getSubscriptionStatus(supabase, user.id)
  if (!isActive) {
    const count = await getMonthlyInterpretationCount(supabase, user.id)
    if (count >= FREE_LIMIT) {
      return {
        error: `Has alcanzado el límite de ${FREE_LIMIT} interpretaciones gratuitas este mes. Suscríbete para obtener interpretaciones ilimitadas.`,
        limitReached: true,
      }
    }
  }

  const { data: sueno } = await supabase
    .from('suenos')
    .select()
    .eq('id', suenoId)
    .eq('user_id', user.id)
    .single()

  if (!sueno) return { error: 'Sueño no encontrado' }
  if (sueno.interpretacion) return { interpretacion: sueno.interpretacion }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: `Eres un experto en psicología de los sueños, análisis simbólico y sabiduría espiritual. Tu estilo es cálido, reflexivo y empático.
IMPORTANTE: Responde SIEMPRE en español. Devuelve tu respuesta como JSON válido con exactamente este formato (sin markdown, sin texto extra):
{
  "simbolos": "Análisis profundo de los símbolos principales del sueño en 2-3 párrafos",
  "ensenanza": "La enseñanza espiritual o reflexión personal que ofrece este sueño en 1-2 párrafos",
  "accion": "Una acción concreta y práctica que el soñador puede tomar inspirado por este sueño",
  "simbolos_clave": ["símbolo1", "símbolo2", "símbolo3"]
}`,
    messages: [
      {
        role: 'user',
        content: `Interpreta este sueño de manera perspicaz y personal.

Título: ${sueno.titulo}
Fecha: ${sueno.fecha}
Emociones: ${sueno.emociones.join(', ') || 'ninguna especificada'}
Descripción: ${sueno.descripcion}`,
      },
    ],
  })

  const interpretacion =
    message.content[0].type === 'text' ? message.content[0].text : ''

  const { error } = await supabase
    .from('suenos')
    .update({ interpretacion, interpretado_en: new Date().toISOString() })
    .eq('id', suenoId)

  if (error) return { error: traducirError(error.message) }

  // Guardar patrones de símbolos (tabla opcional — ignora errores si no existe)
  try {
    const limpio = interpretacion.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(limpio)
    const simbolos: string[] = parsed.simbolos_clave ?? []
    const hoy = new Date().toISOString().split('T')[0]
    for (const symbol of simbolos.slice(0, 5)) {
      await supabase.rpc('upsert_dream_pattern', {
        p_user_id: user.id,
        p_symbol: symbol.toLowerCase().trim(),
        p_date: hoy,
      })
    }
  } catch {}

  revalidatePath(`/sueno/${suenoId}`)
  return { interpretacion }
}
