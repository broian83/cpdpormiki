// @ts-nocheck
'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SUBMENU_ITEMS = [
  {
    title: 'Petunjuk Pengisian Logbook PMIK',
    description: 'Pelajari cara填写 logbook dengan benar',
    href: '/logbook',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Input Logbook Bulanan',
    description: 'Catat kegiatan bulanan Anda',
    href: '/logbook/input',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: 'Daftar Entri Logbook',
    description: 'Lihat semua entri logbook Anda',
    href: '/logbook/list',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    title: 'Rekap 6 Bulan',
    description: 'Lihat rekap kegiatan 6 bulan',
    href: '/logbook/rekap-6',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Rekap 12 Bulan',
    description: 'Lihat rekap kegiatan 12 bulan',
    href: '/logbook/rekap-12',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Cetak / Export Laporan',
    description: 'Cetak atau export ke PDF',
    href: '/logbook/export',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function LogbookPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Logbook PMIK</h2>
        <p className="text-slate-600">Catat dan rekap kegiatan harian Anda</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBMENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:border-teal-500 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg text-teal-600 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Petunjuk Pengisian Logbook PMIK</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">1. Tujuan Logbook</h4>
              <p>Logbook PMIK digunakan untuk mencatat kegiatan-kegiatannya profesiona Manajer Informasi Kesehatan (PMIK) setiap bulan sebagai bukti pekerjaan dan pengembangan kompetensi.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">2. Cara Pengisian</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Pilih tahun dan bulan yang ingin diisi</li>
                <li>Pilih jenis kegiatan dari daftar yang tersedia</li>
                <li>Masukkan jumlah kegiatan untuk setiap jenis</li>
                <li>Tambahkan keterangan jika diperlukan</li>
                <li>Simpan entri logbook</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">3. Periode Submit</h4>
              <p>Logbook bulanan dapat diisi sewaktu-waktu dan disubmit sebelum tanggal 10 bulan berikutnya.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}