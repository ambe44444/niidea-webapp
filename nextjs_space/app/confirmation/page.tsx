'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PartyPopper, ArrowLeft } from 'lucide-react'

export default function ConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className={`mb-8 transition-all duration-700 ${showConfetti ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="w-24 h-24 rounded-full bg-[#FFD54F]/10 flex items-center justify-center mx-auto">
            <PartyPopper className="w-12 h-12 text-[#FFD54F]" />
          </div>
        </div>

        <h1 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-700 delay-300 ${showConfetti ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Tu plan está listo… <br />pero aún no lo sabes 😏
        </h1>

        <p className={`text-white/50 text-lg mb-2 transition-all duration-700 delay-500 ${showConfetti ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Te enviaremos la hora y la ubicación por email el día antes del plan.
        </p>
        <p className={`text-white/30 text-sm mb-10 transition-all duration-700 delay-700 ${showConfetti ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          Revisa tu email ese día. La sorpresa está en camino.
        </p>

        <Link
          href="/"
          className={`inline-flex items-center gap-2 bg-[#FFD54F] text-[#0B0B0B] font-semibold px-8 py-3.5 rounded-full hover:bg-[#FFCA28] transition-all hover:scale-105 delay-1000 ${showConfetti ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
