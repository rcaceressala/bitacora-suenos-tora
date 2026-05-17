'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '../actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-slate-950 to-purple-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌙</div>
          <h1 className="text-2xl font-bold text-white">Bitácora de Sueños</h1>
          <p className="text-purple-300 text-sm mt-1">Tu diario personal de sueños</p>
        </div>

        <form
          action={action}
          className="bg-white/5 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Iniciar sesión</h2>

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-300 text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm text-purple-200 mb-1.5">Correo electrónico</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="w-full bg-white/5 border border-purple-700/40 rounded-lg px-3 py-2.5 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-purple-200 mb-1.5">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-purple-700/40 rounded-lg px-3 py-2.5 text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 transition text-sm"
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-purple-300 mt-4">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
