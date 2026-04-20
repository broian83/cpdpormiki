// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS, PAGE_SIZE } from '@/lib/constants'
import { formatDate, getBulanLabel } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Daftar Entri Logbook</h2>
        <p className="text-slate-600">Lihat semua entri logbook Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Select
              label="Tahun"
              options={TAHUN_OPTIONS}
              value={filterTahun}
              onChange={(e) => { setFilterTahun(Number(e.target.value)); setPage(1); }}
            />
            <Select
              label="Bulan"
              options={[{ value: 0, label: 'Semua Bulan' }, ...BULAN_OPTIONS]}
              value={filterBulan}
              onChange={(e) => { setFilterBulan(Number(e.target.value)); setPage(1); }}
            />
            <div className="flex items-end">
              <Link href="/logbook/input" className="w-full">
                <Button className="w-full">+ Entri Baru</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Memuat...</div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada entri logbook</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {getBulanLabel(entry.bulan)} {entry.tahun}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.status_draft ? 'warning' : 'success'}>
                        {entry.status_draft ? 'Draft' : 'Submitted'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {entry.monthly_logbook_details?.map((detail, idx) => (
                      <div key={idx} className="text-sm bg-slate-50 p-2 rounded">
                        <span className="font-medium">{detail.activity_categories?.nama_kegitan}</span>
                        <span className="text-slate-500">: {detail.jumlah_kegitan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="flex items-center px-4 text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}