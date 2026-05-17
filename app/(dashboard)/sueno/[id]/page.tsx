import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Sueno } from '@/lib/types'
import InterpretarButton from './interpretar-button'
import InterpretacionFormateada from './interpretacion-formateada'
import ExportarTexto from './exportar-texto'
import ExportarPDF from './exportar-pdf'

function formatFechaLarga(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function SuenoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('suenos').select().eq('id', id).single()

  if (!data) notFound()
  const s = data as Sueno

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mb-6 transition"
      >
        ← Volver
      </Link>

      <div className="bg-white/5 border border-purple-800/20 rounded-2xl p-5 sm:p-6 mb-4">
        <div className="mb-4">
          <span className="text-xs text-purple-400 capitalize">
            {formatFechaLarga(s.fecha)}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {s.titulo}
          </h1>
        </div>

        {s.emociones.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {s.emociones.map((e) => (
              <span
                key={e}
                className="text-xs bg-purple-800/40 text-purple-200 rounded-full px-2.5 py-1"
              >
                {e}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-purple-800/20 pt-4">
          <p className="text-purple-100/80 text-sm leading-relaxed whitespace-pre-wrap">
            {s.descripcion}
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-purple-800/20 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">✨</span>
          <h2 className="text-white font-semibold">Interpretación IA</h2>
        </div>

        {s.interpretacion ? (
          <div>
            <InterpretacionFormateada texto={s.interpretacion} />

            {s.interpretado_en && (
              <p className="text-xs text-purple-500 mt-4">
                Interpretado el{' '}
                {new Date(s.interpretado_en).toLocaleDateString('es-ES')}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-purple-800/20">
              <ExportarTexto s={s} />
              <ExportarPDF s={s} />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-purple-300/60 text-sm mb-4">
              Obtén una interpretación reflexiva y personal de tu sueño usando
              inteligencia artificial.
            </p>
            <InterpretarButton suenoId={s.id} />
          </div>
        )}
      </div>
    </div>
  )
}
