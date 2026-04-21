// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, BookOpen, PenSquare, ShieldCheck, 
  Home, Search, Bell, User, PlusCircle, LayoutGrid, 
  HelpCircle, MessageCircle, LogIn, UserPlus
} from 'lucide-react'
import { Drawer } from '@/components/ui/drawer'

export default function HomePage() {
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false)

  const handleAction = () => {
    setIsAuthDrawerOpen(true)
  }
  
  return (
    <div className="min-h-screen bg-[#F7F7F5] pb-24 text-notion-text font-sans flex flex-col items-center">
      {/* Mobile Top Bar (Constrained) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EFEFEF] w-full max-w-md h-16 flex items-center justify-between px-6 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-notion-text rounded-sm flex items-center justify-center">
            <span className="text-white font-serif font-black text-lg">P</span>
          </div>
          <span className="font-serif font-bold text-lg tracking-tight">PMIK Mobile</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5 text-notion-gray" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-notion-red rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-[#EFEFEF]">
            <div className="w-full h-full flex items-center justify-center text-notion-gray">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md p-6 space-y-8 animate-in fade-in duration-700 bg-white min-h-screen shadow-sm border-x border-[#EFEFEF]">
        {/* Welcome Section */}
        <section className="space-y-4 pt-4">
          <h1 className="text-3xl font-serif font-bold leading-tight">
            Selamat datang di Portal Digital PMIK. 
          </h1>
          <p className="text-notion-gray text-base leading-relaxed">
            Kelola kebutuhan profesi Anda dengan lebih cerdas dan cepat, langsung dari genggaman.
          </p>
        </section>

        {/* Hero Card */}
        <section className="relative group">
          <div className="absolute inset-0 bg-notion-blue rounded-3xl blur-[20px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative bg-white border border-[#EFEFEF] rounded-3xl p-6 shadow-sm overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <LayoutGrid size={120} />
             </div>
             <h2 className="text-xl font-serif font-bold text-notion-text mb-2">Digitalisasi Profesi</h2>
             <p className="text-sm text-notion-gray mb-6 max-w-[200px]">Mulai catat logbook dan kumpulkan SKP hari ini.</p>
             <Button 
                onClick={() => setIsAuthDrawerOpen(true)}
                className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-2xl h-12 px-6 shadow-none font-bold"
             >
               Masuk atau Daftar <ArrowRight className="ml-2 w-4 h-4 text-white" />
             </Button>
          </div>
        </section>

        {/* App Grid */}
        <div className="grid grid-cols-4 gap-y-8 gap-x-2">
          <AppMenuIcon 
            bgColor="bg-blue-50" 
            icon={<PenSquare className="w-6 h-6 text-notion-blue" />} 
            label="Logbook" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            bgColor="bg-purple-50" 
            icon={<BookOpen className="w-6 h-6 text-purple-600" />} 
            label="LMS" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            bgColor="bg-green-50" 
            icon={<ShieldCheck className="w-6 h-6 text-green-600" />} 
            label="STR" 
            onClick={handleAction}
          />
          <AppMenuIcon 
            bgColor="bg-orange-50" 
            icon={<MessageCircle className="w-6 h-6 text-orange-600" />} 
            label="Bantuan" 
            onClick={handleAction}
          />
        </div>

        {/* Info Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-notion-text">Info Terkini</h3>
            <button className="text-xs font-bold text-notion-blue uppercase tracking-widest">Lihat Semua</button>
          </div>
          <div className="space-y-3">
             <InfoCard title="Update SKP PORMIKI 2026" date="20 Apr" type="Kursus" />
             <InfoCard title="Jadwal Uji Kompetensi Mei" date="18 Apr" type="Kegiatan" />
          </div>
        </section>

        {/* Footer Text */}
        <footer className="pt-8 pb-12 text-center">
            <p className="text-[11px] font-bold text-notion-gray uppercase tracking-widest opacity-50">
              © 2026 PMIK Indonesia • Versi 1.0.4
            </p>
        </footer>
      </main>

      {/* Bottom Navigation (Constrained to Center) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="w-full max-w-md h-full flex items-center justify-around px-2 pointer-events-auto bg-white/95 backdrop-blur-lg border-t border-[#EFEFEF] h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-x">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" active />
          <NavItem icon={<Search className="w-6 h-6" />} label="Cari" onClick={handleAction} />
          <div className="w-16 h-16" /> {/* Space for floating button */}
          <NavItem icon={<BookOpen className="w-6 h-6" />} label="Kursus" onClick={handleAction} />
          <NavItem icon={<HelpCircle className="w-6 h-6" />} label="Info" onClick={handleAction} />
        </nav>
        <div className="absolute -top-8">
             <button 
               onClick={handleAction}
               className="w-16 h-16 bg-notion-text text-white rounded-full flex items-center justify-center shadow-lg shadow-stone-400/30 active:scale-90 transition-transform ring-4 ring-[#F7F7F5]"
             >
                <PlusCircle size={32} />
             </button>
        </div>
      </div>

      {/* Auth Drawer (Bottom Sheet) */}
      <Drawer 
        isOpen={isAuthDrawerOpen} 
        onClose={() => setIsAuthDrawerOpen(false)}
        title="Bergabung Sekarang"
      >
            <div className="space-y-4 pb-12">
               <p className="text-notion-gray text-base mb-8 leading-relaxed">
                 Akses seluruh fitur profesional PMIK dalam satu akun. Pilih langkah Anda:
               </p>
               
               <Link href="/login" className="block">
                 <button className="w-full h-14 bg-white border-2 border-[#EFEFEF] hover:border-notion-blue hover:bg-notion-blue_bg rounded-2xl flex items-center px-6 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-notion-blue_bg flex items-center justify-center mr-4 group-hover:bg-notion-blue transition-colors">
                       <LogIn className="w-5 h-5 text-notion-blue group-hover:text-white" />
                    </div>
                    <div className="text-left">
                       <div className="font-bold text-notion-text">Masuk ke Akun</div>
                       <div className="text-xs text-notion-gray whitespace-nowrap">Sudah memiliki akun terdaftar</div>
                    </div>
                    <ArrowRight className="ml-auto w-4 h-4 text-notion-gray opacity-30" />
                 </button>
               </Link>

               <Link href="/register" className="block">
                 <button className="w-full h-14 bg-notion-text border-2 border-notion-text hover:bg-stone-800 rounded-2xl flex items-center px-6 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mr-4">
                       <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                       <div className="font-bold text-white">Daftar Akun Baru</div>
                       <div className="text-xs text-white/50 whitespace-nowrap">Belum memiliki akun Member Area</div>
                    </div>
                    <ArrowRight className="ml-auto w-4 h-4 text-white opacity-30" />
                 </button>
               </Link>

               <div className="text-center pt-8 border-t border-[#EFEFEF]">
                  <p className="text-[10px] text-notion-gray uppercase font-bold tracking-widest leading-loose">
                    Atau hubungi pusat bantuan kami jika mengalami kendala.
                  </p>
               </div>
            </div>
          </Drawer>
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-notion-blue' : 'text-notion-gray hover:text-notion-text'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {active && <div className="w-4 h-1 bg-notion-blue rounded-full mt-0.5" />}
    </button>
  )
}

function AppMenuIcon({ bgColor, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
    >
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center shadow-sm border border-black/5`}>
        {icon}
      </div>
      <span className="text-[12px] font-bold text-notion-text">{label}</span>
    </button>
  )
}

function InfoCard({ title, date, type }) {
  return (
     <div className="bg-white border border-[#EFEFEF] p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center shrink-0">
           <Bell size={20} className="text-notion-text opacity-40" />
        </div>
        <div className="flex-1 overflow-hidden">
           <div className="text-[10px] uppercase font-black text-notion-blue mb-0.5">{type}</div>
           <h4 className="text-sm font-bold truncate">{title}</h4>
        </div>
        <div className="text-xs font-semibold text-notion-gray shrink-0 px-2 py-1 bg-stone-50 rounded-md">
           {date}
        </div>
     </div>
  )
}