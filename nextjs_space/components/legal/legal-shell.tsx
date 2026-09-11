import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const YELLOW = '#FFD54F'

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex flex-col">
            <span className="font-script text-3xl leading-none" style={{ color: YELLOW }}>
              Niidea
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.25em] text-white/40">
              PLANES SORPRESA EN MADRID
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-extrabold leading-tight">{title}</h1>
        <p className="mt-3 text-sm text-white/40">Última actualización: {updated}</p>
        <div className="legal-body mt-10 space-y-6">{children}</div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <span className="font-script text-2xl" style={{ color: YELLOW }}>
            Niidea
          </span>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
            <Link href="/aviso-legal" className="transition-colors hover:text-white">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-white">
              Privacidad
            </Link>
            <Link href="/devoluciones" className="transition-colors hover:text-white">
              Devoluciones
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-white">{heading}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-white/70">{children}</div>
    </section>
  )
}
