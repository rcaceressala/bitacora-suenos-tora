import { createClient } from '@/lib/supabase/server'
import type { Sueno } from '@/lib/types'

function BarraEmocion({
  nombre,
  count,
  max,
}: {
  nombre: string
  count: number
  max: number
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-purple-200 w-24 truncate capitalize">{nombre}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2">
        <div
          className="bg-purple-500 h-2 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-purple-400 w-4 text-right">{count}</span>
    </div>
  )
}

function BarraMes({
  mes,
  count,
  max,
}: {
  mes: string
  count: number
  max: number
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs text-purple-400 h-4">{count > 0 ? count : ''}</span>
      <div className="w-full flex items-end rounded-t overflow-hidden" style={{ height: '64px' }}>
        <div
          className="w-full bg-purple-600/70 rounded-t"
          style={{ height: `${pct}%`, minHeight: count > 0 ? '4px' : '0' }}
        />
      </div>
      <span className="text-xs text-purple-400">{mes}</span>
    </div>
  )
}

export default async function EstadisticasPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('suenos')
    .select('emociones, interpretacion, fecha')

  const suenos = (data || []) as Pick<Sueno, 'emociones' | 'interpretacion' | 'fecha'>[]

  const total = suenos.length
  const interpretados = suenos.filter((s) => s.interpretacion).length
  const pct = total > 0 ? Math.round((interpretados / total) * 100) : 0

  // Frecuencia de emociones
  const freqEmociones: Record<string, number> = {}
  suenos.forEach((s) =>
    s.emociones.forEach((e) => {
      freqEmociones[e] = (freqEmociones[e] || 0) + 1
    })
  )
  const topEmociones = Object.entries(freqEmociones)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
  const maxEmocion = topEmociones[0]?.[1] || 1

  // Sueños por mes (últimos 6)
  const mesMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    mesMap[key] = 0
  }
  suenos.forEach((s) => {
    const key = s.fecha.slice(0, 7)
    if (key in mesMap) mesMap[key]++
  })
  const porMes = Object.entries(mesMap).map(([k, v]) => ({
    mes: new Date(k + '-15').toLocaleDateString('es-ES', { month: 'short' }),
    count: v,
  }))
  const maxMes = Math.max(...porMes.map((m) => m.count), 1)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Estadísticas</h1>
        <p className="text-purple-300 text-sm">Un vistazo a tus patrones oníricos</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 border border-purple-800/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{total}</div>
          <div className="text-xs text-purple-400 mt-1">Sueños totales</div>
        </div>
        <div className="bg-white/5 border border-purple-800/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{interpretados}</div>
          <div className="text-xs text-purple-400 mt-1">Interpretados</div>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white/5 border border-purple-800/20 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{pct}%</div>
          <div className="text-xs text-purple-400 mt-1">Con interpretación</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-purple-800/20 rounded-xl p-5">
          <h2 className="text-white font-medium mb-4 text-sm">Sueños por mes</h2>
          {total === 0 ? (
            <p className="text-purple-400 text-sm">Sin datos aún</p>
          ) : (
            <div className="flex items-end gap-1">
              {porMes.map((m) => (
                <BarraMes key={m.mes} {...m} max={maxMes} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-purple-800/20 rounded-xl p-5">
          <h2 className="text-white font-medium mb-4 text-sm">Emociones frecuentes</h2>
          {topEmociones.length === 0 ? (
            <p className="text-purple-400 text-sm">Sin emociones registradas</p>
          ) : (
            <div className="space-y-3">
              {topEmociones.map(([nombre, count]) => (
                <BarraEmocion
                  key={nombre}
                  nombre={nombre}
                  count={count}
                  max={maxEmocion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
