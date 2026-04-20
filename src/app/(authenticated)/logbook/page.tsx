'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const SUBMENU_ITEMS = [
  {
    title: 'Dashboard Input Baru',
    description: 'Mulai mencatat kegiatan baru bulan ini',
    href: '/logbook/input',
    icon: (
      <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-100">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    ),
    badge: 'Paling Sering',
  },
  {
    title: 'Riwayat Logbook',
    description: 'Lihat dan edit data kegiatan sebelumnya',
    href: '/logbook/list',
    icon: (
      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-100">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </div>
    ),
  },
  {
    title: 'Rekap & Sertifikasi',
    description: 'Unduh laporan 6 & 12 bulan',
    href: '/logbook/export',
    icon: (
      <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    ),
  },
]

export default function LogbookPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pencatatan Logbook Efisien</h2>
          <p className="mt-4 text-slate-400 text-lg">
            Sistem dokumentasi profesional PMIK untuk memantau perkembangan kompetensi dan beban kerja Anda secara real-time.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/logbook/input">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-teal-900/20">
                Input Sekarang
              </Button>
            </Link>
          </div>
        </div>
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBMENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6 flex items-start justify-between">
                    {item.icon}
                    {item.badge && (
                      <span className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-teal-100">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-500 leading-relaxed uppercase text-[11px] font-bold tracking-widest">
                    {item.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-sm font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
                    Buka Menu
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Instructional Content with Modern Accordion-like style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm">?</span>
              Petunjuk Pengisian Logbook
            </h3>
            
            <div className="space-y-8">
              {[
                { title: 'Tujuan Logbook', content: 'Digunakan sebagai bukti portofolio pekerjaan bulanan dan pemenuhan SKP (Satuan Kredit Profesi).' },
                { title: 'Periode Masukan', content: 'Input data setiap hari atau minimal seminggu sekali agar akurasi data tetap terjaga.' },
                { title: 'Batas Waktu', content: 'Finalisasi rekap bulanan sebelum tanggal 10 di bulan berikutnya untuk keperluan validasi.' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 text-slate-400 font-bold flex items-center justify-center border border-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-100 transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors lowercase tracking-tight text-lg mb-1">{step.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Alert */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h4 className="text-xl font-bold">Butuh Bantuan?</h4>
             <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
               Jika Anda mengalami kesulitan dalam menentukan kode kegiatan, hubungi komite etik wilayah Anda.
             </p>
             <button className="mt-8 w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
               Hubungi CS
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}