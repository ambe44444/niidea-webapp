'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, Mail, Phone, Users,
  Minus, Plus, Zap, Sparkles, Crown, Loader2, AlertTriangle, Check
} from 'lucide-react'
import { AvailabilityCalendar } from '@/components/availability-calendar'

const LEVELS = [
  { key: 'soft', label: 'Soft', price: 25, icon: Zap, color: '#6EE7B7', desc: 'Algo chill, sin compromisos. Un buen comienzo.' },
  { key: 'medium', label: 'Medium', price: 30, icon: Sparkles, color: '#FFD54F', desc: 'Un punto más. Puede pasar de todo.' },
  { key: 'full', label: 'Full', price: 35, icon: Crown, color: '#F87171', desc: 'Sin límites. No preguntes, solo ven.' },
]



export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFD54F] animate-spin" /></div>}>
      <BuyPageInner />
    </Suspense>
  )
}

function BuyPageInner() {
  const searchParams = useSearchParams()
  const cancelled = searchParams?.get('cancelled') === 'true'

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [people, setPeople] = useState(2)
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableDays, setAvailableDays] = useState<Record<string, string[]>>({})
  const [loadingAvail, setLoadingAvail] = useState(true)

  // La disponibilidad depende del tamaño del grupo: recargamos al cambiarlo.
  useEffect(() => {
    let cancelledReq = false
    setLoadingAvail(true)
    fetch(`/api/availability?people=${people}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelledReq) return
        setAvailableDays(d?.days ?? {})
      })
      .catch(() => {
        if (!cancelledReq) setAvailableDays({})
      })
      .finally(() => {
        if (!cancelledReq) setLoadingAvail(false)
      })
    return () => { cancelledReq = true }
  }, [people])

  const levelsForDate = date ? (availableDays[date] ?? []) : []

  // Si al cambiar de grupo o de fecha lo elegido deja de existir, lo limpiamos.
  useEffect(() => {
    if (date && !loadingAvail && (availableDays[date]?.length ?? 0) === 0) {
      setDate('')
      setLevel('')
    }
  }, [availableDays, date, loadingAvail])

  useEffect(() => {
    if (level && date && !levelsForDate.includes(level)) setLevel('')
  }, [date, level, levelsForDate])

  const selectedLevel = LEVELS.find((l) => l.key === level)
  const totalPrice = (selectedLevel?.price ?? 0) * people

  const canNext = useCallback(() => {
    if (step === 1) return email.includes('@') && phone.length >= 9
    if (step === 2) return date !== '' && people >= 1 && (availableDays[date]?.length ?? 0) > 0
    if (step === 3) return level !== '' && levelsForDate.includes(level)
    return true
  }, [step, email, phone, date, people, level, availableDays, levelsForDate])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone: `+34${phone}`, date, people, level }),
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setError(data?.error ?? 'Error al crear el pago')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#FFD54F] animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Preparando tu sorpresa...</p>
          <p className="text-white/40 text-sm mt-2">No cierres esta ventana</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-2xl mx-auto w-full">
        <Link href="/" className="text-[#FFD54F] font-bold text-lg">NiIdea</Link>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#FFD54F] w-8' : 'bg-white/10 w-4'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-10">
        <div className="w-full max-w-md">
          {cancelled && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">Pago cancelado</p>
                <p className="text-white/50 text-xs mt-1">Puedes intentarlo de nuevo cuando quieras.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">¿Quién eres?</h2>
              <p className="text-white/40 text-sm mb-8">Para enviarte la info el día de la experiencia.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-white/40 text-sm">+34</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="612345678"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-[4.5rem] pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD54F]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">¿Cuándo y cuántos?</h2>
              <p className="text-white/40 text-sm mb-8">Elige la fecha y el número de personas.</p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Fecha</label>
                  <AvailabilityCalendar
                    value={date}
                    onChange={setDate}
                    availableDays={availableDays}
                    loading={loadingAvail}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">Personas</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-3xl font-bold">{people}</span>
                      <span className="text-white/40 text-sm ml-2">{people === 1 ? 'persona' : 'personas'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPeople(Math.min(10, people + 1))}
                      className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">¿Cuánto te atreves?</h2>
              <p className="text-white/40 text-sm mb-8">Elige el nivel de intensidad.</p>
              <div className="space-y-3">
                {LEVELS.map((l) => {
                  const soldOut = !levelsForDate.includes(l.key)
                  return (
                  <button
                    key={l.key}
                    type="button"
                    disabled={soldOut}
                    onClick={() => setLevel(l.key)}
                    title={soldOut ? 'Sin planes de este nivel para la fecha elegida' : undefined}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      soldOut
                        ? 'border-white/[0.04] bg-white/[0.02] opacity-40 cursor-not-allowed'
                        : level === l.key
                          ? 'border-[#FFD54F]/50 bg-[#FFD54F]/[0.05]'
                          : 'border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${l.color}15` }}>
                          <l.icon className="w-5 h-5" style={{ color: l.color }} />
                        </div>
                        <div>
                          <p className="font-semibold">{l.label}</p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {soldOut ? 'Agotado para esta fecha' : l.desc}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: l.color }}>{l.price}€</p>
                        <p className="text-white/30 text-xs">/ persona</p>
                      </div>
                    </div>
                    {level === l.key && (
                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#FFD54F]" />
                        <span className="text-sm text-white/60">Total: <strong className="text-white">{l.price * people}€</strong> para {people} {people === 1 ? 'persona' : 'personas'}</span>
                      </div>
                    )}
                  </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Resumen</h2>
              <p className="text-white/40 text-sm mb-8">Confirma los detalles de tu plan sorpresa.</p>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Email</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Teléfono</span>
                  <span>+34 {phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Fecha</span>
                  <span>{date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Personas</span>
                  <span>{people}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Nivel</span>
                  <span className="font-medium" style={{ color: selectedLevel?.color ?? '#fff' }}>{selectedLevel?.label ?? ''}</span>
                </div>
                <div className="border-t border-white/[0.06] pt-4 flex justify-between">
                  <span className="text-white/50">Total</span>
                  <span className="text-2xl font-bold text-[#FFD54F]">{totalPrice}€</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={() => canNext() && setStep(step + 1)}
                disabled={!canNext()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FFD54F] text-[#0B0B0B] font-semibold hover:bg-[#FFCA28] transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3.5 rounded-xl bg-[#FFD54F] text-[#0B0B0B] font-bold hover:bg-[#FFCA28] transition-all text-sm"
              >
                Confirmar y pagar · {totalPrice}€
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
