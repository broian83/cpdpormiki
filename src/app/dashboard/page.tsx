// @ts-nocheck
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

async function getDashboardStats(userId: string) {
  const supabase = await createServerClient()

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const { data: logbookData } = await supabase
    .from('monthly_logbooks')
    .select('*, monthly_logbook_details(*)')
    .eq('user_id', userId)
    .eq('tahun', currentYear)
    .eq('bulan', currentMonth)
    .single()

  const { count: unreadMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false)

  const { data: unpaidInvoices } = await supabase
    .from('payment_invoices')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'unpaid')
    .limit(3)

  const { data: lmsEnrollments } = await supabase
    .from('lms_enrollments')
    .select('*, lms_courses(*)')
    .eq('user_id', userId)
    .eq('status', 'enrolled')
    .limit(3)

  let totalActivities = 0
  if (logbookData?.monthly_logbook_details) {
    totalActivities = logbookData.monthly_logbook_details.reduce(
      (sum: number, detail: { jumlah_kegitan: number }) => sum + (detail.jumlah_kegitan || 0),
      0
    )
  }

  return {
    totalEntries: logbookData ? 1 : 0,
    totalActivities,
    unreadMessages: unreadMessages || 0,
    unpaidInvoices: unpaidInvoices || [],
    lmsEnrollments: lmsEnrollments || [],
  }
}

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const stats = await getDashboardStats(session.user.id)

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Selamat datang di Member Area PMIK</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Entri Bulan Ini</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalEntries}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Kegiatan</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalActivities}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pesan Baru</p>
                <p className="text-2xl font-bold text-slate-900">{stats.unreadMessages}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Tagihan</p>
                <p className="text-2xl font-bold text-slate-900">{stats.unpaidInvoices.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/logbook/input"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className="p-2 bg-teal-100 rounded-lg">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Input Logbook</span>
              </Link>

              <Link
                href="/mailbox"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Pesan</span>
              </Link>

              <Link
                href="/lms"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Kursus LMS</span>
              </Link>

              <Link
                href="/profile"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Profil</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tagihan Iuran</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.unpaidInvoices.length > 0 ? (
              <div className="space-y-3">
                {stats.unpaidInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{invoice.jenis_iuran}</p>
                      <p className="text-sm text-slate-500">{invoice.periode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">Rp {invoice.nominal.toLocaleString('id-ID')}</p>
                      <Badge variant="danger">Belum Bayar</Badge>
                    </div>
                  </div>
                ))}
                <Link href="/payment" className="block text-center text-sm text-teal-600 hover:underline mt-3">
                  Lihat Semua Tagihan →
                </Link>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">Tidak ada tagihan</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}