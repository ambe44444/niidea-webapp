'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const YELLOW = '#FFD54F'

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: '¿Qué tipo de experiencias me puede tocar?',
    a: (
      <>
        Cenas en restaurantes con carácter, teatro y microteatro, bares de coctelería escondidos,
        azoteas con vistas, talleres (cerámica, cata, cocina), planes de ocio tipo juegos o escape,
        y noches que acaban bailando. También spa y masajes cuando están en el centro de Madrid y se
        pueden reservar online. Todo es en Madrid y todo se elige según el nivel que compres: Soft
        (tranquilo), Medium (sorpresa top) o Full (más intenso).
      </>
    ),
  },
  {
    q: '¿Y si el plan no me gusta?',
    a: (
      <>
        Es lo primero que decimos de frente: no todos los planes pueden gustar a todo el mundo, y
        parte de la gracia es aceptar eso. Lo que sí garantizamos es el trabajo detrás: elegimos
        sitios reales, contrastados y con buena valoración, ajustados al nivel que has comprado, y
        nunca te mandamos a un sitio al que no iríamos nosotras. Si algo sale mal por nuestra parte,
        escríbenos y lo arreglamos.
      </>
    ),
  },
  {
    q: '¿Se devuelve el dinero?',
    a: (
      <>
        No. NiIdea no realiza devoluciones de dinero en ningún caso, tal y como se recoge en la{' '}
        <a href="/devoluciones" className="underline decoration-dotted hover:text-white">
          política de devoluciones
        </a>
        . Lo que sí puedes hacer es cambiar tu compra por otra experiencia equivalente o mantener el
        importe como crédito a tu favor.
      </>
    ),
  },
  {
    q: '¿Y si al final no podemos ir?',
    a: (
      <>
        Se cambia la fecha. Avísanos con al menos 24 horas de antelación escribiendo a
        almublanq@gmail.com y te movemos la reserva a otro día, sujeto a disponibilidad y sin coste.
        Si avisas con menos de 24 horas o no apareces, la experiencia se considera disfrutada. Ten en
        cuenta que el plan de la nueva fecha puede ser distinto: sigue siendo sorpresa.
      </>
    ),
  },
  {
    q: '¿Cuándo sé dónde tengo que ir?',
    a: (
      <>
        El día antes de tu experiencia recibes un email con el sitio, la hora y todo lo que necesitas
        saber. Antes de eso no hay pistas: esa es la idea.
      </>
    ),
  },
  {
    q: '¿Qué incluye el precio?',
    a: (
      <>
        El precio es por persona (Soft 25€, Medium 30€, Full 35€) e incluye la experiencia reservada a
        tu nombre. No incluye transporte ni consumiciones extra que pidas fuera de lo previsto. Si en
        algún plan hay algo adicional a pagar allí, te lo decimos en el email del día antes.
      </>
    ),
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center text-3xl font-extrabold">Preguntas frecuentes</h2>
      <p className="mt-2 text-center text-white/50">
        Lo que nos preguntáis antes de atreveros.
      </p>

      <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.03]"
              >
                <span className="text-sm font-semibold text-white sm:text-base">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: YELLOW }}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-[13px] leading-relaxed text-white/60">{f.a}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
