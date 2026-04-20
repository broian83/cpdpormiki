// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('payment_invoices').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (data) setInvoices(data)
    setIsLoading(false)
  }

  const handleBayar = async (id: string) => {
    alert('Fitur pembayaran belum tersedia. Silakan hubungi admin.')
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Pembayaran Iuran</h2>
        <p className="text-slate-600">Kelola tagihan iuran anggota</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tagihan Belum Lunas</CardTitle></CardHeader>
          <CardContent>
            {invoices.filter(i => i.status === 'unpaid').length === 0 ? (
              <p className="text-slate-500">Tidak ada tagihan</p>
            ) : (
              <div className="space-y-3">
                {invoices.filter(i => i.status === 'unpaid').map(inv => (
                  <div key={inv.id} className="p-4 bg-red-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{inv.jenis_iuran}</p>
                        <p className="text-sm text-slate-500">{inv.periode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <Button size="sm" onClick={() => handleBayar(inv.id)}>Bayar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Riwayat Pembayaran</CardTitle></CardHeader>
          <CardContent>
            {invoices.filter(i => i.status === 'paid').length === 0 ? (
              <p className="text-slate-500">Tidak ada riwayat</p>
            ) : (
              <div className="space-y-3">
                {invoices.filter(i => i.status === 'paid').map(inv => (
                  <div key={inv.id} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{inv.jenis_iuran}</p>
                        <p className="text-sm text-slate-500">{inv.periode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">Rp {inv.nominal.toLocaleString('id-ID')}</p>
                        <Badge variant="success">Lunas</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}