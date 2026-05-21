'use client'

import { useState } from 'react'
import { FREE_LIMIT } from '@/lib/subscriptions'

interface Props {
  isActive: boolean
  usedThisMonth: number
}

export default function SubscriptionBanner({ isActive, usedThisMonth }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isActive) {
    return (
      <div className="mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/20 border border-green-700/30 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-xl">✨</span>
        <p className="text-green-300 text-sm font-medium">
          Plan Premium activo — interpretaciones ilimitadas
        </p>
      </div>
    )
  }

  const remaining = Math.max(0, FREE_LIMIT - usedThisMonth)
  const urgent = remaining === 0

  async function handleSubscribe() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al conectar con el sistema de pago')
        return
      }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('No se recibió URL de pago')
      }
    } catch {
      setError('Error de red. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`mb-6 border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
        urgent
          ? 'bg-gradient-to-r from-red-900/30 to-purple-900/20 border-red-700/40'
          : 'bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border-indigo-700/30'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl">{urgent ? '🔒' : '🌙'}</span>
        <div>
          <p className={`text-sm font-semibold ${urgent ? 'text-red-300' : 'text-indigo-200'}`}>
            {urgent
              ? 'Límite mensual alcanzado'
              : `${remaining} interpretación${remaining !== 1 ? 'es' : ''} gratis restante${remaining !== 1 ? 's' : ''} este mes`}
          </p>
          <p className="text-xs text-purple-400 mt-0.5">
            Plan gratuito · {usedThisMonth}/{FREE_LIMIT} usadas
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-1">
        {error && (
          <p className="text-red-400 text-xs max-w-xs text-right">{error}</p>
        )}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          {loading ? 'Redirigiendo…' : 'Suscribirse por CLP 5.990/mes'}
        </button>
      </div>
    </div>
  )
}
