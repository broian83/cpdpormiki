'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'

export function Header() {

  const { user, profile } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

  // Logika penentuan judul header
  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard'
    if (pathname.startsWith('/private-area')) return 'Private Area'
    if (pathname.startsWith('/logbook')) return 'Logbook PMIK'
    if (pathname.startsWith('/profile')) return 'Profil PMIK'
    if (pathname.startsWith('/mailbox')) return 'Mailbox / Pesan'
    if (pathname.startsWith('/settings')) return 'Settings'
    if (pathname.startsWith('/cv')) return 'Curriculum Vitae'
    if (pathname.startsWith('/payment')) return 'Pembayaran'
    if (pathname.startsWith('/help')) return 'Bantuan'
    if (pathname.startsWith('/lms')) return 'LMS'
    return 'Member Area'
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-slate-900">{getPageTitle()}</h1>
        </div>


        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg"
            >
              <Avatar name={profile?.nama_pmik || user?.email} src={profile?.foto_url || undefined} size="sm" />
              <span className="hidden md:block text-sm font-medium text-slate-700">
                {profile?.nama_pmik || 'PMIK'}
              </span>
              <svg className="hidden md:block w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}