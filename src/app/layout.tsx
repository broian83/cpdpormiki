import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })

import './globals.css'

export const metadata: Metadata = {
  title: 'Member Area PMIK',
  description: 'Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
  },
}


import { Toaster } from 'sonner'
import { GlobalConfirmDialog } from '@/components/ui/confirm-modal'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${lora.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" closeButton />
        <GlobalConfirmDialog />
      </body>
    </html>
  )
}