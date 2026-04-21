// @ts-nocheck
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS, DEFAULT_KOTA_CETAK } from '@/lib/constants'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download, Filter, FileText, ArrowLeft, Search, Eye } from 'lucide-react'
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

export default function ExportPage() {
  const router = useRouter()
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

  useEffect(() => { fetchData() }, [tahun, semester])

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
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Mini Breadcrumb/Back */}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => router.push('/logbook')} className="text-notion-gray hover:text-notion-text transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Export Laporan</h1>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl font-serif font-bold text-notion-text">Cetak Logbook</h2>
        <p className="text-sm text-notion-gray font-medium">Ekspor data rekapitulasi Anda menjadi berkas PDF siap unduh.</p>
      </div>

      {/* Configuration Box (Boxy) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-notion-gray opacity-70" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Konfigurasi Laporan</span>
           </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-1.5">
               <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Pilih Tahun</label>
               <Select 
                 options={TAHUN_OPTIONS} 
                 value={tahun} 
                 className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
                 onChange={(e) => setTahun(Number(e.target.value))} 
               />
            </div>
            <div className="md:col-span-4 space-y-1.5">
               <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Pilih Periode</label>
               <Select 
                 options={[{ value: 0, label: '12 Bulan (Setahun Penuh)' }, { value: 1, label: 'Semester 1 (Jan-Jun)' }, { value: 2, label: 'Semester 2 (Jul-Des)' }]} 
                 value={semester} 
                 className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
                 onChange={(e) => setSemester(Number(e.target.value))} 
               />
            </div>
            <div className="md:col-span-4 flex items-end">
               <Button 
                 onClick={handleExport} 
                 className="w-full bg-notion-text text-white hover:bg-stone-800 h-11 rounded-md font-black uppercase text-[10px] tracking-widest shadow-sm whitespace-nowrap" 
                 isLoading={isExporting}
               >
                 <Download size={16} className="mr-2" /> Unduh
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Table (Boxy) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
         <div className="p-4 border-b border-[#EFEFEF] bg-white flex items-center gap-3">
             <Eye className="w-4 h-4 text-rose-500 opacity-70" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-text">Pratinjau Data</span>
         </div>
         {isLoading ? (
           <div className="p-20 flex flex-col items-center gap-4 text-center">
             <div className="animate-spin h-5 w-5 border-b-2 border-stone-200 rounded-full"></div>
             <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Menyiapkan Pratinjau...</span>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-xs border-collapse">
               <thead>
                 <tr className="bg-stone-50/50 border-b border-[#EFEFEF]">
                   <th className="px-6 py-4 text-left text-[10px] font-black text-notion-gray uppercase tracking-widest min-w-[280px] sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Jenis Kegiatan Profesional</th>
                   {bulanRange.map(bulan => (
                      <th key={bulan} className="px-4 py-4 text-center text-[10px] font-black text-notion-gray uppercase tracking-widest border-l border-[#EFEFEF] min-w-[50px]">
                        {BULAN_OPTIONS.find(bb => bb.value === bulan)?.label?.slice(0, 3)}
                      </th>
                   ))}
                   <th className="px-6 py-4 text-center text-[10px] font-black text-notion-blue uppercase tracking-widest border-l border-[#EFEFEF] bg-blue-50/30">Total</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#EFEFEF]">
                 {activities.map(activity => (
                   <tr key={activity.id} className="hover:bg-stone-50/30 transition-colors group">
                     <td className="px-6 py-4 font-bold text-notion-text sticky left-0 bg-white group-hover:bg-stone-50 transition-colors z-10 shadow-[1px_0_0_#EFEFEF]">
                       {activity.nama_kegitan}
                     </td>
                     {bulanRange.map(bulan => (
                       <td key={bulan} className={cn(
                          "px-4 py-4 text-center border-l border-[#EFEFEF]",
                          getValue(activity.id, bulan) > 0 ? "font-black text-notion-text" : "text-notion-gray opacity-20"
                       )}>
                         {getValue(activity.id, bulan) || '-'}
                       </td>
                     ))}
                     <td className="px-6 py-4 text-center font-black text-notion-blue bg-blue-50/10 border-l border-[#EFEFEF]">
                       {getTotal(activity.id)}
                     </td>
                   </tr>
                 ))}
                 <tr className="bg-stone-50 border-t-2 border-[#EFEFEF]">
                    <td className="px-6 py-5 text-[10px] font-black text-notion-text uppercase tracking-[0.2em] sticky left-0 bg-stone-50 z-10 shadow-[1px_0_0_#EFEFEF]">Total Keseluruhan</td>
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

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-md flex items-start gap-4 shadow-sm">
         <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-amber-600 shadow-sm shrink-0">
            <Filter size={16} />
         </div>
         <div>
            <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Penting</h4>
            <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
               Pastikan semua data pada pratinjau di atas sudah benar sebelum mengunduh. 
               Laporan ini dapat digunakan sebagai lampiran resmi dalam pengajuan P2KB.
            </p>
         </div>
      </div>
    </div>
  )
}