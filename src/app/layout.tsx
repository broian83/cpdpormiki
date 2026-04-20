// @ts-nocheck
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Member Area PMIK',
  description: 'Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia',
  manifest: '/manifest.json',
}

export const dynamic = 'force-dynamic'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}