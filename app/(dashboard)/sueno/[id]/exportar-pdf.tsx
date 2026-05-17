'use client'

import type { Sueno } from '@/lib/types'

function formatFechaLarga(fecha: string) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function parsearInterpretacion(texto: string) {
  try {
    const limpio = texto.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '')
    const p = JSON.parse(limpio)
    if (p.simbolos && p.ensenanza && p.accion) return p
  } catch {}
  return null
}

export default function ExportarPDF({ s }: { s: Sueno }) {
  const generar = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const NAVY = [10, 22, 40] as [number, number, number]
    const GOLD = [212, 175, 55] as [number, number, number]
    const WHITE = [240, 240, 240] as [number, number, number]
    const MUTED = [160, 160, 180] as [number, number, number]
    const SECTION_BG = [20, 35, 60] as [number, number, number]

    const W = 210
    const H = 297

    // Fondo navy
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, W, H, 'F')

    // Barra superior dorada
    doc.setFillColor(...GOLD)
    doc.rect(0, 0, W, 2, 'F')

    // Logo/título app
    doc.setTextColor(...GOLD)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('✦  BITÁCORA DE SUEÑOS', 20, 14)

    // Fecha del sueño (derecha)
    doc.setTextColor(...MUTED)
    doc.setFontSize(8)
    const fechaFormateada = formatFechaLarga(s.fecha)
    doc.text(fechaFormateada, W - 20, 14, { align: 'right' })

    // Línea separadora
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.3)
    doc.line(20, 18, W - 20, 18)

    // Título del sueño
    doc.setTextColor(...WHITE)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    const tituloLines = doc.splitTextToSize(s.titulo, W - 40)
    doc.text(tituloLines, 20, 32)

    let y = 32 + tituloLines.length * 9

    // Emociones
    if (s.emociones.length > 0) {
      doc.setTextColor(...GOLD)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(s.emociones.join('  ·  '), 20, y + 4)
      y += 10
    }

    y += 6

    // Sección descripción
    doc.setFillColor(...SECTION_BG)
    doc.roundedRect(16, y, W - 32, 8, 2, 2, 'F')
    doc.setTextColor(...GOLD)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DESCRIPCIÓN', 22, y + 5.5)
    y += 13

    doc.setTextColor(...WHITE)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const descLines = doc.splitTextToSize(s.descripcion, W - 40)
    doc.text(descLines, 20, y)
    y += descLines.length * 5 + 10

    // Sección interpretación
    if (s.interpretacion) {
      const parsed = parsearInterpretacion(s.interpretacion)

      doc.setFillColor(...SECTION_BG)
      doc.roundedRect(16, y, W - 32, 8, 2, 2, 'F')
      doc.setTextColor(...GOLD)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('INTERPRETACIÓN IA', 22, y + 5.5)
      y += 13

      if (parsed) {
        const secciones = [
          { icono: '◈ SÍMBOLOS', texto: parsed.simbolos },
          { icono: '◈ ENSEÑANZA', texto: parsed.ensenanza },
          { icono: '◈ ACCIÓN', texto: parsed.accion },
        ]
        for (const sec of secciones) {
          if (y > 260) {
            doc.addPage()
            doc.setFillColor(...NAVY)
            doc.rect(0, 0, W, H, 'F')
            y = 20
          }
          doc.setTextColor(...GOLD)
          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.text(sec.icono, 20, y)
          y += 5
          doc.setTextColor(...WHITE)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          const lines = doc.splitTextToSize(sec.texto, W - 40)
          doc.text(lines, 20, y)
          y += lines.length * 5 + 7
        }
      } else {
        doc.setTextColor(...WHITE)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(s.interpretacion, W - 40)
        doc.text(lines, 20, y)
        y += lines.length * 5 + 10
      }
    }

    // Pie de página
    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.3)
    doc.line(20, H - 14, W - 20, H - 14)
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.text('Generado con Bitácora de Sueños', W / 2, H - 8, { align: 'center' })

    doc.save(`sueno-${s.fecha}-${s.titulo.slice(0, 30).replace(/\s+/g, '-')}.pdf`)
  }

  return (
    <button
      onClick={generar}
      className="flex items-center gap-2 text-amber-300 hover:text-amber-100 border border-amber-700/40 hover:border-amber-500/60 bg-amber-900/10 hover:bg-amber-900/20 text-sm px-4 py-2 rounded-xl transition"
    >
      <span>📑</span> Exportar PDF
    </button>
  )
}
