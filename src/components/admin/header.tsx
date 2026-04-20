'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth'
import { createClient } from '@/lib/supabase/client'

export function AdminHeader() {

  const { user, profile } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname.startsWith('/admin/dashboard')) return 'Admin Dashboard'
    if (pathname.startsWith('/admin/members')) return 'Data Member PMIK'
    if (pathname.startsWith('/admin/logbook')) return 'Manajemen Logbook'
    if (pathname.startsWith('/admin/lms')) return 'Manajemen LMS'
    if (pathname.startsWith('/admin/payment')) return 'Keuangan & Validasi'
    if (pathname.startsWith('/admin/mailbox')) return 'Pusat Pesan'
    if (pathname.startsWith('/admin/master-kegiatan')) return 'Master Data Kegiatan'
    if (pathname.startsWith('/admin/reports')) return 'Laporan Sistem'
    if (pathname.startsWith('/admin/settings')) return 'Pengaturan Admin'
    return 'Admin Panel'
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#EFEFEF]">
      <div className="flex items-center justify-between h-14 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-notion-gray/40 hover:text-notion-text transition-colors hidden md:block">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <span className="hidden md:block text-notion-gray/30 text-xl font-light">/</span>
          <h1 className="text-sm font-medium text-notion-text font-serif">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-notion-red_bg px-2.5 py-1 rounded-sm text-[11px] font-semibold text-notion-red tracking-wider uppercase border border-notion-red/10">
            System Admin
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 hover:bg-stone-50 rounded-md transition-colors"
            >
              <Avatar name={profile?.nama_pmik || user?.email || 'Admin'} size="sm" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-notion border border-[#EFEFEF] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#EFEFEF] mb-1">
                  <p className="text-sm font-medium text-notion-text">{profile?.nama_pmik || 'Admin'}</p>
                  <p className="text-xs text-notion-gray truncate">{user?.email}</p>
                </div>
                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="block w-full text-left px-4 py-1.5 text-sm text-notion-red hover:bg-notion-red_bg transition-colors mx-1 rounded-sm"
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
