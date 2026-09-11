import Image from 'next/image'
import Link from 'next/link'
import {
  Drama,
  MapPin,
  Star,
  ArrowRight,
  ShoppingCart,
  Gift,
  MessageCircle,
  Smile,
  ChevronDown,
  Check,
  Menu,
  Minus,
  Plus,
  Lock,
  Quote,
} from 'lucide-react'
import { PlanTeaserCarousel } from '@/components/plan-teaser-carousel'
import { ReviewForm } from '@/components/review-form'
import { ReviewList } from '@/components/review-list'
import { Faq } from '@/components/faq'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const YELLOW = '#FFD54F'

const REVIEWS = [
  { name: 'Marta G.', stars: 5, level: 'Medium', text: 'No tenía ni idea de lo que íbamos a hacer y fue lo mejor. Cenamos en un sitio increíble y acabamos en un speakeasy secreto. ¡Repetimos seguro!' },
  { name: 'Carlos R.', stars: 5, level: 'Full', text: 'Organizamos la despedida de mi mejor amigo con NiIdea. La experiencia Full superó todas las expectativas. No puedo dar detalles porque arruinaría la sorpresa 😏' },
  { name: 'Laura M.', stars: 5, level: 'Soft', text: 'Plan tranquilo pero muy currado. Nos llevaron a un sitio que jamás habríamos descubierto solos. Perfecto para una cita.' },
  { name: 'Javi P.', stars: 4, level: 'Medium', text: 'La incertidumbre es lo mejor. Pasamos toda la semana intentando adivinar qué sería y al final fue algo completamente diferente. Genial.' },
  { name: 'Andrea S.', stars: 5, level: 'Full', text: 'Éramos 6 y nos organizaron una noche que parecía sacada de una peli. Cada detalle pensado. La mejor inversión de 35€ de mi vida.' },
  { name: 'Pablo D.', stars: 5, level: 'Medium', text: 'Le regalé una experiencia NiIdea a mi pareja por su cumple. Ella flipó. Dice que ha sido el mejor regalo que le han hecho nunca.' },
  { name: 'Lucía H.', stars: 4, level: 'Soft', text: 'Muy buen plan para un domingo diferente. Tranquilo pero original. El sitio al que nos mandaron tenía unas vistas brutales.' },
  { name: 'Marcos V.', stars: 5, level: 'Full', text: 'Tercer NiIdea que compro. Siempre diferente, siempre sorpresa, siempre bien. Adicto total.' },
  { name: 'Sofía T.', stars: 5, level: 'Medium', text: 'Vinimos 4 amigas de fuera de Madrid y dejamos la noche en manos de NiIdea. No pudimos elegir mejor. Gracias por el planazo.' },
  { name: 'Diego L.', stars: 4, level: 'Soft', text: 'El concepto me encanta. Pagas, confías, y te sorprenden. Simple y efectivo. El plan Soft está genial para probar.' },
  { name: 'Elena F.', stars: 5, level: 'Full', text: 'Compramos el Full sin pensarlo y madre mía. No voy a spoilear pero involucró una terraza secreta y algo que nunca habíamos hecho. 10/10.' },
  { name: 'Álex N.', stars: 5, level: 'Medium', text: 'Se lo regalé a mis padres para su aniversario. Me llamaron después diciendo que hacía años que no se lo pasaban tan bien. Gracias NiIdea.' },
  { name: 'Raquel B.', stars: 5, level: 'Full', text: 'Si te gusta la adrenalina y lo inesperado, el Full es para ti. No puedo decir más. Solo hazlo.' },
  { name: 'Hugo C.', stars: 4, level: 'Medium', text: 'Recibir el email el día antes con la ubicación es lo que más mola. La emoción de no saber hasta el último momento es brutal.' },
  { name: 'Ines K.', stars: 5, level: 'Soft', text: 'Primera vez que pruebo algo así y ha sido precioso. Un plan súper cuidado en un barrio que no conocía de Madrid. Muy recomendable.' },
  { name: 'Tomás A.', stars: 5, level: 'Full', text: 'Cuarto NiIdea y no me canso. Cada vez subo de nivel y cada vez me sorprenden más. Esto es una droga sana.' },
  { name: 'Carmen J.', stars: 4, level: 'Medium', text: 'Al principio me daba cosa no saber qué iba a hacer, pero la confianza mereció la pena. Plan redondo de principio a fin.' },
  { name: 'Nacho E.', stars: 5, level: 'Full', text: 'Compré para 8 personas y fue una locura. NiIdea gestionó todo perfecto. Ya estamos planeando el siguiente.' },
  { name: 'Claudia W.', stars: 5, level: 'Medium', text: 'Me encanta que no haya spoilers en ningún sitio. La experiencia es genuinamente sorpresa. ¡Y qué sorpresa! 🔥' },
  { name: 'Fernando O.', stars: 5, level: 'Soft', text: 'El Soft es perfecto para empezar. Plan relajado, buen rollo, y un sitio con un encanto especial. Ya quiero probar el Medium.' },
]

/* ---------------- Phone mockups ---------------- */



function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[240px] shrink-0 rounded-[2.2rem] border border-white/10 bg-black p-2 shadow-2xl shadow-black/60">
      <div className="relative overflow-hidden rounded-[1.7rem] bg-[#0B0B0B] h-[480px]">
        {children}
      </div>
    </div>
  )
}

function MockHome() {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="font-script text-2xl leading-none" style={{ color: YELLOW }}>
          Niidea
        </span>
        <Menu className="h-5 w-5 text-white/80" />
      </div>
      <div className="relative h-[300px] w-full">
        <Image
          src="/hero-friends.png"
          alt="Amigos disfrutando de la noche en Madrid"
          fill
          className="object-cover"
          sizes="240px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-lg font-extrabold leading-tight text-white">
            No saber nunca fue{' '}
            <span style={{ color: YELLOW }}>tan buena idea.</span>
          </p>
          <p className="mt-1 text-[10px] text-white/60">
            Compra un plan sorpresa en Madrid.
          </p>
        </div>
      </div>
      <div className="px-4 pt-3">
        <div
          className="rounded-xl py-2.5 text-center text-xs font-semibold text-black"
          style={{ background: YELLOW }}
        >
          Comprar sin saber
        </div>
        <div className="mt-3 flex justify-center text-white/40">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </PhoneFrame>
  )
}

function MockSelect() {
  return (
    <PhoneFrame>
      <div className="px-4 pt-3">
        <p className="mb-3 mt-2 text-base font-bold text-white">Elige tu experiencia</p>

        <p className="mb-1 text-[10px] text-white/50">1. Fecha</p>
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/80">
          <span>Sábado, 18 de mayo</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </div>

        <p className="mb-1 text-[10px] text-white/50">2. Personas</p>
        <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
          <Minus className="h-3.5 w-3.5 text-white/50" />
          <span className="text-sm font-semibold text-white">2</span>
          <Plus className="h-3.5 w-3.5 text-white/50" />
        </div>

        <p className="mb-1 text-[10px] text-white/50">3. Nivel de experiencia</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            <div>
              <p className="text-[11px] font-semibold text-white">Soft</p>
              <p className="text-[9px] text-white/40">Plan tranquilo</p>
            </div>
            <span className="text-[10px] text-white/60">25€ / pers.</span>
          </div>
          <div
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{ borderColor: YELLOW, background: 'rgba(255,213,79,0.06)' }}
          >
            <div>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-white">
                Medium
                <span
                  className="rounded px-1 text-[7px] font-bold text-black"
                  style={{ background: YELLOW }}
                >
                  POPULAR
                </span>
              </p>
              <p className="text-[9px] text-white/40">Plan sorpresa top</p>
            </div>
            <span className="text-[10px] text-white/60">30€ / pers.</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
            <div>
              <p className="text-[11px] font-semibold text-white">Full</p>
              <p className="text-[9px] text-white/40">Experiencia loca</p>
            </div>
            <span className="text-[10px] text-white/60">35€ / pers.</span>
          </div>
        </div>

        <div
          className="mt-4 rounded-xl py-2.5 text-center text-xs font-semibold text-black"
          style={{ background: YELLOW }}
        >
          Continuar
        </div>
      </div>
    </PhoneFrame>
  )
}

function MockConfirm() {
  return (
    <PhoneFrame>
      <div className="relative h-full w-full">
        <Image
          src="/confetti.png"
          alt="Amigos celebrando con confeti"
          fill
          className="object-cover opacity-60"
          sizes="240px"
        />
        <div className="absolute inset-0 bg-[#0B0B0B]/70" />
        <div className="relative flex h-full flex-col items-center px-5 pt-10 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border-2"
            style={{ borderColor: YELLOW }}
          >
            <Check className="h-7 w-7" style={{ color: YELLOW }} />
          </div>
          <p className="mt-4 text-lg font-extrabold text-white">¡Compra confirmada!</p>
          <p className="mt-1 text-[11px] text-white/70">
            Tu plan está listo… pero aún no lo sabes 😏
          </p>

          <div className="mt-5 w-full space-y-2 text-left">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
              <MessageCircle className="h-4 w-4 shrink-0" style={{ color: YELLOW }} />
              <span className="text-[9px] text-white/70">
                Te enviamos los detalles por email el día antes.
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2">
              <Star className="h-4 w-4 shrink-0" style={{ color: YELLOW }} />
              <span className="text-[9px] text-white/70">
                Prepárate para vivir una experiencia única en Madrid.
              </span>
            </div>
          </div>

          <div
            className="mt-auto mb-5 w-full rounded-xl py-2.5 text-center text-xs font-semibold text-black"
            style={{ background: YELLOW }}
          >
            Volver al inicio
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

/* ---------------- Reusable bits ---------------- */

function Feature({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(255,213,79,0.4)' }}
      >
        <Icon className="h-5 w-5" style={{ color: YELLOW }} />
      </div>
      <span className="text-sm text-white/80">{title}</span>
    </div>
  )
}

function LevelCard({
  name,
  price,
  desc,
  popular,
}: {
  name: string
  price: string
  desc: string
  popular?: boolean
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition-colors ${
        popular ? 'bg-white/[0.04]' : 'border-white/10 bg-white/[0.02]'
      }`}
      style={popular ? { borderColor: YELLOW } : undefined}
    >
      {popular && (
        <span
          className="absolute -top-2.5 right-5 rounded px-2 py-0.5 text-[10px] font-bold text-black"
          style={{ background: YELLOW }}
        >
          POPULAR
        </span>
      )}
      <p className="text-lg font-bold text-white">{name}</p>
      <p className="mt-1 text-sm text-white/50">{desc}</p>
      <p className="mt-4 text-3xl font-extrabold" style={{ color: YELLOW }}>
        {price}
        <span className="ml-1 text-sm font-normal text-white/40">/ persona</span>
      </p>
    </div>
  )
}

function Step({
  icon: Icon,
  n,
  title,
  desc,
}: {
  icon: any
  n: number
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border"
        style={{ borderColor: 'rgba(255,213,79,0.4)' }}
      >
        <Icon className="h-6 w-6" style={{ color: YELLOW }} />
      </div>
      <p className="text-sm font-semibold text-white">
        {n}. {title}
      </p>
      <p className="mt-1 max-w-[180px] text-xs text-white/50">{desc}</p>
    </div>
  )
}

/* ---------------- Page ---------------- */

type PublicReview = { name: string; stars: number; level: string | null; text: string }

async function getApprovedReviews(): Promise<PublicReview[]> {
  try {
    return await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 60,
      select: { name: true, stars: true, level: true, text: true },
    })
  } catch {
    return []
  }
}

export default async function Home() {
  const dbReviews = await getApprovedReviews()
  const allReviews: PublicReview[] = [...dbReviews, ...REVIEWS]

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Hero con foto a todo el ancho, header incluido */}
      <section className="relative overflow-hidden">
        {/* Foto de fondo a sangre */}
        <div className="absolute inset-0">
          <Image
            src="https://cdn.abacus.ai/images/e9db27e0-3159-4e9e-bdf0-f32e00712f0d.png"
            alt="Amigos disfrutando de la noche en Madrid"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Degradado lateral para que el texto se lea */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/85 to-[#0B0B0B]/25 lg:via-[#0B0B0B]/70 lg:to-transparent" />
          {/* Degradado superior e inferior */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0B0B]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
        </div>

        {/* Header sobre la foto */}
        <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
          <div>
            <span className="font-script text-4xl leading-none" style={{ color: YELLOW }}>
              Niidea
            </span>
            <p className="mt-1 text-[10px] font-medium tracking-[0.25em] text-white/50">
              PLANES SORPRESA EN MADRID
            </p>
          </div>
          <Link
            href="/buy"
            className="hidden rounded-full px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 sm:block"
            style={{ background: YELLOW }}
          >
            Comprar sin saber
          </Link>
        </header>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24 lg:pb-32 lg:pt-32">
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              No saber
              <br />
              nunca fue{' '}
              <span style={{ color: YELLOW }}>tan buena idea.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
              Compra un plan sorpresa en Madrid. Nosotros organizamos.
              Tú solo apareces.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Feature icon={Drama} title="100% seleccionados" />
              <Feature icon={MapPin} title="Madrid" />
              <Feature icon={Star} title="Desde 25€/pers." />
            </div>

            <Link
              href="/buy"
              className="mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-black shadow-lg shadow-yellow-500/20 transition-transform hover:scale-105"
              style={{ background: YELLOW }}
            >
              Comprar sin saber
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Podría tocarte */}
      <PlanTeaserCarousel />

      {/* Niveles */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-extrabold">Elige tu nivel</h2>
        <p className="mt-2 text-center text-white/50">
          Tú decides la intensidad. Nosotros el plan.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <LevelCard name="Soft" price="25€" desc="Plan tranquilo" />
          <LevelCard name="Medium" price="30€" desc="Plan sorpresa top" popular />
          <LevelCard name="Full" price="35€" desc="Experiencia loca" />
        </div>
      </section>

      {/* Reseñas */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-extrabold">Lo que dicen de nosotros</h2>
        <p className="mt-2 text-center text-white/50">
          Experiencias reales de gente que se dejó sorprender en Madrid
        </p>
        <ReviewList reviews={allReviews} />

        <ReviewForm />
      </section>

      {/* FAQs */}
      <Faq />

      {/* Cómo funciona + CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="mb-10 text-2xl font-extrabold">¿Cómo funciona?</h2>
            <div className="flex flex-col items-stretch gap-8 sm:flex-row sm:items-start">
              <Step
                icon={ShoppingCart}
                n={1}
                title="Compras"
                desc="Eliges fecha, personas y nivel de experiencia."
              />
              <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-white/30 sm:block" />
              <Step
                icon={Gift}
                n={2}
                title="Preparamos"
                desc="Seleccionamos el mejor plan sorpresa para ti."
              />
              <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-white/30 sm:block" />
              <Step
                icon={MessageCircle}
                n={3}
                title="Te avisamos"
                desc="El día antes te enviamos todos los detalles por email."
              />
              <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-white/30 sm:block" />
              <Step
                icon={Smile}
                n={4}
                title="Disfrutas"
                desc="Vive la experiencia sin saber nada más. Solo disfruta."
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#171717] p-8">
            <p className="text-xl font-bold leading-snug text-white">
              Hecho para los que buscan algo diferente.
            </p>
            <Link
              href="/buy"
              className="mt-4 inline-flex items-center gap-2 text-lg font-bold transition-transform hover:translate-x-1"
              style={{ color: YELLOW }}
            >
              ¿Te atreves a no saber?
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10">
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="font-script text-2xl" style={{ color: YELLOW }}>
              Niidea
            </span>
            <p className="flex items-center gap-2 text-xs text-white/40">
              <Lock className="h-3.5 w-3.5" />
              Sin devoluciones · Solo crédito · Madrid
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
            <Link href="/#faq" className="transition-colors hover:text-white">
              Preguntas frecuentes
            </Link>
            <span className="text-white/15">·</span>
            <Link href="/aviso-legal" className="transition-colors hover:text-white">
              Aviso legal
            </Link>
            <span className="text-white/15">·</span>
            <Link href="/privacidad" className="transition-colors hover:text-white">
              Política de privacidad
            </Link>
            <span className="text-white/15">·</span>
            <Link href="/devoluciones" className="transition-colors hover:text-white">
              Política de devoluciones
            </Link>
          </nav>
          <p className="text-[11px] text-white/25">
            © 2026 NiIdea · Planes sorpresa en Madrid
          </p>
        </div>
      </footer>
    </main>
  )
}