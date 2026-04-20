// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Rekap 6 Bulan</h2>
        <p className="text-slate-600">Rekap kegiatan semester {semester} tahun {tahun}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Tahun"
              options={TAHUN_OPTIONS}
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
            />
            <Select
              label="Semester"
              options={[
                { value: 1, label: 'Semester 1 (Jan - Jun)' },
                { value: 2, label: 'Semester 2 (Jul - Des)' },
              ]}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            />
            <div className="flex items-end gap-2">
              <Link href="/logbook/input" className="flex-1">
                <Button variant="outline" className="w-full">Input Data</Button>
              </Link>
              <Link href="/logbook/export" className="flex-1">
                <Button className="w-full">Export PDF</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Memuat...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Jenis Kegiatan</th>
                  {bulanRange.map(bulan => (
                    <th key={bulan} className="px-4 py-3 text-center font-semibold text-slate-700">
                      {BULAN_OPTIONS.find(b => b.value === bulan)?.label.slice(0, 3)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activities.map(activity => (
                  <tr key={activity.id}>
                    <td className="px-4 py-3 text-slate-900">{activity.nama_kegitan}</td>
                    {bulanRange.map(bulan => (
                      <td key={bulan} className="px-4 py-3 text-center text-slate-600">
                        {getValue(activity.id, bulan)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center font-medium text-slate-900">
                      {getTotal(activity.id)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold">
                  <td className="px-4 py-3 text-slate-900">TOTAL</td>
                  {bulanRange.map(bulan => (
                    <td key={bulan} className="px-4 py-3 text-center text-slate-900">
                      {activities.reduce((sum, a) => sum + getValue(a.id, bulan), 0)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-slate-900">
                    {activities.reduce((sum, a) => sum + getTotal(a.id), 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}