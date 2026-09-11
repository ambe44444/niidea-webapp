'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'

const YELLOW = '#FFD54F'
const VISIBLE = 6

export type PublicReview = {
  name: string
  stars: number
  level: string | null
  text: string
}

export function ReviewList({ reviews }: { reviews: PublicReview[] }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = reviews.length > VISIBLE
  const shown = expanded ? reviews : reviews.slice(0, VISIBLE)

  return (
    <div>
      <div className="mt-10 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
        {shown.map((r, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-black"
                style={{ background: YELLOW }}
              >
                {r.name?.[0] ?? '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.stars }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-3 w-3 fill-current"
                      style={{ color: YELLOW }}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-white/30">{r.level}</span>
                </div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">{r.text}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            {expanded ? (
              <>
                Ver menos
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver más reseñas ({reviews.length - VISIBLE})
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
