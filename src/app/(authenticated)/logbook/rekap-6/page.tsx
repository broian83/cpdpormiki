// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarDays, Filter, Download, Plus } from 'lucide-react'

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
  const supabase = createClient()
  const [activities, setActivities] = useState<ActivityCategory[]>([])
  const [logbookData, setLogbookData] = useState<LogbookData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [semester, setSemester] = useState(1)

  const bulanRange = useMemo(() => {
    return semester === 1 ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10, 11, 12]
  }, [semester])

  useEffect(() => {
    fetchData()
  }, [tahun, semester])

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
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Header section  */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Rekap 6 Bulan</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Pantau aktivitas profil Anda per semester logbook kerja PMIK.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/logbook/input">
              <Button variant="outline" className="border-[#EFEFEF] shadow-none rounded-sm font-medium h-9 text-notion-text hover:bg-stone-50">
                 <Plus className="w-4 h-4 mr-2" />
                 Input
              </Button>
           </Link>
           <Link href="/logbook/export">
              <Button className="border border-[#EFEFEF] bg-stone-50 text-notion-text hover:bg-stone-100 shadow-none rounded-sm font-medium h-9">
                 <Download className="w-4 h-4 mr-2" />
                 Export
              </Button>
           </Link>
        </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
        <div className="border-b border-[#EFEFEF] bg-stone-50 p-4 flex gap-2 items-center">
            <Filter className="w-4 h-4 opacity-70 text-notion-text" />
            <span className="font-semibold text-notion-text text-[13px] uppercase tracking-wider">Persempit Rekapitulasi</span>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Tahun"
              options={TAHUN_OPTIONS}
              value={tahun}
              className="h-9 rounded-sm border-[#EFEFEF]"
              onChange={(e) => setTahun(Number(e.target.value))}
            />
            <Select
              label="Rentang Semester"
              options={[
                { value: 1, label: 'Semester 1 (Januari - Juni)' },
                { value: 2, label: 'Semester 2 (Juli - Desember)' },
              ]}
              value={semester}
              className="h-9 rounded-sm border-[#EFEFEF]"
              onChange={(e) => setSemester(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center gap-4">
              <div className="animate-spin h-6 w-6 border-b-2 border-notion-gray rounded-full"></div>
              <span className="text-sm text-notion-gray">Memuat data rekapitulasi...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-stone-50 border-b border-[#EFEFEF]">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold text-notion-text uppercase tracking-wider min-w-[250px]">Jenis Kegiatan</th>
                    {bulanRange.map(bulan => (
                      <th key={bulan} className="px-4 py-4 text-center font-semibold text-notion-gray uppercase tracking-wider">
                        {BULAN_OPTIONS.find(b => b.value === bulan)?.label.slice(0, 3)}
                      </th>
                    ))}
                    <th className="px-5 py-4 text-center font-bold text-notion-blue uppercase tracking-wider bg-notion-blue_bg/50">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEF]">
                  {activities.map(activity => {
                    const rowTotal = getTotal(activity.id);
                    return (
                      <tr key={activity.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-4 font-medium text-notion-text">{activity.nama_kegitan}</td>
                        {bulanRange.map(bulan => {
                           const val = getValue(activity.id, bulan);
                           return (
                             <td key={bulan} className={`px-4 py-4 text-center ${val > 0 ? 'text-notion-text font-medium' : 'text-notion-gray opacity-30'} text-[14px]`}>
                               {val}
                             </td>
                           )
                        })}
                        <td className="px-5 py-4 text-center font-bold text-notion-blue bg-notion-blue_bg/10 text-[14px]">
                          {rowTotal}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-stone-50 border-t-2 border-[#EFEFEF]">
                    <td className="px-5 py-4 font-bold text-notion-text uppercase tracking-widest text-xs">Total Semester {semester}</td>
                    {bulanRange.map(bulan => (
                      <td key={bulan} className="px-4 py-4 text-center font-bold text-notion-text text-[14px]">
                        {activities.reduce((sum, a) => sum + getValue(a.id, bulan), 0)}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-center font-black text-notion-blue bg-notion-blue_bg/30 text-[15px]">
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