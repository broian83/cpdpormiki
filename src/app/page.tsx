// @ts-nocheck
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, BookOpen, PenSquare, ShieldCheck, 
  Home, Search, Bell, User, PlusCircle, LayoutGrid, 
  HelpCircle, MessageCircle, LogIn, UserPlus
} from 'lucide-react'
import { Drawer } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false)

  const handleAction = () => {
    setIsAuthDrawerOpen(true)
  }
  
  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24 text-notion-text flex flex-col items-center">
      {/* Mobile Top Bar (Constrained) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EFEFEF] w-full max-w-md h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-notion-text rounded-md flex items-center justify-center border border-stone-800">
            <span className="text-white font-serif font-black text-lg">P</span>
          </div>
          <span className="font-serif font-bold text-lg tracking-tight">PMIK Mobile</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-stone-50 rounded-md transition-colors relative border border-transparent hover:border-[#EFEFEF]">
            <Bell className="w-4 h-4 text-notion-gray" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-notion-gray border border-[#EFEFEF]">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      <main className="w-full max-w-md p-6 space-y-8 animate-in fade-in duration-700 bg-white min-h-screen shadow-sm border-x border-[#EFEFEF]">
        
        {/* Welcome Section */}
        <section className="space-y-2 pt-2">
          <h1 className="text-3xl font-serif font-black leading-tight tracking-tight text-notion-text">
            Portal Digital PMIK
          </h1>
          <p className="text-notion-gray text-sm leading-relaxed font-medium">
            Kelola kebutuhan profesi Anda dengan lebih cerdas dan cepat, langsung dari genggaman.
          </p>
        </section>

        {/* Hero Card Boxy */}
        <section>
          <div className="bg-notion-text border border-stone-800 rounded-md p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <LayoutGrid size={120} />
             </div>
             <div className="relative z-10">
               <h2 className="text-xl font-serif font-bold text-white mb-2 tracking-tight">Digitalisasi Profesi</h2>
               <p className="text-[11px] text-white/70 mb-6 max-w-[200px] leading-relaxed">Mulai catat logbook dan kumpulkan SKP Anda hari ini.</p>
               <Button 
                  variant="secondary"
                  onClick={() => setIsAuthDrawerOpen(true)}
                  className="rounded-md h-10 px-6 font-bold uppercase tracking-widest text-[10px] w-full shadow-none whitespace-nowrap"
               >
                 Masuk Aplikasi
               </Button>
             </div>
          </div>
        </section>

        {/* App Nav Grid Boxy */}
        <div className="grid grid-cols-4 gap-3">
          <AppMenuIcon 
            color="bg-notion-blue" 
            icon={<PenSquare className="w-5 h-5" />} 
            label="Logbook" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            color="bg-purple-500" 
            icon={<BookOpen className="w-5 h-5" />} 
            label="LMS PMIK" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            color="bg-emerald-500" 
            icon={<ShieldCheck className="w-5 h-5" />} 
            label="Sertifikasi" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            color="bg-stone-700" 
            icon={<MessageCircle className="w-5 h-5" />} 
            label="Bantuan" 
            onClick={handleAction}
          />
        </div>

        {/* Info Cards Boxy */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em]">Info Terkini</h3>
            <button className="text-[10px] font-bold text-notion-blue uppercase tracking-widest hover:underline">Lihat Semua</button>
          </div>
          <div className="bg-white border border-[#EFEFEF] rounded-md divide-y divide-[#EFEFEF] overflow-hidden">
             <InfoCard title="Update SKP PORMIKI 2026" date="20 Apr" type="Kegiatan" />
             <InfoCard title="Jadwal Uji Kompetensi Mei" date="18 Apr" type="Informasi" />
          </div>
        </section>

        {/* Footer Text */}
        <footer className="pt-12 pb-8 text-center">
            <p className="text-[10px] font-bold text-notion-gray uppercase tracking-widest opacity-50">
              © 2026 PMIK Indonesia • Versi 1.0.4
            </p>
        </footer>
      </main>

      {/* Bottom Navigation Boxy */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="w-full max-w-md flex items-center justify-between px-6 pointer-events-auto bg-white border-t border-[#EFEFEF] h-16 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] border-x">
          <NavItem icon={<Home className="w-5 h-5" />} label="Beranda" active />
          <NavItem icon={<Search className="w-5 h-5" />} label="Cari" onClick={handleAction} />
          
          {/* Boxy FAB Alternative */}
          <button 
             onClick={handleAction}
             className="w-12 h-12 bg-notion-text text-white rounded-md flex items-center justify-center -mt-6 shadow-md border border-stone-800 hover:bg-stone-800 active:scale-95 transition-all"
           >
              <PlusCircle size={24} />
           </button>

          <NavItem icon={<BookOpen className="w-5 h-5" />} label="Kursus" onClick={handleAction} />
          <NavItem icon={<HelpCircle className="w-5 h-5" />} label="Bantuan" onClick={handleAction} />
        </nav>
      </div>

      {/* Auth Drawer (Bottom Sheet) */}
      <Drawer 
        isOpen={isAuthDrawerOpen} 
        onClose={() => setIsAuthDrawerOpen(false)}
        title="Bergabung Sekarang"
      >
        <div className="space-y-6 pb-12 mt-4 px-2">
           <p className="text-notion-gray text-[13px] font-medium leading-relaxed border-l-2 border-notion-blue pl-4">
             Akses seluruh fitur profesional PMIK dalam satu akun. Silakan masuk atau daftar.
           </p>
           
           <div className="space-y-3">
             <Link href="/login" className="block">
               <button className="w-full bg-white border border-[#EFEFEF] hover:border-notion-blue hover:bg-blue-50/50 rounded-md p-4 flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 rounded-md bg-stone-50 border border-[#EFEFEF] flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-notion-blue">
                     <LogIn className="w-4 h-4 text-notion-text group-hover:text-notion-blue" />
                  </div>
                  <div className="text-left flex-1">
                     <div className="text-sm font-bold text-notion-text">Masuk ke Akun</div>
                     <div className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-0.5">Sudah mendaftar</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-notion-blue group-hover:translate-x-1 transition-all" />
               </button>
             </Link>

             <Link href="/register" className="block">
               <button className="w-full bg-notion-text border border-stone-800 hover:bg-stone-800 rounded-md p-4 flex items-center gap-4 transition-all group">
                  <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                     <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left flex-1">
                     <div className="text-sm font-bold text-white">Daftar Akun Baru</div>
                     <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Member baru</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </button>
             </Link>
           </div>

           <div className="text-center pt-6">
              <p className="text-[9px] text-notion-gray uppercase font-black tracking-[0.2em] opacity-60">
                Pusat Bantuan: cs@pmik.or.id
              </p>
           </div>
        </div>
      </Drawer>
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-colors p-2 rounded-md hover:bg-stone-50",
        active ? "text-notion-text" : "text-notion-gray"
      )}
    >
      {icon}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {label}
        </span>
        <div className={cn("w-1 h-1 rounded-full", active ? "bg-notion-text" : "bg-transparent")} />
      </div>
    </button>
  )
}

function AppMenuIcon({ color, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center justify-center p-3 bg-white border border-[#EFEFEF] rounded-md hover:border-notion-blue hover:shadow-sm transition-all text-center gap-3"
    >
      <div className={cn("w-10 h-10 rounded-md flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform", color)}>
        {icon}
      </div>
      <span className="text-[9px] font-black text-notion-text uppercase tracking-widest group-hover:text-notion-blue transition-colors leading-tight">
        {label}
      </span>
    </button>
  )
}

function InfoCard({ title, date, type }: any) {
  return (
     <div className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-stone-50 border border-[#EFEFEF] rounded-md flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-notion-blue">
           <Bell size={16} className="text-notion-gray group-hover:text-notion-blue transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
           <h4 className="text-sm font-bold text-notion-text truncate">{title}</h4>
           <div className="text-[9px] font-black uppercase text-notion-gray tracking-widest mt-1 flex items-center gap-2">
             <span className="text-notion-blue">{type}</span>
             <span className="w-1 h-1 rounded-full bg-stone-200" />
             <span>{date}</span>
           </div>
        </div>
     </div>
  )
}