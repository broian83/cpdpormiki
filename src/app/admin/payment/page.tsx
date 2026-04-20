// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, CheckCircle, XCircle, Clock, ExternalLink, CreditCard } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

interface PaymentRecord {
  id: string
  user_id: string
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  payment_proof_url: string
  keterangan: string
  created_at: string
  profiles: {
    nama_pmik: string
    nira: string
  }
}

export default function AdminPaymentPage() {
  const supabase = createClient()
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('payment_records')
        .select(`
          id, user_id, amount, status, payment_proof_url, keterangan, created_at,
          profiles:user_id (nama_pmik, nira)
        `)
        .order('created_at', { ascending: false })

      if (data) setPayments(data as any)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('payment_records').update({ status: newStatus }).eq('id', id)
      fetchPayments()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Validasi Pembayaran</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Kelola verifikasi iuran anggota dan aktivasi masa berlaku akun member.
          </p>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
            <div className="flex items-center gap-2 text-notion-orange mb-3">
               <Clock className="w-4 h-4" />
               <h3 className="text-[11px] font-bold uppercase tracking-wider">Menunggu</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">28 <span className="text-xs font-sans text-notion-gray font-normal">Transaksi</span></p>
         </div>
         <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
            <div className="flex items-center gap-2 text-notion-green mb-3">
               <CheckCircle className="w-4 h-4" />
               <h3 className="text-[11px] font-bold uppercase tracking-wider">Berhasil</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">1.4K <span className="text-xs font-sans text-notion-gray font-normal">Transaksi</span></p>
         </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex flex-col md:flex-row justify-between gap-4">
           <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-notion-gray opacity-70" />
              <input 
                type="text" 
                placeholder="Cari transaksi..." 
                className="w-full h-9 pl-9 pr-4 rounded-sm border border-[#EFEFEF] focus:outline-none focus:ring-1 focus:ring-notion-gray text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-20 text-center text-sm text-notion-gray animate-pulse">Menghubungkan ke perbendaharaan...</div>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F9F9F9] border-b border-[#EFEFEF]">
                <tr>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Anggota</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Bukti</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Nominal</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F9F9]/80 transition-colors">
                    <td className="px-5 py-4">
                       <div className="font-semibold text-notion-text">{p.profiles?.nama_pmik || 'Member'}</div>
                       <div className="text-[11px] text-notion-gray uppercase tracking-tight">{formatDate(p.created_at)}</div>
                    </td>
                    <td className="px-5 py-4">
                       {p.payment_proof_url ? (
                         <a href={p.payment_proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-notion-blue font-medium hover:underline">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Lihat Foto
                         </a>
                       ) : <span className="text-notion-red opacity-50">Tidak ada</span>}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-notion-text">
                       Rp {p.amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'SUCCESS' ? 'bg-notion-green_bg text-notion-green' : p.status === 'FAILED' ? 'bg-notion-red_bg text-notion-red' : 'bg-notion-orange_bg text-notion-orange'}`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center justify-center gap-2">
                          {p.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleUpdateStatus(p.id, 'SUCCESS')} className="p-1.5 text-notion-green hover:bg-notion-green_bg rounded transition-colors" title="Sahkan">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleUpdateStatus(p.id, 'FAILED')} className="p-1.5 text-notion-red hover:bg-notion-red_bg rounded transition-colors" title="Tolak">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
