// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { 
  CalendarDays, 
  Filter, 
  Download, 
  Plus, 
  ArrowLeft, 
  Search,
  Table as TableIcon,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityCategory {
  id: string
  kode_kegitan: string
  nama_kegitan: string
}

interface LogbookData {
  bulan: number
  activity_category_id: string
  jumlah_kegitan: number
}

export default function Rekap12BulanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activities, setActivities] = useState<ActivityCategory[]>([])
  const [logbookData, setLogbookData] = useState<LogbookData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tahun, setTahun] = useState(new Date().getFullYear())

  const bulanRange = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [])

  useEffect(() => { fetchData() }, [tahun])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [actsRes, logRes] = await Promise.all([
        supabase.from('activity_categories').select('id, kode_kegitan, nama_kegitan').eq('is_active', true).order('nama_kegitan'),
        supabase
          .from('monthly_logbooks')
          .select(`
            bulan,
            monthly_logbook_details!inner(
              activity_category_id,
              jumlah_kegitan
            )
          `)
          .eq('user_id', session.user.id)
          .eq('tahun', tahun)
      ])

      if (actsRes.data) setActivities(actsRes.data)
      
      const flatData: LogbookData[] = []
      if (logRes.data) {
        logRes.data.forEach((entry: any) => {
          entry.monthly_logbook_details?.forEach((detail: any) => {
            flatData.push({
              bulan: entry.bulan,
              activity_category_id: detail.activity_category_id,
              jumlah_kegitan: detail.jumlah_kegitan || 0,
            })
          })
        })
      }
      setLogbookData(flatData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getValue = (activityId: string, bulan: number) => {
    const entry = logbookData.find(d => d.activity_category_id === activityId && d.bulan === bulan)
    return entry?.jumlah_kegitan || 0
  }

  const getTotal = (activityId: string) => {
    return bulanRange.reduce((sum, bulan) => sum + getValue(activityId, bulan), 0)
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Mini Breadcrumb/Back */}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => router.push('/logbook')} className="text-notion-gray hover:text-notion-text transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Rekapitulasi Tahunan</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-notion-text">Rekap 12 Bulan</h2>
          <p className="text-sm text-notion-gray font-medium mt-1">Laporan komprehensif performa satu tahun penuh.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/logbook/export">
              <Button variant="outline" className="h-10 rounded-md border-[#EFEFEF] bg-white text-xs font-bold uppercase tracking-widest text-notion-text shadow-sm hover:bg-stone-50 px-5">
                 <Download size={16} className="mr-2" /> Export PDF
              </Button>
           </Link>
        </div>
      </div>

      {/* Filter Box (Global Boxy Design) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-notion-gray opacity-70" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Saring Periode</span>
           </div>
        </div>
        <div className="p-6">
          <div className="max-w-xs space-y-1.5">
            <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Tahun Laporan</label>
            <Select
              options={TAHUN_OPTIONS}
              value={tahun}
              className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
              onChange={(e) => setTahun(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* 12-Month Table Area (Boxy + Sticky) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#EFEFEF] bg-white flex items-center gap-3">
             <TableIcon className="w-4 h-4 text-emerald-500 opacity-70" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-text">Matriks Tahunan</span>
          </div>
          {isLoading ? (
            <div className="p-20 flex flex-col items-center gap-4 text-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memproses Matriks...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-[#EFEFEF]">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-notion-gray uppercase tracking-widest min-w-[280px] sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Kegiatan Profesional</th>
                    {bulanRange.map(bulan => (
                      <th key={bulan} className="px-4 py-4 text-center text-[10px] font-black text-notion-gray uppercase tracking-widest border-l border-[#EFEFEF] min-w-[50px]">
                        {bulan}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-[10px] font-black text-notion-blue uppercase tracking-widest border-l border-[#EFEFEF] bg-blue-50/30">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEF]">
                  {activities.map(activity => {
                    const rowTotal = getTotal(activity.id);
                    return (
                      <tr key={activity.id} className="hover:bg-stone-50/30 transition-colors group">
                        <td className="px-6 py-4 font-bold text-notion-text text-[11px] sticky left-0 bg-white group-hover:bg-stone-50 transition-colors z-10 shadow-[1px_0_0_#EFEFEF]">
                          {activity.nama_kegitan}
                        </td>
                        {bulanRange.map(bulan => {
                           const val = getValue(activity.id, bulan);
                           return (
                             <td key={bulan} className={cn(
                               "px-4 py-4 text-center text-[11px] border-l border-[#EFEFEF]",
                               val > 0 ? "font-black text-notion-text" : "text-notion-gray opacity-20"
                             )}>
                               {val || '-'}
                             </td>
                           )
                        })}
                        <td className="px-6 py-4 text-center font-black text-notion-blue bg-blue-50/10 text-xs border-l border-[#EFEFEF]">
                          {rowTotal}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-stone-50 border-t-2 border-[#EFEFEF]">
                    <td className="px-6 py-5 text-[10px] font-black text-notion-text uppercase tracking-[0.2em] sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Total Akumulasi {tahun}</td>
                    {bulanRange.map(bulan => (
                      <td key={bulan} className="px-4 py-5 text-center font-black text-notion-text text-sm border-l border-[#EFEFEF]">
                        {activities.reduce((sum, a) => sum + getValue(a.id, bulan), 0)}
                      </td>
                    ))}
                    <td className="px-6 py-5 text-center font-black text-white bg-notion-text text-base border-l border-[#EFEFEF]">
                      {activities.reduce((sum, a) => sum + getTotal(a.id), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
      </div>

    </div>
  )
}