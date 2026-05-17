'use client'

import { useState, useTransition } from 'react'
import { interpretarSueno } from '../../actions'

export default function InterpretarButton({ suenoId }: { suenoId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    startTransition(async () => {
      const result = await interpretarSueno(suenoId)
      if (result?.error) setError(result.error)
    })
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center py-6 gap-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-300 text-sm">Interpretando tu sueño con IA...</p>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-3">
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
      >
        ✨ Interpretar con IA
      </button>
    </div>
  )
}
