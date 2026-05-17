import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getVersoDelDia } from '@/lib/tehilim'
import type { Sueno } from '@/lib/types'

function formatFecha(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function SuenoCard({ s }: { s: Sueno }) {
  return (
    <Link href={`/sueno/${s.id}`}>
      <div className="bg-white/5 hover:bg-white/[0.08] border border-purple-800/20 hover:border-purple-600/40 rounded-xl p-4 transition-all cursor-pointer group h-full">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-white font-medium text-sm group-hover:text-purple-200 transition leading-snug">
            {s.titulo}
          </h3>
          <span className="text-xs text-purple-400 whitespace-nowrap shrink-0">
            {formatFecha(s.fecha)}
          </span>
        </div>
        <p className="text-purple-300/70 text-xs line-clamp-2 mb-3 leading-relaxed">
          {s.descripcion}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {s.emociones.slice(0, 3).map((e) => (
              <span
                key={e}
                className="text-xs bg-purple-800/30 text-purple-300 rounded-full px-2 py-0.5"
              >
                {e}
              </span>
            ))}
          </div>
          {s.interpretacion ? (
            <span className="text-xs text-green-400/80 flex items-center gap-1 shrink-0">
              <span>✦</span> IA
            </span>
          ) : (
            <span className="text-xs text-purple-600 shrink-0">sin interpretar</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('suenos')
    .select()
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })

  const suenos: Sueno[] = data || []
  const interpretados = suenos.filter((s) => s.interpretacion).length

  const verso = getVersoDelDia()

  // Símbolo más frecuente (tabla opcional)
  let simboloFrecuente: string | null = null
  try {
    const { data: patrones } = await supabase
      .from('dream_patterns')
      .select('symbol, count')
      .gte('count', 2)
      .order('count', { ascending: false })
      .limit(1)
      .single()
    if (patrones) simboloFrecuente = patrones.symbol
  } catch {}

  return (
    <div>
      {/* Versículo diario de Tehilim */}
      <div className="mb-6 bg-gradient-to-r from-amber-900/30 to-purple-900/20 border border-amber-700/30 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">✡</span>
          <div>
            <p className="text-xs text-amber-400/80 font-semibold uppercase tracking-widest mb-1">
              Tehilim del día — Salmo {verso.salmo}
            </p>
            <p className="text-amber-100/90 text-sm leading-relaxed italic">
              &ldquo;{verso.texto}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Símbolo frecuente */}
      {simboloFrecuente && (
        <div className="mb-5 bg-purple-900/20 border border-purple-700/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🔮</span>
          <div>
            <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold">
              Símbolo recurrente en tus sueños
            </p>
            <p className="text-white font-medium capitalize">{simboloFrecuente}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Mis Sueños</h1>
          <p className="text-purple-300 text-sm">
            {suenos.length} sueño{suenos.length !== 1 ? 's' : ''}
            {suenos.length > 0 &&
              ` · ${interpretados} interpretado${interpretados !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/nuevo-sueno"
          className="shrink-0 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          + Nuevo
        </Link>
      </div>

      {suenos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌙</div>
          <h2 className="text-white font-medium mb-2">Aún no hay sueños</h2>
          <p className="text-purple-300 text-sm mb-6">
            Registra tu primer sueño y obtén una interpretación con IA
          </p>
          <Link
            href="/nuevo-sueno"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl transition font-medium text-sm"
          >
            + Registrar primer sueño
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suenos.map((s) => (
            <SuenoCard key={s.id} s={s} />
          ))}
        </div>
      )}
    </div>
  )
}
