// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Inbox, ArrowLeft } from 'lucide-react'

export default function AdminMailboxPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-stone-50 border border-[#EFEFEF] rounded-full flex items-center justify-center text-stone-200">
        <Inbox size={40} />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-[11px] font-black text-notion-text uppercase tracking-[0.3em] opacity-40">Modul Dinonaktifkan</h2>
        <h3 className="text-2xl font-serif font-bold text-notion-text">Mailbox Tidak Tersedia</h3>
        <p className="text-sm text-notion-gray max-w-sm mx-auto">
          Fitur ticketing dan mailbox admin telah dihapus sesuai permintaan. Halaman ini tidak lagi melayani pesan masuk.
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => router.push('/admin/dashboard')}
        className="h-11 px-8 rounded-md border-[#EFEFEF] text-[10px] font-black uppercase tracking-widest text-notion-text hover:bg-stone-50"
      >
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Dashboard
      </Button>
    </div>
  )
}
