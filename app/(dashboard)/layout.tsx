import Link from 'next/link'
import { logout } from '@/app/(auth)/actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-800/20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white font-semibold"
          >
            <span className="text-xl">🌙</span>
            <span className="hidden sm:inline text-sm">Bitácora de Sueños</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs sm:text-sm text-purple-300 hover:text-white hover:bg-purple-800/30 rounded-lg transition"
            >
              Sueños
            </Link>
            <Link
              href="/estadisticas"
              className="px-3 py-1.5 text-xs sm:text-sm text-purple-300 hover:text-white hover:bg-purple-800/30 rounded-lg transition"
            >
              Estadísticas
            </Link>
            <Link
              href="/nuevo-sueno"
              className="px-3 py-1.5 text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition font-medium"
            >
              + Nuevo
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs sm:text-sm text-purple-400 hover:text-white transition"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
