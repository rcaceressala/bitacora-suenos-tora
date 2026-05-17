'use client'

import type { Sueno } from '@/lib/types'

function formatFecha(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ExportarTexto({ s }: { s: Sueno }) {
  const exportar = () => {
    const lineas: string[] = [
      '═══════════════════════════════════',
      `  BITÁCORA DE SUEÑOS`,
      '═══════════════════════════════════',
      '',
      `Título:  ${s.titulo}`,
      `Fecha:   ${formatFecha(s.fecha)}`,
      `Emociones: ${s.emociones.join(', ') || '—'}`,
      '',
      '─── Descripción ───────────────────',
      '',
      s.descripcion,
      '',
    ]

    if (s.interpretacion) {
      lineas.push('─── Interpretación IA ─────────────', '')
      try {
        const limpio = s.interpretacion.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
        const parsed = JSON.parse(limpio)
        if (parsed.simbolos && parsed.ensenanza && parsed.accion) {
          lineas.push('🔮 SÍMBOLOS', '', parsed.simbolos, '')
          lineas.push('📖 ENSEÑANZA', '', parsed.ensenanza, '')
          lineas.push('✨ ACCIÓN', '', parsed.accion, '')
        } else {
          lineas.push(s.interpretacion, '')
        }
      } catch {
        lineas.push(s.interpretacion, '')
      }
    }

    lineas.push('═══════════════════════════════════')

    const blob = new Blob([lineas.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sueno-${s.fecha}-${s.titulo.slice(0, 30).replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportar}
      className="flex items-center gap-2 text-purple-300 hover:text-white border border-purple-700/40 hover:border-purple-500/60 bg-white/5 hover:bg-white/10 text-sm px-4 py-2 rounded-xl transition"
    >
      <span>📄</span> Exportar como texto
    </button>
  )
}
