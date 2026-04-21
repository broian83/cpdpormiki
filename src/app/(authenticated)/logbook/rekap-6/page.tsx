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
  ChevronRight
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

export default function Rekap6BulanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activities, setActivities] = useState<ActivityCategory[]>([])
  const [logbookData, setLogbookData] = useState<LogbookData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [semester, setSemester] = useState(semesterDariBulan(new Date().getMonth() + 1))

  function semesterDariBulan(bulan: number) {
     return bulan <= 6 ? 1 : 2
  }

  const bulanRange = useMemo(() => {
    return semester === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12]
  }, [semester])

  useEffect(() => { fetchData() }, [tahun, semester])

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
          .in('bulan', bulanRange)
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
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Rekapitulasi</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-notion-text">Rekap 6 Bulan</h2>
          <p className="text-sm text-notion-gray font-medium mt-1">Pantau performa kegiatan profesional per semester.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/logbook/export">
              <Button variant="outline" className="h-10 rounded-md border-[#EFEFEF] bg-white text-xs font-bold uppercase tracking-widest text-notion-text shadow-sm hover:bg-stone-50 px-5">
                 <Download size={16} className="mr-2" /> Export
              </Button>
           </Link>
        </div>
      </div>

      {/* Filter Options (Global Boxy Design) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-notion-gray opacity-70" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Saring Rekapitulasi</span>
           </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Tahun Akademik</label>
              <Select
                options={TAHUN_OPTIONS}
                value={tahun}
                className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
                onChange={(e) => setTahun(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Rentang Semester</label>
              <Select
                options={[
                  { value: 1, label: 'Semester 1 (Januari - Juni)' },
                  { value: 2, label: 'Semester 2 (Juli - Desember)' },
                ]}
                value={semester}
                className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
                onChange={(e) => setSemester(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Area (Boxy) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#EFEFEF] bg-white flex items-center gap-3">
             <TableIcon className="w-4 h-4 text-notion-blue opacity-70" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-text">Detail Kumulatif</span>
          </div>
          {isLoading ? (
            <div className="p-20 flex flex-col items-center gap-4 text-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-notion-blue rounded-full"></div>
              <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Menghitung Data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-[#EFEFEF]">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-notion-gray uppercase tracking-widest min-w-[300px]">Jenis Kegiatan Profesional</th>
                    {bulanRange.map(bulan => (
                      <th key={bulan} className="px-4 py-4 text-center text-[10px] font-black text-notion-gray uppercase tracking-widest border-l border-[#EFEFEF]">
                        {BULAN_OPTIONS.find(b => b.value === bulan)?.label.slice(0, 3)}
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
                        <td className="px-6 py-4 font-bold text-notion-text text-xs">{activity.nama_kegitan}</td>
                        {bulanRange.map(bulan => {
                           const val = getValue(activity.id, bulan);
                           return (
                             <td key={bulan} className={cn(
                               "px-4 py-4 text-center text-xs border-l border-[#EFEFEF]",
                               val > 0 ? "font-black text-notion-text" : "text-notion-gray opacity-20"
                             )}>
                               {val || '-'}
                             </td>
                           )
                        })}
                        <td className="px-6 py-4 text-center font-black text-notion-blue bg-blue-50/10 text-sm border-l border-[#EFEFEF]">
                          {rowTotal}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-stone-50 border-t-2 border-[#EFEFEF]">
                    <td className="px-6 py-5 text-[10px] font-black text-notion-text uppercase tracking-[0.2em]">Kumulatif Semester {semester}</td>
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