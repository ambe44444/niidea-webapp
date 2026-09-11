'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function key(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function AvailabilityCalendar({
  value,
  onChange,
  availableDays,
  loading,
}: {
  value: string
  onChange: (date: string) => void
  availableDays: Record<string, string[]>
  loading: boolean
}) {
  const openDates = useMemo(
    () => Object.keys(availableDays).filter((d) => (availableDays[d]?.length ?? 0) > 0).sort(),
    [availableDays],
  )
  const firstOpen = openDates[0]

  const [cursor, setCursor] = useState({ year: 0, month: 0 })
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      const base = value || firstOpen
      const d = base ? new Date(`${base}T00:00:00Z`) : new Date()
      setCursor({ year: d.getUTCFullYear(), month: d.getUTCMonth() })
      setInitialized(true)
    }
  }, [value, firstOpen, initialized])

  const lastOpen = openDates[openDates.length - 1]
  const minCursor = firstOpen ? new Date(`${firstOpen}T00:00:00Z`) : null
  const maxCursor = lastOpen ? new Date(`${lastOpen}T00:00:00Z`) : null

  const canPrev = !minCursor
    ? false
    : cursor.year > minCursor.getUTCFullYear() ||
      (cursor.year === minCursor.getUTCFullYear() && cursor.month > minCursor.getUTCMonth())
  const canNext = !maxCursor
    ? false
    : cursor.year < maxCursor.getUTCFullYear() ||
      (cursor.year === maxCursor.getUTCFullYear() && cursor.month < maxCursor.getUTCMonth())

  const move = (delta: number) => {
    setCursor((c) => {
      const d = new Date(Date.UTC(c.year, c.month + delta, 1))
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() }
    })
  }

  const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month + 1, 0)).getUTCDate()
  // Lunes = 0
  const offset = (new Date(Date.UTC(cursor.year, cursor.month, 1)).getUTCDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canPrev}
          aria-label="Mes anterior"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold capitalize">
          {MONTHS[cursor.month]} {cursor.year}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!canNext}
          aria-label="Mes siguiente"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/70 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="py-1 text-center text-[10px] font-medium text-white/30">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />
          const k = key(cursor.year, cursor.month, day)
          const open = (availableDays[k]?.length ?? 0) > 0
          const selected = value === k
          return (
            <button
              key={k}
              type="button"
              disabled={!open}
              onClick={() => onChange(k)}
              title={open ? 'Hay planes disponibles' : 'Sin planes disponibles este día'}
              className={`h-9 rounded-lg text-sm transition-colors ${
                selected
                  ? 'bg-[#FFD54F] font-bold text-black'
                  : open
                    ? 'bg-white/[0.06] text-white hover:bg-white/[0.14]'
                    : 'cursor-not-allowed text-white/15 line-through'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-white/35">
        {loading
          ? 'Comprobando disponibilidad...'
          : openDates.length === 0
            ? 'Ahora mismo no hay fechas disponibles para ese número de personas. Prueba con un grupo más pequeño.'
            : 'Solo puedes elegir días en los que tenemos planes preparados. Los días tachados están cerrados.'}
      </p>
    </div>
  )
}
