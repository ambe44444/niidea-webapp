'use client'

import { useState } from 'react'
import { Star, Send, Check } from 'lucide-react'

const YELLOW = '#FFD54F'
const LEVELS = ['Soft', 'Medium', 'Full']

export function ReviewForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [stars, setStars] = useState(5)
  const [level, setLevel] = useState('Medium')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text, stars, level }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'No se pudo enviar la reseña.')
      } else {
        setDone(true)
      }
    } catch {
      setError('No se pudo enviar la reseña. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Check className="mx-auto h-8 w-8" style={{ color: YELLOW }} />
        <p className="mt-3 font-semibold text-white">¡Gracias por tu reseña!</p>
        <p className="mt-1 text-sm text-white/50">
          La revisamos antes de publicarla para evitar spam. Aparecerá aquí en breve.
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
        >
          <Star className="h-4 w-4" style={{ color: YELLOW }} />
          Escribe tu reseña
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <p className="text-sm font-semibold text-white">Cuenta tu experiencia</p>
      <p className="mt-1 text-xs text-white/40">
        Sin spoilers, por favor. Revisamos las reseñas antes de publicarlas.
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre (ej. Marta G.)"
          maxLength={40}
          required
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none sm:w-40"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l} className="bg-[#111]">
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-white/40">Puntuación:</span>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStars(s)}
            aria-label={`${s} estrellas`}
            className="transition hover:scale-110"
          >
            <Star
              className="h-5 w-5"
              style={{ color: s <= stars ? YELLOW : 'rgba(255,255,255,0.2)' }}
              fill={s <= stars ? YELLOW : 'transparent'}
            />
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué tal fue tu plan sorpresa?"
        rows={4}
        maxLength={600}
        required
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
      />
      <p className="mt-1 text-right text-[11px] text-white/25">{text.length}/600</p>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: YELLOW }}
        >
          <Send className="h-4 w-4" />
          {sending ? 'Enviando…' : 'Enviar reseña'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-white/40 transition hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
