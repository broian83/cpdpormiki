'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PenSquare, CreditCard, User, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIVATE_NAV_ITEMS = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: Home
  },
  {
    label: 'Logbook',
    href: '/logbook',
    icon: PenSquare
  },
  {
    label: 'Iuran',
    href: '/payment',
    icon: CreditCard
  },
  {
    label: 'Profil',
    href: '/profile',
    icon: User
  }
]

export function BottomNavPrivate() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-[#EFEFEF] px-4 h-20 flex items-center justify-between safe-area-inset-bottom pointer-events-auto shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-x">
        {PRIVATE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative flex-1",
                isActive ? "text-notion-blue scale-110" : "text-notion-gray hover:text-notion-text"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-notion-blue rounded-full animate-in zoom-in duration-300" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
