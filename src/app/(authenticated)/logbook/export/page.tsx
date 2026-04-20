// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DEFAULT_KOTA_CETAK } from '@/lib/constants'
import { Download, Filter, FileText } from 'lucide-react'

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
        headStyles: { fillColor: [40, 40, 40] },
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
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Header section  */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Cetak Logbook</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Ekspor laporan rekapitulasi Anda ke dalam format PDF yang siap cetak.</p>
        </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
        <div className="border-b border-[#EFEFEF] bg-stone-50 p-4 flex gap-2 items-center">
            <Filter className="w-4 h-4 opacity-70 text-notion-text" />
            <span className="font-semibold text-notion-text text-[13px] uppercase tracking-wider">Konfigurasi Laporan</span>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-3 gap-4">
            <Select 
              label="Pilih Tahun" 
              options={TAHUN_OPTIONS} 
              value={tahun} 
              className="h-9 rounded-sm border-[#EFEFEF]"
              onChange={(e) => setTahun(Number(e.target.value))} 
            />
            <Select 
              label="Pilih Periode" 
              options={[{ value: 0, label: '12 Bulan (Setahun Penuh)' }, { value: 1, label: 'Semester 1 (Jan-Jun)' }, { value: 2, label: 'Semester 2 (Jul-Des)' }]} 
              value={semester} 
              className="h-9 rounded-sm border-[#EFEFEF]"
              onChange={(e) => setSemester(Number(e.target.value))} 
            />
            <div className="flex items-end">
              <Button 
                onClick={handleExport} 
                className="w-full bg-notion-blue hover:bg-notion-blue/90 text-white rounded-sm font-medium h-9 shadow-none" 
                isLoading={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                Unduh PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
         <div className="border-b border-[#EFEFEF] bg-stone-50 p-4 flex gap-2 items-center">
             <FileText className="w-4 h-4 opacity-70 text-notion-text" />
             <span className="font-semibold text-notion-text text-[13px] uppercase tracking-wider">Pratinjau Data Laporan</span>
         </div>
         <div className="p-0">
           {isLoading ? (
             <div className="p-16 flex flex-col items-center gap-4">
               <div className="animate-spin h-6 w-6 border-b-2 border-notion-gray rounded-full"></div>
               <span className="text-sm text-notion-gray">Mempersiapkan pratinjau...</span>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-[13px]">
                 <thead className="bg-stone-50 border-b border-[#EFEFEF]">
                   <tr>
                     <th className="px-5 py-4 text-left font-semibold text-notion-text uppercase tracking-wider min-w-[250px] sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Jenis Kegiatan</th>
                     {bulanRange.map(bulan => (
                        <th key={bulan} className="px-4 py-4 text-center font-semibold text-notion-gray uppercase tracking-wider">
                          {BULAN_OPTIONS.find(bb => bb.value === bulan)?.label?.slice(0, 3)}
                        </th>
                     ))}
                     <th className="px-5 py-4 text-center font-bold text-notion-blue uppercase tracking-wider bg-notion-blue_bg/50">Total</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#EFEFEF]">
                   {activities.map(activity => (
                     <tr key={activity.id} className="hover:bg-stone-50/50 transition-colors group">
                       <td className="px-5 py-4 font-medium text-notion-text sticky left-0 bg-white group-hover:bg-stone-50/50 transition-colors z-10 shadow-[1px_0_0_#EFEFEF]">{activity.nama_kegitan}</td>
                       {bulanRange.map(bulan => (
                         <td key={bulan} className={`px-4 py-4 text-center ${getValue(activity.id, bulan) > 0 ? 'text-notion-text font-medium' : 'text-notion-gray opacity-30'} text-[14px]`}>
                           {getValue(activity.id, bulan)}
                         </td>
                       ))}
                       <td className="px-5 py-4 text-center font-bold text-notion-blue bg-notion-blue_bg/10 text-[14px]">{getTotal(activity.id)}</td>
                     </tr>
                   ))}
                   <tr className="bg-stone-50 border-t-2 border-[#EFEFEF]">
                      <td className="px-5 py-4 font-bold text-notion-text uppercase tracking-widest text-xs sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Grand Total</td>
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
    </div>
  )
}