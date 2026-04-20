// @ts-nocheck
'use client'

import { Users, FileText, CreditCard, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      {/* Header section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Admin Overview</h1>
        <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
          Statistik ringkas dan notifikasi sistem terbaru dari platform CPD PMIK.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-[#EFEFEF] p-5 rounded-md bg-white hover:border-notion-gray/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-notion-blue_bg text-notion-blue">
                 <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[14px]">Total Member</h3>
            </div>
            <p className="text-3xl font-serif font-semibold">1,248</p>
          </div>
          <div className="border border-[#EFEFEF] p-5 rounded-md bg-white hover:border-notion-gray/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-notion-orange_bg text-notion-orange">
                 <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[14px]">Logbook Pending</h3>
            </div>
            <p className="text-3xl font-serif font-semibold">54</p>
          </div>
          <div className="border border-[#EFEFEF] p-5 rounded-md bg-white hover:border-notion-gray/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-notion-green_bg text-notion-green">
                 <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[14px]">Pembayaran Valid</h3>
            </div>
            <p className="text-3xl font-serif font-semibold">920</p>
          </div>
          <div className="border border-[#EFEFEF] p-5 rounded-md bg-white hover:border-notion-gray/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded bg-notion-red_bg text-notion-red">
                 <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-[14px]">Aktivitas Hari Ini</h3>
            </div>
            <p className="text-3xl font-serif font-semibold">12.4K</p>
          </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
          <div className="p-4 border-b border-[#EFEFEF] bg-stone-50">
             <h3 className="font-semibold text-[14px] uppercase tracking-wider text-notion-gray">Member Terdaftar Terbaru</h3>
          </div>
          <div className="p-0">
             <div className="p-16 flex justify-center border-b border-[#EFEFEF] border-dashed text-notion-gray text-sm">
                 Tabel member akan muncul disini.
             </div>
          </div>
        </div>
        
        <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
          <div className="p-4 border-b border-[#EFEFEF] bg-stone-50">
             <h3 className="font-semibold text-[14px] uppercase tracking-wider text-notion-gray">Aktivitas Logbook Terbaru</h3>
          </div>
          <div className="p-0">
             <div className="p-16 flex justify-center border-b border-[#EFEFEF] border-dashed text-notion-gray text-sm">
                 Riwayat submisi akan muncul disini.
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
