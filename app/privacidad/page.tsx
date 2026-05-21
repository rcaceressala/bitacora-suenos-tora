import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad — Bitácora de Sueños',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mb-6 transition"
          >
            ← Volver
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl">🌙</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Política de Privacidad</h1>
              <p className="text-purple-400 text-sm">Bitácora de Sueños · Mayo 2026</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-purple-100/80 text-sm leading-relaxed">

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">1. Datos que recopilamos</h2>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Correo electrónico:</strong> al crear tu cuenta, para autenticación.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Sueños registrados:</strong> título, descripción, fecha y emociones que introduces voluntariamente.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Interpretaciones IA:</strong> el texto generado por inteligencia artificial a partir de tu sueño.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Datos de suscripción:</strong> estado de tu plan (gratuito o premium) a través de Lemon Squeezy.</span></li>
            </ul>
          </section>

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">2. Cómo usamos tus datos</h2>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span>Mostrarte tu historial personal de sueños e interpretaciones.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span>Enviar el contenido de tu sueño a la API de Anthropic (Claude) para generar una interpretación. El texto no se usa para entrenar modelos de IA.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span>Gestionar tu suscripción y procesar pagos a través de Lemon Squeezy.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span>Aplicar el límite de interpretaciones gratuitas del plan free.</span></li>
            </ul>
          </section>

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">3. Compartición de datos con terceros</h2>
            <p className="mb-3">No vendemos ni compartimos tus datos personales con terceros. Únicamente trabajamos con los siguientes proveedores de infraestructura:</p>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Supabase</strong> — base de datos y autenticación. Tus datos se almacenan en servidores seguros con cifrado en reposo.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Anthropic</strong> — generación de interpretaciones mediante inteligencia artificial. Solo recibe el contenido del sueño que solicitas interpretar.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Lemon Squeezy</strong> — procesamiento de pagos y gestión de suscripciones. Maneja tus datos de pago de forma segura bajo su propia política de privacidad.</span></li>
            </ul>
          </section>

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">4. Tus derechos</h2>
            <ul className="space-y-2 list-none">
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Acceso:</strong> puedes ver todos tus sueños e interpretaciones en el dashboard en cualquier momento.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Eliminación:</strong> puedes solicitar la eliminación completa de tu cuenta y todos tus datos escribiendo a nuestro correo de contacto. Procesamos las solicitudes en un plazo máximo de 7 días.</span></li>
              <li className="flex gap-2"><span className="text-purple-400 shrink-0">·</span><span><strong className="text-white">Portabilidad:</strong> puedes exportar tus sueños en formato texto o PDF desde la app.</span></li>
            </ul>
          </section>

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">5. Seguridad</h2>
            <p>Tus datos se transmiten siempre mediante HTTPS. El acceso a tu información está protegido por Row Level Security (RLS) en la base de datos, lo que garantiza que solo tú puedes ver tus propios sueños.</p>
          </section>

          <section className="bg-white/5 border border-purple-800/20 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">6. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad, solicitud de eliminación de datos o ejercicio de tus derechos, escríbenos a:</p>
            <a
              href="mailto:rcaceressalas.ok@gmail.com"
              className="inline-block mt-2 text-purple-400 hover:text-purple-300 transition font-medium"
            >
              rcaceressalas.ok@gmail.com
            </a>
          </section>

          <p className="text-center text-purple-500 text-xs pt-2">
            Última actualización: Mayo 2026
          </p>
        </div>
      </div>
    </div>
  )
}
