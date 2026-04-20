'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PenSquare, FileText, Download, ChevronRight, HelpCircle } from 'lucide-react'

const SUBMENU_ITEMS = [
  {
    title: 'Dashboard Input Baru',
    description: 'Mulai mencatat kegiatan baru bulan ini',
    href: '/logbook/input',
    icon: <PenSquare className="w-5 h-5 text-notion-blue" />,
    badge: 'Sering Digunakan',
  },
  {
    title: 'Riwayat Logbook',
    description: 'Lihat dan edit data kegiatan sebelumnya',
    href: '/logbook/list',
    icon: <FileText className="w-5 h-5 text-notion-orange" />,
  },
  {
    title: 'Rekap & Sertifikasi',
    description: 'Unduh laporan 6 & 12 bulan',
    href: '/logbook/export',
    icon: <Download className="w-5 h-5 text-notion-green" />,
  },
]

export default function LogbookPage() {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">
          Logbook PMIK
        </h1>
        <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
          Sistem dokumentasi profesional untuk memantau perkembangan kompetensi dan beban kerja Anda secara real-time.
        </p>
        <div className="mt-6">
          <Link href="/logbook/input">
            <Button className="bg-notion-text text-white hover:bg-[#201F1C] rounded-md px-5 h-9 font-medium shadow-none text-sm transition-colors">
              <PenSquare className="mr-2 h-4 w-4" />
              Input Sekarang
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBMENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="group min-h-[140px] flex flex-col p-5 border border-[#EFEFEF] bg-white rounded-md hover:bg-stone-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
               {item.icon}
               {item.badge && (
                 <span className="px-2 py-0.5 bg-notion-blue_bg text-notion-blue text-[10px] font-medium rounded-sm">
                   {item.badge}
                 </span>
               )}
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-notion-text mb-1 group-hover:text-notion-blue transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-notion-gray leading-relaxed">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Guide & Help Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-notion-text mb-6">Panduan Logbook</h2>
            <div className="space-y-6">
              {[
                { title: 'Tujuan Logbook', content: 'Digunakan sebagai bukti portofolio pekerjaan bulanan dan pemenuhan SKP (Satuan Kredit Profesi).' },
                { title: 'Periode Masukan', content: 'Input data setiap hari atau minimal seminggu sekali agar akurasi data tetap terjaga.' },
                { title: 'Batas Waktu', content: 'Finalisasi rekap bulanan sebelum tanggal 10 di bulan berikutnya untuk keperluan validasi.' }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md bg-stone-100 text-notion-gray text-xs font-medium flex items-center justify-center border border-[#EFEFEF]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-notion-text text-[15px] mb-1">{step.title}</h4>
                    <p className="text-sm text-notion-gray leading-relaxed">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action / Help Side */}
        <div>
           <div className="p-5 border border-[#EFEFEF] bg-stone-50 rounded-md">
             <div className="flex items-center gap-2 mb-3">
               <HelpCircle className="w-5 h-5 text-notion-gray" />
               <h3 className="font-medium text-notion-text text-[15px]">Butuh Bantuan?</h3>
             </div>
             <p className="text-sm text-notion-gray leading-relaxed mb-5">
               Jika Anda mengalami kesulitan dalam menentukan kode kegiatan, hubungi komite etik wilayah Anda untuk panduan teknis lebih lanjut.
             </p>
             <Button variant="outline" className="w-full bg-white border-[#EFEFEF] hover:bg-stone-100 text-notion-text font-medium text-sm h-9 shadow-none rounded-md">
               Hubungi Bantuan
             </Button>
           </div>
        </div>
      </div>
    </div>
  )
}