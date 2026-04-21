// @ts-nocheck
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Member Area PMIK',
  description: 'Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
  },
}

export const dynamic = 'force-dynamic'

import { Toaster } from 'sonner'
import { GlobalConfirmDialog } from '@/components/ui/confirm-modal'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster richColors position="top-right" closeButton />
        <GlobalConfirmDialog />
      </body>
    </html>
  )
}