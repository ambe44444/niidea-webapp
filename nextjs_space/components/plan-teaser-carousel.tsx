'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'

const YELLOW = '#FFD54F'

type Teaser = {
  img: string
  category: string
  title: string
  desc: string
  alt: string
}

const TEASERS: Teaser[] = [
  {
    img: 'https://cdn.abacus.ai/images/7951bb20-0ef8-4a75-b0a2-69afc66c8c3c.png',
    category: 'Restaurante',
    title: 'Una cena que no elegiste',
    desc: 'Mesa reservada, menú cerrado. Solo tienes que sentarte.',
    alt: 'Mesa de cena íntima con velas y copas de vino en un restaurante de noche',
  },
  {
    img: 'https://cdn.abacus.ai/images/2177dcc4-3046-4bb0-ab95-9e3eb737018d.png',
    category: 'Teatro',
    title: 'Butaca con tu nombre',
    desc: 'Se apagan las luces y no tienes ni idea de qué va.',
    alt: 'Interior de un teatro pequeño con el escenario iluminado y cortina roja',
  },
  {
    img: 'https://cdn.abacus.ai/images/48a9a75a-76ae-4d08-8278-ad7ca6e24928.png',
    category: 'Experiencia',
    title: 'Madrid desde arriba',
    desc: 'Una azotea, luces de la ciudad y cero planes que cancelar.',
    alt: 'Azotea nocturna en Madrid con luces de la ciudad y guirnaldas cálidas',
  },
  {
    img: 'https://cdn.abacus.ai/images/8aca8fa4-db46-4834-b61d-a562f6cea005.png',
    category: 'Ocio',
    title: 'La copa que no pediste',
    desc: 'Un sitio escondido y algo raro en la carta. Confía.',
    alt: 'Bar de cócteles oscuro tipo speakeasy con luz ámbar',
  },
  {
    img: 'https://cdn.abacus.ai/images/0edb9ffb-58d9-4121-9c70-d1fb8f4466e0.png',
    category: 'Experiencia',
    title: 'Salir con algo hecho',
    desc: 'Un taller de dos horas. Te llevas lo que hagas.',
    alt: 'Manos trabajando cerámica en un taller iluminado por una lámpara cálida',
  },
  {
    img: 'https://cdn.abacus.ai/images/ad95cae4-381c-4e54-9508-3c4c68f60f48.png',
    category: 'Fiesta',
    title: 'Acabar bailando',
    desc: 'Sin cola, sin lista. Solo aparece a la hora que te digamos.',
    alt: 'Siluetas de gente bailando en un local pequeño con luces cálidas',
  },
]

export function PlanTeaserCarousel() {
  const scroller = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = scroller.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: YELLOW }}>
              Podría tocarte
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Algunos planes que hemos montado
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
              Una muestra de lo que puede caerte. No decimos dónde, no decimos cuándo y
              nunca sabrás cuál era hasta el día antes.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Ver planes anteriores"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Ver más planes"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-6">
      <div
        ref={scroller}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {TEASERS.map((t) => (
          <article
            key={t.title}
            data-card
            className="group relative w-[248px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[#141414] sm:w-[272px]"
          >
            <div className="relative aspect-[3/4] w-full bg-[#1c1c1c]">
              <Image
                src={t.img}
                alt={t.alt}
                fill
                sizes="272px"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/25 to-transparent" />

              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-black"
                style={{ backgroundColor: YELLOW }}
              >
                {t.category}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-lg font-bold leading-snug text-white">{t.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-300">{t.desc}</p>
              </div>
            </div>
          </article>
        ))}

        <article
          data-card
          className="relative flex w-[248px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-[#111] px-6 text-center sm:w-[272px]"
        >
          <HelpCircle className="h-9 w-9" style={{ color: YELLOW }} />
          <h3 className="text-lg font-bold leading-snug text-white">Y muchos más</h3>
          <p className="text-[13px] leading-relaxed text-gray-400">
            El catálogo cambia cada semana. Lo tuyo puede no estar aquí.
          </p>
        </article>
      </div>
      </div>
    </section>
  )
}
