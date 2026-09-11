import { Inter, Caveat } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { CookieBanner } from '@/components/cookie-banner'
import { WhatsAppButton } from '@/components/whatsapp-button'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const caveat = Caveat({ subsets: ['latin'], weight: ['700'], variable: '--font-caveat' })

export const metadata = {
  title: 'NiIdea — Planes sorpresa en Madrid',
  description: 'Compra un plan sin saber qué es. Elige fecha, paga y recibe la ubicación por email el día antes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${inter.variable} ${caveat.variable} font-sans bg-[#0B0B0B] text-white antialiased`}>
        {children}
        <CookieBanner />
        <WhatsAppButton />
        <Toaster />
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
