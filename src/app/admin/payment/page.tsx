// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, CheckCircle, XCircle, Clock, ExternalLink, CreditCard } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

interface PaymentInvoice {
  id: string
  user_id: string
  invoice_no: string
  jenis_iuran: string
  periode: string
  nominal: number
  status: 'unpaid' | 'paid' | 'pending'
  due_date: string
  paid_at: string
  created_at: string
  profiles: {
    nama_pmik: string
    nomor_anggota: string
  }
}

export default function AdminPaymentPage() {
  const supabase = createClient()
  const [payments, setPayments] = useState<PaymentInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('payment_invoices')
        .select(`
          *,
          profiles:user_id (nama_pmik, nomor_anggota)
        `)
        .order('created_at', { ascending: false })

      if (data) setPayments(data as any)
      if (error) console.error('Error fetching payments:', error)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updateData = { status: newStatus }
      if (newStatus === 'paid') {
        updateData.paid_at = new Date().toISOString()
      }
      
      const { error } = await supabase
        .from('payment_invoices')
        .update(updateData)
        .eq('id', id)
      
      if (error) throw error
      fetchPayments()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Gagal memperbarui status pembayaran.')
    }
  }

  const filteredPayments = payments.filter(p => 
    p.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profiles?.nama_pmik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.jenis_iuran?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    pending: payments.filter(p => p.status === 'unpaid').length,
    success: payments.filter(p => p.status === 'paid').length,
    totalNominal: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.nominal), 0)
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Monitoring Pembayaran</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Pantau status transaksi anggota yang diproses secara otomatis melalui gerbang pembayaran Mayar.id.
          </p>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
            <div className="flex items-center gap-2 text-notion-orange mb-3">
               <Clock className="w-4 h-4" />
               <h3 className="text-[11px] font-bold uppercase tracking-wider">Menunggu</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">{stats.pending} <span className="text-xs font-sans text-notion-gray font-normal">Tagihan Aktif</span></p>
         </div>
         <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
            <div className="flex items-center gap-2 text-notion-green mb-3">
               <CheckCircle className="w-4 h-4" />
               <h3 className="text-[11px] font-bold uppercase tracking-wider">Lunas</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">{stats.success} <span className="text-xs font-sans text-notion-gray font-normal">Transaksi Selesai</span></p>
         </div>
         <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
            <div className="flex items-center gap-2 text-notion-blue mb-3">
               <CreditCard className="w-4 h-4" />
               <h3 className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</h3>
            </div>
            <p className="text-2xl font-serif font-semibold">Rp {stats.totalNominal.toLocaleString('id-ID')}</p>
         </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex flex-col md:flex-row justify-between gap-4">
           <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-notion-gray opacity-70" />
              <input 
                type="text" 
                placeholder="Cari invoice atau nama anggota..." 
                className="w-full h-9 pl-9 pr-4 rounded-sm border border-[#EFEFEF] focus:outline-none focus:ring-1 focus:ring-notion-gray text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2 text-[11px] text-notion-gray bg-white border border-[#EFEFEF] px-3 py-1.5 rounded-sm font-medium">
             <ExternalLink className="w-3 h-3 text-notion-text/50" />
             Integrasi: Mayar Headless API
           </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
             <div className="p-20 text-center text-sm text-notion-gray animate-pulse font-medium">Sinkronisasi data perbendaharaan...</div>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F9F9F9] border-b border-[#EFEFEF]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider">Invoice / Anggota</th>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider">Layanan</th>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider">Nominal</th>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider">Tgl Pelunasan</th>
                  <th className="px-5 py-3.5 font-semibold text-notion-gray uppercase tracking-wider text-center">Kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9F9F9]/80 transition-colors">
                     <td className="px-5 py-5">
                        <div className="font-bold text-notion-text mb-0.5">{p.invoice_no}</div>
                        <div className="text-[12px] text-notion-gray flex items-center gap-1.5">
                           <User className="w-3 h-3 opacity-50" />
                           {p.profiles?.nama_pmik || 'Member'}
                        </div>
                    </td>
                    <td className="px-5 py-5">
                        <div className="font-medium text-notion-text">{p.jenis_iuran}</div>
                        <div className="text-[11px] font-bold text-notion-gray/60 uppercase tracking-tight mt-0.5">{p.periode}</div>
                    </td>
                    <td className="px-5 py-5 font-mono font-bold text-notion-text">
                       Rp {Number(p.nominal).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-5">
                       <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${p.status === 'paid' ? 'bg-notion-green_bg text-notion-green border border-notion-green/10' : p.status === 'unpaid' ? 'bg-notion-orange_bg text-notion-orange border border-notion-orange/10' : 'bg-notion-blue_bg text-notion-blue border border-notion-blue/10'}`}>
                         {p.status === 'paid' ? 'LUNAS' : p.status === 'unpaid' ? 'TERTUNDA' : 'PROSES'}
                       </span>
                    </td>
                    <td className="px-5 py-5 text-notion-gray font-medium">
                        {p.paid_at ? formatDate(p.paid_at) : (
                          <span className="opacity-30 italic">Belum dibayar</span>
                        )}
                    </td>
                    <td className="px-5 py-5">
                       <div className="flex items-center justify-center gap-2">
                          {p.status === 'unpaid' && (
                            <button 
                              onClick={() => {
                                if(confirm('Sahkan pembayaran ini secara manual? (Hanya gunakan jika webhook gagal)')) handleUpdateStatus(p.id, 'paid')
                              }} 
                              className="text-[11px] font-bold text-notion-gray hover:text-notion-text transition-colors flex items-center gap-1 underline underline-offset-4 decoration-notion-gray/30"
                            >
                              Force Paid
                            </button>
                          )}
                          {p.status === 'paid' && (
                            <div className="flex items-center gap-1 text-notion-green/70">
                               <CheckCircle className="w-3.5 h-3.5" />
                               <span className="text-[11px] font-bold uppercase tracking-tighter">Verified</span>
                            </div>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-20 text-center text-notion-gray bg-stone-50/30">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className="w-8 h-8 opacity-10" />
                        <p className="font-medium">Tidak ada transaksi yang cocok dengan pencarian.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
