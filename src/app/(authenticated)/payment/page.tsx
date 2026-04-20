// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  const handleBayar = async (id: string) => {
    alert('Sistem Pembayaran Otomatis sedang dalam pemeliharaan. Silakan melakukan transfer manual ke rekening Bendahara DPD PORMIKI.')
  }

  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid')
  const paidInvoices = invoices.filter(i => i.status === 'paid')
  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.nominal, 0)

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest mb-4">
              <Wallet className="w-4 h-4" />
              <span>Status Saldo Iuran</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Tagihan Belum Dibayar</p>
                <h3 className="text-4xl font-black tracking-tight">
                  Rp {totalUnpaid.toLocaleString('id-ID')}
                </h3>
              </div>
              <Button className="bg-teal-500 hover:bg-teal-400 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-teal-500/20">
                Bayar Semua Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Keanggotaan Aktif</h4>
            <p className="text-sm text-slate-500 mt-1">Status iuran Anda terpantau aman hingga Desember 2024.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Payments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-slate-900">Tagihan Aktif</h3>
          </div>
          
          {unpaidInvoices.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400">Tidak ada tagihan yang tertunda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unpaidInvoices.map(inv => (
                <Card key={inv.id} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white rounded-2xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Receipt className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{inv.jenis_iuran}</p>
                          <p className="text-xs text-slate-500 font-medium">Periode: {inv.periode}</p>
                          <div className="mt-2 flex items-center gap-1 text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
                            <AlertCircle className="w-3 h-3" />
                            <span>Jatuh Tempo: {inv.due_date ? new Date(inv.due_date).toLocaleDateString('id-ID') : '-'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <Button size="sm" onClick={() => handleBayar(inv.id)} className="mt-2 bg-slate-900 rounded-lg hover:bg-slate-800">
                          Bayar
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-xl font-bold text-slate-900">Riwayat Transaksi</h3>
          </div>

          <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              {paidInvoices.length === 0 ? (
                <div className="p-12 text-center text-slate-400">Belum ada riwayat pembayaran.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {paidInvoices.map(inv => (
                    <div key={inv.id} className="p-6 hover:bg-slate-50/50 transition-colors flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{inv.jenis_iuran}</p>
                          <p className="text-xs text-slate-500">{inv.periode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Sudah Dibayar</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}