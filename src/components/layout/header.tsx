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
    <header className="sticky top-0 z-40 bg-notion-bg/95 backdrop-blur-sm border-b border-[#EFEFEF]">
      <div className="flex items-center justify-between h-14 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-notion-gray hover:text-notion-text transition-colors hidden md:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <span className="hidden md:block text-notion-gray/50 text-xl font-light">/</span>
          <h1 className="text-sm font-medium text-notion-text font-serif">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 text-notion-gray hover:text-notion-text hover:bg-stone-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 hover:bg-stone-100 rounded-md transition-colors"
            >
              <Avatar name={profile?.nama_pmik || user?.email} src={profile?.foto_url || undefined} size="sm" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-notion border border-[#EFEFEF] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#EFEFEF] mb-1">
                  <p className="text-sm font-medium text-notion-text">{profile?.nama_pmik || 'User'}</p>
                  <p className="text-xs text-notion-gray truncate">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-1.5 text-sm text-notion-gray hover:bg-stone-50 hover:text-notion-text transition-colors mx-1 rounded-sm"
                >
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-1.5 text-sm text-notion-gray hover:bg-stone-50 hover:text-notion-text transition-colors mx-1 rounded-sm"
                >
                  Settings
                </Link>
                <div className="h-px bg-[#EFEFEF] my-1" />
                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="block w-full text-left px-4 py-1.5 text-sm text-notion-gray hover:bg-stone-50 hover:text-notion-text transition-colors mx-1 rounded-sm"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}