'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS, PAGE_SIZE } from '@/lib/constants'
import { formatDate, getBulanLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Save, Plus, FileText, Search, Trash2, CalendarCheck2 } from 'lucide-react'

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
    if (!confirm('Yakin ingin menghapus entri ini secara permanen?')) return
    await supabase.from('monthly_logbooks').delete().eq('id', id)
    fetchEntries()
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      {/* Page Header */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/logbook')}
            className="rounded-sm w-9 h-9 mt-1 text-notion-gray hover:bg-stone-100 border border-transparent shadow-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Riwayat Logbook</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Manajemen histori pencatatan kegiatan bulanan Anda.</p>
          </div>
        </div>
        <Link href="/logbook/input">
          <Button className="bg-notion-blue hover:bg-notion-blue/90 text-white rounded-sm font-medium px-5 h-10 shadow-none">
            <Plus className="w-4 h-4 mr-2" />
            Entri Baru
          </Button>
        </Link>
      </div>

      {/* Filter Options */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center gap-2">
           <Search className="w-4 h-4 text-notion-gray opacity-70" />
           <span className="text-[13px] font-semibold uppercase tracking-widest text-notion-gray">Saring Laporan</span>
        </div>
        <div className="p-5 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select
              label="Tahun Laporan"
              options={TAHUN_OPTIONS}
              value={filterTahun}
              onChange={(e) => { setFilterTahun(Number(e.target.value)); setPage(1); }}
              className="h-9 rounded-sm border-[#EFEFEF] shadow-none"
            />
          </div>
          <div className="flex-1">
            <Select
              label="Bulan"
              options={[{ value: 0, label: 'Semua Bulan' }, ...BULAN_OPTIONS]}
              value={filterBulan}
              onChange={(e) => { setFilterBulan(Number(e.target.value)); setPage(1); }}
              className="h-9 rounded-sm border-[#EFEFEF] shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Table / List Rendering */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-24 bg-stone-50 rounded-md border border-[#EFEFEF] border-dashed">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-notion-gray mb-4"></div>
            <p className="text-sm text-notion-gray">Memuat histori logbook...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-md border border-[#EFEFEF] border-dashed text-center px-6">
            <div className="mb-4 text-notion-gray opacity-30">
              <CalendarCheck2 className="w-10 h-10" />
            </div>
            <h3 className="text-[15px] font-semibold text-notion-text mb-2">Arsip Masih Kosong</h3>
            <p className="text-sm text-notion-gray max-w-sm mx-auto leading-relaxed">
              Belum ditemukan catatan logbook untuk filter waktu yang Anda pilih.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden group hover:shadow-sm transition-all">
                <div className="p-5 border-b border-[#EFEFEF] bg-stone-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-[#EFEFEF] rounded flex flex-col justify-center items-center shadow-sm text-notion-text">
                      <span className="text-[10px] font-semibold tracking-wider">{entry.tahun}</span>
                      <span className="text-sm font-bold">{getBulanLabel(entry.bulan).substring(0, 3)}</span>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-notion-text leading-tight">
                        Logbook Bulanan
                      </h3>
                      <p className="text-[11px] text-notion-gray uppercase font-semibold tracking-wider mt-1">
                        Dibuat {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm ${entry.status_draft ? 'bg-stone-100 text-notion-gray' : 'bg-notion-green_bg text-notion-green'}`}>
                      {entry.status_draft ? 'Draft' : 'Final'}
                    </span>
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 text-notion-gray hover:text-notion-red hover:bg-notion-red/10 rounded transition-colors" title="Hapus Permanen">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {entry.monthly_logbook_details?.map((detail, idx) => (
                      <div key={idx} className="flex flex-col p-4 bg-stone-50 border border-[#EFEFEF] rounded-sm group-hover:bg-white transition-colors">
                        <span className="text-[10px] font-semibold text-notion-gray uppercase tracking-widest mb-1.5">{detail.activity_categories?.kode_kegitan}</span>
                        <span className="text-[15px] font-medium text-notion-text line-clamp-2 leading-tight mb-3 flex-1">{detail.activity_categories?.nama_kegitan}</span>
                        <div className="flex items-center gap-1 border-t border-[#EFEFEF] pt-3 mt-auto">
                          <span className="text-lg font-semibold text-notion-blue leading-none">{detail.jumlah_kegitan}</span>
                          <span className="text-xs text-notion-gray font-medium">kali</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="h-8 px-3 rounded-sm border-[#EFEFEF] text-xs font-medium text-notion-text shadow-none hover:bg-stone-50"
          >
            ← Prev
          </Button>
          <div className="px-3 py-1.5 bg-stone-50 rounded-sm border border-[#EFEFEF] text-xs font-semibold text-notion-gray">
            Halaman {page} dari {totalPages}
          </div>
          <Button 
            variant="outline" 
            disabled={page === totalPages} 
            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="h-8 px-3 rounded-sm border-[#EFEFEF] text-xs font-medium text-notion-text shadow-none hover:bg-stone-50"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  )
}