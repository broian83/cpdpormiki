'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS, PAGE_SIZE } from '@/lib/constants'
import { formatDate, getBulanLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/logbook')}
            className="rounded-full w-10 h-10 p-0 text-slate-500 hover:bg-white hover:text-teal-600 shadow-sm transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Riwayat Logbook</h2>
            <p className="text-slate-500">Manajemen histori pencatatan kegiatan bulanan Anda.</p>
          </div>
        </div>
        <Link href="/logbook/input">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 h-12 rounded-xl shadow-lg shadow-teal-100">
            + Tambah Entri Baru
          </Button>
        </Link>
      </div>

      {/* Filter Card */}
      <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Saring Pencarian</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tahun Laporan"
              options={TAHUN_OPTIONS}
              value={filterTahun}
              onChange={(e) => { setFilterTahun(Number(e.target.value)); setPage(1); }}
            />
            <Select
              label="Pilih Bulan"
              options={[{ value: 0, label: 'Semua Bulan' }, ...BULAN_OPTIONS]}
              value={filterBulan}
              onChange={(e) => { setFilterBulan(Number(e.target.value)); setPage(1); }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table / List Rendering */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-10 h-10 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Mencari arsip logbook Anda...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Arsip Masih Kosong</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Belum ditemukan catatan logbook untuk periode yang Anda pilih.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="border-none shadow-lg shadow-slate-100 bg-white rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 group-hover:bg-slate-50/30 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold uppercase">{entry.tahun}</span>
                        <span className="text-lg font-bold leading-tight">{getBulanLabel(entry.bulan).substring(0, 3)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Laporan {getBulanLabel(entry.bulan)}
                        </h3>
                        <p className="text-sm text-slate-400 mt-0.5">
                          Dibuat pada {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={entry.status_draft ? 'bg-amber-100 text-amber-700 border-none px-4 py-1.5' : 'bg-emerald-100 text-emerald-700 border-none px-4 py-1.5'}>
                        {entry.status_draft ? 'Draft' : 'Permanen'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(entry.id)}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {entry.monthly_logbook_details?.map((detail, idx) => (
                        <div key={idx} className="flex flex-col p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{detail.activity_categories?.kode_kegitan}</span>
                          <span className="font-semibold text-slate-800 line-clamp-1">{detail.activity_categories?.nama_kegitan}</span>
                          <span className="text-2xl font-bold text-teal-600 mt-2">{detail.jumlah_kegitan} <span className="text-xs font-medium text-slate-400">kali</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <Button 
            variant="outline" 
            disabled={page === 1} 
            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="rounded-xl"
          >
            ← Prev
          </Button>
          <div className="bg-white px-6 py-2 rounded-xl shadow-sm border border-slate-100 font-bold text-sm text-slate-700">
            Halaman {page} dari {totalPages}
          </div>
          <Button 
            variant="outline" 
            disabled={page === totalPages} 
            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="rounded-xl"
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  )
}