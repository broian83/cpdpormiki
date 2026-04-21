'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PenSquare, CreditCard, User, LayoutDashboard, PlusCircle } from 'lucide-react'
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

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1.5 transition-colors p-2 rounded-md hover:bg-stone-50 md:flex-1",
          isActive ? "text-notion-text" : "text-notion-gray"
        )}
      >
        <Icon className="w-5 h-5" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          <div className={cn("w-1 h-1 rounded-full", isActive ? "bg-notion-text" : "bg-transparent")} />
        </div>
      </Link>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="w-full max-w-md bg-white border-t border-[#EFEFEF] shadow-[0_-10px_20px_rgba(0,0,0,0.02)] px-6 h-16 flex items-center justify-between pointer-events-auto border-x">
        {PRIVATE_NAV_ITEMS.slice(0, 2).map(renderNavItem)}

        {/* Boxy FAB Alternative di tengah */}
        <Link 
           href="/logbook/input"
           className="w-12 h-12 bg-notion-text text-white rounded-md flex items-center justify-center -mt-6 shadow-md border border-stone-800 hover:bg-stone-800 active:scale-95 transition-all mx-2 shrink-0"
         >
            <PlusCircle size={24} />
         </Link>

        {PRIVATE_NAV_ITEMS.slice(2, 4).map(renderNavItem)}
      </nav>
    </div>
  )
}
