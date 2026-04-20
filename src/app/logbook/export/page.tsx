// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_KOTA_CETAK } from '@/lib/constants'

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

export default function ExportPage() {
  const supabase = createClient()
  const [activities, setActivities] = useState<ActivityCategory[]>([])
  const [logbookData, setLogbookData] = useState<LogbookData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [semester, setSemester] = useState(0)
  const [userName, setUserName] = useState('Nama PMIK')

  const bulanRange = useMemo(() => {
    if (semester === 0) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    if (semester === 1) return [1, 2, 3, 4, 5, 6]
    return [7, 8, 9, 10, 11, 12]
  }, [semester])

  useEffect(() => {
    fetchData()
  }, [tahun, semester])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [{ data: profile }, { data: acts }, { data: logs }] = await Promise.all([
        supabase.from('pmik_profiles').select('nama_pmik').eq('user_id', session.user.id).single(),
        supabase.from('activity_categories').select('id, kode_kegitan, nama_kegitan').eq('is_active', true).order('nama_kegitan'),
        supabase
          .from('monthly_logbooks')
          .select('bulan, monthly_logbook_details!inner(activity_category_id, jumlah_kegitan)')
          .eq('user_id', session.user.id)
          .eq('tahun', tahun)
          .in('bulan', bulanRange)
      ])

      if (profile && profile.nama_pmik) setUserName(profile.nama_pmik)
      if (acts) setActivities(acts)

      const flatData: LogbookData[] = []
      if (logs) {
        logs.forEach((entry: any) => {
          entry.monthly_logbook_details?.forEach((detail: any) => {
            flatData.push({ bulan: entry.bulan, activity_category_id: detail.activity_category_id, jumlah_kegitan: detail.jumlah_kegitan || 0 })
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
    return logbookData.find(d => d.activity_category_id === activityId && d.bulan === bulan)?.jumlah_kegitan || 0
  }

  const getTotal = (activityId: string) => bulanRange.reduce((sum, bulan) => sum + getValue(activityId, bulan), 0)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default
      const doc = new jsPDF('landscape')

      const semesterLabel = semester === 0 ? 'TAHUN' : semester === 1 ? 'SEMESTER 1' : 'SEMESTER 2'
      const bulanLabel = semester === 0 ? 'Januari - Desember' : semester === 1 ? 'Januari - Juni' : 'Juli - Desember'
      const today = new Date()
      const formattedDate = `${today.getDate()} / ${today.getMonth() + 1} / ${today.getFullYear()}`

      doc.setFontSize(14)
      doc.text('LAPORAN KEGIATAN LOGBOOK PMIK', 148, 15, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`${semesterLabel} ${tahun} (${bulanLabel})`, 148, 22, { align: 'center' })

      doc.setFontSize(10)
      doc.text(`Nama: ${userName}`, 14, 35)
      doc.text(`Kota: ${DEFAULT_KOTA_CETAK}`, 14, 40)
      doc.text(`Tanggal Cetak: ${formattedDate}`, 14, 45)

      const tableHeaders = ['Jenis Kegiatan', ...bulanRange.map(b => BULAN_OPTIONS.find(bb => bb.value === b)?.label?.slice(0, 3) || ''), 'Total']
      const tableData = activities.map(a => [
        a.nama_kegitan,
        ...bulanRange.map(b => getValue(a.id, b).toString()),
        getTotal(a.id).toString()
      ])

      const totals = ['TOTAL', ...bulanRange.map(bulan => activities.reduce((sum, a) => sum + getValue(a.id, bulan), 0).toString()), activities.reduce((sum, a) => sum + getTotal(a.id), 0).toString()]
      tableData.push(totals)

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 50,
        styles: { fontSize: 8, halign: 'center' },
        headStyles: { fillColor: [77, 145, 153] },
        columnStyles: { 0: { halign: 'left' } }
      })

      doc.save(`Logbook_PMIK_${tahun}_${semester === 0 ? 'Tahun' : semester === 1 ? 'Semester1' : 'Semester2'}.pdf`)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Cetak / Export Laporan</h2>
        <p className="text-slate-600">Export laporan logbook ke PDF</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Filter Periode</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Select label="Tahun" options={TAHUN_OPTIONS} value={tahun} onChange={(e) => setTahun(Number(e.target.value))} />
            <Select label="Periode" options={[{ value: 0, label: '12 Bulan (Setahun)' }, { value: 1, label: 'Semester 1' }, { value: 2, label: 'Semester 2' }]} value={semester} onChange={(e) => setSemester(Number(e.target.value))} />
            <Button onClick={handleExport} className="w-full" isLoading={isExporting}>Export PDF</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="p-8 text-center text-slate-500">Memuat...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Jenis Kegiatan</th>
                    {bulanRange.map(bulan => <th key={bulan} className="px-4 py-3 text-center">{BULAN_OPTIONS.find(bb => bb.value === bulan)?.label?.slice(0, 3)}</th>)}
                    <th className="px-4 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activities.map(activity => (
                    <tr key={activity.id}>
                      <td className="px-4 py-3 text-slate-900">{activity.nama_kegitan}</td>
                      {bulanRange.map(bulan => <td key={bulan} className="px-4 py-3 text-center text-slate-600">{getValue(activity.id, bulan)}</td>)}
                      <td className="px-4 py-3 text-center font-medium text-slate-900">{getTotal(activity.id)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}