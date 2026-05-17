'use client'

interface InterpretacionEstructurada {
  simbolos: string
  ensenanza: string
  accion: string
}

function parsear(texto: string): InterpretacionEstructurada | null {
  try {
    const limpio = texto.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(limpio)
    if (parsed.simbolos && parsed.ensenanza && parsed.accion) return parsed
  } catch {}
  return null
}

const SECCIONES = [
  {
    key: 'simbolos' as const,
    titulo: 'Símbolos',
    icono: '🔮',
    borde: 'border-purple-700/40',
    fondo: 'bg-purple-900/20',
    titulo_color: 'text-purple-300',
  },
  {
    key: 'ensenanza' as const,
    titulo: 'Enseñanza',
    icono: '📖',
    borde: 'border-blue-700/40',
    fondo: 'bg-blue-900/20',
    titulo_color: 'text-blue-300',
  },
  {
    key: 'accion' as const,
    titulo: 'Acción',
    icono: '✨',
    borde: 'border-amber-700/40',
    fondo: 'bg-amber-900/20',
    titulo_color: 'text-amber-300',
  },
]

export default function InterpretacionFormateada({ texto }: { texto: string }) {
  const estructurada = parsear(texto)

  if (!estructurada) {
    return (
      <p className="text-purple-100/80 text-sm leading-relaxed whitespace-pre-wrap">
        {texto}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {SECCIONES.map((s) => (
        <div
          key={s.key}
          className={`border ${s.borde} ${s.fondo} rounded-xl p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{s.icono}</span>
            <h3 className={`${s.titulo_color} font-semibold text-xs uppercase tracking-widest`}>
              {s.titulo}
            </h3>
          </div>
          <p className="text-purple-100/80 text-sm leading-relaxed">
            {estructurada[s.key]}
          </p>
        </div>
      ))}
    </div>
  )
}
