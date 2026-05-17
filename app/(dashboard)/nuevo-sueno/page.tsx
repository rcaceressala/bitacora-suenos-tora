'use client'

import { useActionState, useState } from 'react'
import { crearSueno } from '../actions'

const EMOCIONES = [
  'alegría',
  'miedo',
  'ansiedad',
  'paz',
  'confusión',
  'tristeza',
  'asombro',
  'amor',
  'soledad',
  'euforia',
  'angustia',
  'curiosidad',
]

export default function NuevoSuenoPage() {
  const [state, action, pending] = useActionState(crearSueno, null)
  const [emociones, setEmociones] = useState<string[]>([])

  const toggle = (e: string) =>
    setEmociones((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    )

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Nuevo Sueño</h1>
        <p className="text-purple-300 text-sm">
          Registra tu sueño con todos los detalles que recuerdes
        </p>
      </div>

      <form action={action} className="space-y-5">
        <input type="hidden" name="emociones" value={emociones.join(',')} />

        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {state.error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Título del sueño
          </label>
          <input
            name="titulo"
            required
            maxLength={100}
            placeholder="Ej: El laberinto de cristal"
            className="w-full bg-white/5 border border-purple-700/40 rounded-xl px-4 py-3 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Fecha del sueño
          </label>
          <input
            name="fecha"
            type="date"
            required
            defaultValue={today}
            max={today}
            className="w-full bg-white/5 border border-purple-700/40 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition text-sm [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Descripción del sueño
          </label>
          <textarea
            name="descripcion"
            required
            rows={6}
            maxLength={3000}
            placeholder="Describe tu sueño con el mayor detalle posible: qué viste, qué ocurrió, quiénes aparecieron..."
            className="w-full bg-white/5 border border-purple-700/40 rounded-xl px-4 py-3 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Emociones{' '}
            <span className="text-purple-400 font-normal">
              ({emociones.length} seleccionadas)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOCIONES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => toggle(e)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  emociones.includes(e)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-purple-300 border border-purple-700/40 hover:border-purple-500/60'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition"
        >
          {pending ? 'Guardando sueño...' : 'Guardar sueño'}
        </button>
      </form>
    </div>
  )
}
