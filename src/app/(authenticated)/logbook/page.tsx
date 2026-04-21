// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getBulanLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  List, 
  Calendar, 
  Download, 
  ChevronRight, 
  HelpCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LogbookPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalEntries: 0,
    latestEntry: { bulan: 0, tahun: 0 }
  })

  useEffect(() => {
    async function fetchStats() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data, count } = await supabase
        .from('monthly_logbooks')
        .select('bulan, tahun', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        setStats({
          totalEntries: count || 0,
          latestEntry: { bulan: data[0].bulan, tahun: data[0].tahun }
        })
      }
    }
    fetchStats()
  }, [supabase])

  const menuItems = [
    { 
      title: 'Input Logbook', 
      desc: 'Catat kegiatan profesional bulanan baru.', 
      href: '/logbook/input', 
      icon: Plus, 
      color: 'bg-notion-blue'
    },
    { 
      title: 'Daftar Entri', 
      desc: 'Lihat dan kelola riwayat catatan Anda.', 
      href: '/logbook/list', 
      icon: List, 
      color: 'bg-emerald-500'
    },
    { 
      title: 'Rekap 6 Bulan', 
      desc: 'Laporan kolektif semester berjalan.', 
      href: '/logbook/rekap-6', 
      icon: Calendar, 
      color: 'bg-amber-500'
    },
    { 
      title: 'Rekap 12 Bulan', 
      desc: 'Laporan tahunan profesional lengkap.', 
      href: '/logbook/rekap-12', 
      icon: Calendar, 
      color: 'bg-purple-500'
    },
    { 
      title: 'Export Laporan', 
      desc: 'Cetak berkas P2KB untuk akreditasi.', 
      href: '/logbook/export', 
      icon: Download, 
      color: 'bg-rose-500'
    },
  ]

  return (
    <div className="animate-in fade-in pb-16 duration-500 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2 pt-4">
        <h1 className="text-3xl font-serif font-bold text-notion-text">Logbook PMIK</h1>
        <p className="text-sm text-notion-gray font-medium">Manajemen kegiatan profesional terintegrasi.</p>
      </div>

      {/* Hero Stats Card - Boxy */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="col-span-1 md:col-span-2 border border-[#EFEFEF] bg-white rounded-md p-6 shadow-sm flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-notion-gray" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-notion-gray">Periode Terakhir</span>
               </div>
               <h3 className="text-2xl font-serif font-bold text-notion-text mb-1">
                  {stats.latestEntry.bulan > 0 
                    ? `${getBulanLabel(stats.latestEntry.bulan)} ${stats.latestEntry.tahun}`
                    : 'Belum ada data'}
               </h3>
               <p className="text-xs text-notion-gray font-medium">Akses cepat ke pencatatan terbaru Anda.</p>
            </div>
            <div className="mt-8">
               <Link href="/logbook/input">
                 <Button className="bg-notion-text text-white hover:bg-stone-800 h-10 px-6 rounded-md font-bold text-xs uppercase tracking-widest">
                    Mulai Catat
                 </Button>
               </Link>
            </div>
         </div>

         <div className="border border-[#EFEFEF] bg-stone-50/50 rounded-md p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-notion-gray mb-3">Total Laporan</span>
            <div className="text-5xl font-black text-notion-text mb-2">{stats.totalEntries}</div>
            <span className="text-[10px] font-bold text-notion-blue bg-white border border-blue-100 px-3 py-1 rounded">Bulanan</span>
         </div>
      </section>

      {/* Menu List Style - 1 Kolom Sesuai Request */}
      <section className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-notion-gray px-1">Menu Utama</h2>
        <div className="grid grid-cols-1 gap-3">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <div className="group border border-[#EFEFEF] bg-white rounded-md p-4 hover:border-notion-text/20 hover:shadow-sm transition-all flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white shadow-sm shrink-0", item.color)}>
                  <item.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-notion-text group-hover:text-notion-blue transition-colors">
                      {item.title}
                   </h4>
                   <p className="text-[11px] text-notion-gray font-medium truncate">
                      {item.desc}
                   </p>
                </div>
                <ChevronRight size={18} className="text-notion-gray/20 group-hover:text-notion-blue group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Help Area */}
      <section>
         <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center gap-3">
               <HelpCircle className="w-4 h-4 text-notion-gray opacity-70" />
               <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Panduan</span>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="space-y-2">
                  <h4 className="text-sm font-bold text-notion-text uppercase tracking-tight">Butuh Kode Kegiatan?</h4>
                  <p className="text-[11px] text-notion-gray font-medium leading-relaxed max-w-md">
                    Konsultasikan dengan Komite Etik Wilayah Anda jika belum memahami pemetaan tugas P2KB.
                  </p>
               </div>
               <Link href="/help" className="w-full md:w-auto">
                 <Button className="w-full h-11 px-8 rounded-md bg-notion-text text-white shadow-sm border-none hover:bg-stone-800 text-[10px] font-black uppercase tracking-widest">
                    Panduan
                 </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}