// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Receipt, CreditCard, History, AlertCircle, CheckCircle2, ChevronRight, Wallet } from 'lucide-react'

interface Invoice {
  id: string
  invoice_no: string
  jenis_iuran: string
  periode: string
  nominal: number
  status: string
  due_date: string | null
}

export default function PaymentPage() {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchInvoices() }, [])

  const fetchInvoices = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('payment_invoices').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (data) setInvoices(data)
    setIsLoading(false)
  }

  const handleBayar = async (id: string, nominal: number, description: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/mayar/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: id,
          amount: nominal,
          description: description,
          customerName: session.user.user_metadata?.full_name || '',
          customerEmail: session.user.email
        })
      })

      const data = await response.json()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        alert('Gagal membuat koneksi pembayaran: ' + (data.error || 'Unknown Error'))
      }
    } catch (error) {
      console.error('Payment Flow Error:', error)
      alert('Terjadi kesalahan saat memproses pembayaran.')
    }
  }

  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid')
  const paidInvoices = invoices.filter(i => i.status === 'paid')
  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.nominal, 0)

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">
          Pembayaran Iuran
        </h1>
        <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
          Kelola tagihan, pantau riwayat pembayaran, dan pastikan status keanggotaan Anda tetap aktif melalui panel ini.
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border border-[#EFEFEF] bg-white rounded-md p-6 flex flex-col justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-2 text-notion-gray text-xs uppercase tracking-widest font-semibold mb-6">
              <Wallet className="w-4 h-4 text-notion-text" />
              <span>Status Saldo Iuran</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-notion-gray text-sm mb-1 font-medium">Total Tagihan Belum Dibayar</p>
                <h3 className="text-4xl font-semibold text-notion-text tracking-tight">
                  Rp {totalUnpaid.toLocaleString('id-ID')}
                </h3>
              </div>
              <Button className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm h-10 px-6 font-medium shadow-none transition-colors">
                Bayar Semua
              </Button>
            </div>
        </div>

        <div className="border border-[#EFEFEF] bg-white rounded-md p-6 flex flex-col items-center justify-center text-center h-full hover:bg-stone-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-notion-green_bg text-notion-green flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-notion-text text-[15px]">Keanggotaan Aktif</h4>
            <p className="text-sm text-notion-gray mt-1 leading-relaxed">Status iuran Anda terpantau aman hingga Desember 2024.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-4">
        {/* Pending Payments */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EFEFEF] pb-2">
            <CreditCard className="w-5 h-5 text-notion-text" />
            <h3 className="text-xl font-serif font-semibold text-notion-text">Tagihan Aktif</h3>
          </div>
          
          {unpaidInvoices.length === 0 ? (
            <div className="p-10 text-center bg-stone-50 rounded-md border border-[#EFEFEF]">
               <p className="text-notion-gray text-sm">Tidak ada tagihan yang tertunda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unpaidInvoices.map(inv => (
                <div key={inv.id} className="border border-[#EFEFEF] bg-white rounded-md p-4 hover:bg-stone-50 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="mt-0.5 opacity-60 text-notion-orange">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-[15px] text-notion-text">{inv.jenis_iuran}</p>
                          <p className="text-xs text-notion-gray font-medium mt-0.5">Periode: {inv.periode}</p>
                          <div className="mt-2 flex items-center gap-1 text-[11px] text-notion-red font-medium rounded-sm bg-notion-red_bg px-2 py-0.5 inline-flex">
                            <AlertCircle className="w-3 h-3" />
                            <span>Jatuh Tempo: {inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-semibold text-notion-text">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <Button 
                          size="sm" 
                          onClick={() => handleBayar(inv.id, inv.nominal, inv.jenis_iuran)} 
                          className="mt-2 bg-notion-bg border border-[#EFEFEF] text-notion-text hover:bg-stone-100 rounded-sm h-8 px-4 shadow-none"
                        >
                          Bayar
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EFEFEF] pb-2">
            <History className="w-5 h-5 text-notion-text" />
            <h3 className="text-xl font-serif font-semibold text-notion-text">Riwayat Transaksi</h3>
          </div>

          <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
              {paidInvoices.length === 0 ? (
                <div className="p-10 text-center text-notion-gray text-sm">Belum ada riwayat pembayaran.</div>
              ) : (
                <div className="divide-y divide-[#EFEFEF]">
                  {paidInvoices.map(inv => (
                    <div key={inv.id} className="p-4 hover:bg-stone-50 transition-colors flex justify-between items-center group">
                      <div className="flex gap-4 items-center">
                        <div className="opacity-60 text-notion-green">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[15px] font-medium text-notion-text">{inv.jenis_iuran}</p>
                          <p className="text-xs text-notion-gray mt-0.5">{inv.periode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-medium text-notion-text">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <p className="text-[11px] text-notion-green font-medium px-1.5 py-0.5 rounded-sm bg-notion-green_bg inline-block mt-1">Selesai</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}