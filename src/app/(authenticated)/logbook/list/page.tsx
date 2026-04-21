// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS, PAGE_SIZE } from '@/lib/constants'
import { formatDate, getBulanLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  FileText, 
  Search, 
  Trash2, 
  CalendarCheck2,
  ChevronRight
} from 'lucide-react'

interface LogbookEntry {
  id: string
  tahun: number
  bulan: number
  status_draft: boolean
  created_at: string
  monthly_logbook_details: {
    id: string
    jumlah_kegitan: number
    keterangan: string | null
    activity_categories: {
      kode_kegitan: string
      nama_kegitan: string
    }
  }[]
}

export default function LogbookListPage() {
  const router = useRouter()
  const supabase = createClient()
  const [entries, setEntries] = useState<LogbookEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear())
  const [filterBulan, setFilterBulan] = useState(0)

  useEffect(() => {
    fetchEntries()
  }, [page, filterTahun, filterBulan])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      let query = supabase
        .from('monthly_logbooks')
        .select(`
          id, tahun, bulan, status_draft, created_at,
          monthly_logbook_details!inner(
            id, jumlah_kegitan, keterangan,
            activity_categories(kode_kegitan, nama_kegitan)
          )
        `, { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (filterTahun) query = query.eq('tahun', filterTahun)
      if (filterBulan > 0) query = query.eq('bulan', filterBulan)

      const { data, count, error } = await query

      if (!error && data) {
        setEntries(data as unknown as LogbookEntry[])
        setTotalCount(count || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus entri ini?')) return
    await supabase.from('monthly_logbooks').delete().eq('id', id)
    fetchEntries()
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-16 duration-500">
      {/* Mini Breadcrumb/Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/logbook')} className="text-notion-gray hover:text-notion-text transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Riwayat Logbook</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold text-notion-text">Histori Laporan</h2>
        <Link href="/logbook/input">
           <Button className="bg-notion-text text-white hover:bg-stone-800 rounded-md h-10 px-5 text-sm font-bold shadow-sm">
             <Plus size={18} className="mr-2" /> Entri Baru
           </Button>
        </Link>
      </div>

      {/* Filter Options (Box Design User Suka) */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-notion-gray opacity-70" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Saring Laporan</span>
           </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Tahun Laporan</label>
              <Select
                options={TAHUN_OPTIONS}
                value={filterTahun}
                onChange={(e) => { setFilterTahun(Number(e.target.value)); setPage(1); }}
                className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Bulan</label>
              <Select
                options={[{ value: 0, label: 'Semua Bulan' }, ...BULAN_OPTIONS]}
                value={filterBulan}
                onChange={(e) => { setFilterBulan(Number(e.target.value)); setPage(1); }}
                className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Entries List Area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 bg-white border border-[#EFEFEF] rounded-md border-dashed">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray mr-3"></div>
            <p className="text-xs font-bold text-notion-gray uppercase tracking-widest">Sinkronisasi...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center p-20 bg-white border border-[#EFEFEF] rounded-md border-dashed">
             <CalendarCheck2 className="w-10 h-10 text-notion-gray/20 mx-auto mb-4" />
             <p className="text-sm font-bold text-notion-gray uppercase tracking-widest">Tidak ada data</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden hover:shadow-md transition-all group">
                <div className="p-4 border-b border-[#EFEFEF] bg-stone-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white border border-[#EFEFEF] rounded flex flex-col items-center justify-center text-notion-text shrink-0 shadow-sm">
                        <span className="text-[8px] font-bold uppercase leading-none opacity-50">{getBulanLabel(entry.bulan).substring(0, 3)}</span>
                        <span className="text-xs font-black">{entry.tahun}</span>
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-notion-text">Logbook Bulanan</h3>
                        <p className="text-[10px] text-notion-gray font-medium uppercase tracking-tight opacity-60">Dibuat {formatDate(entry.created_at)}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${entry.status_draft ? 'bg-stone-100 text-notion-gray' : 'bg-emerald-50 text-emerald-600'}`}>
                        {entry.status_draft ? 'Draft' : 'Final'}
                     </span>
                     <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-notion-gray/20 hover:text-notion-red transition-colors">
                        <Trash2 size={16} />
                     </button>
                  </div>
                </div>
                <div className="p-5">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entry.monthly_logbook_details?.slice(0, 2).map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-stone-50/30 border border-stone-100/50 rounded">
                           <div className="text-notion-blue font-black text-xs pt-0.5 leading-none">{detail.jumlah_kegitan}x</div>
                           <div className="text-[11px] font-bold text-notion-text truncate leading-tight uppercase tracking-tight">
                              {detail.activity_categories?.nama_kegitan}
                           </div>
                        </div>
                      ))}
                      {entry.monthly_logbook_details?.length > 2 && (
                         <div className="flex items-center p-3 border border-dashed border-stone-100 rounded text-[9px] font-black text-notion-gray uppercase tracking-widest">
                            +{entry.monthly_logbook_details.length - 2} Aktivitas Lainnya
                         </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Simple */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-9 px-4 rounded-md border-[#EFEFEF] text-xs font-bold text-notion-text uppercase tracking-widest">
             Prev
          </Button>
          <div className="text-[10px] font-black text-notion-gray uppercase tracking-widest">
            {page} / {totalPages}
          </div>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-9 px-4 rounded-md border-[#EFEFEF] text-xs font-bold text-notion-text uppercase tracking-widest">
             Next
          </Button>
        </div>
      )}
    </div>
  )
}