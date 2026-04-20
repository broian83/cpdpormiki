// @ts-nocheck
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  BookOpen, 
  PlusCircle, 
  User, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  Calendar,
  Zap,
  ArrowUpRight
} from 'lucide-react'

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
    .maybeSingle()

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

  const { data: profile } = await supabase
    .from('pmik_profiles')
    .select('nama_pmik')
    .eq('user_id', userId)
    .maybeSingle()

  return {
    totalEntries: logbookData ? 1 : 0,
    totalActivities,
    unreadMessages: unreadMessages || 0,
    unpaidInvoices: unpaidInvoices || [],
    lmsEnrollments: lmsEnrollments || [],
    profileName: profile?.nama_pmik || 'Rekan PMIK'
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
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4">
            <Badge className="bg-primary/20 text-primary border-none mb-2 px-4 py-1 text-xs font-bold uppercase tracking-widest">
              Selamat Datang Kembali
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">{stats.profileName}</span>!
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">
              Pantau progres capaian SKP dan aktifitas keprofesian Anda secara real-time di Dashboard Member Area.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/logbook/input">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-2xl px-8 h-14 shadow-xl">
                <PlusCircle className="mr-2 h-5 w-5" />
                Input Logbook
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="w-6 h-6" />}
          label="Entri Bulan Ini"
          value={stats.totalEntries}
          color="bg-teal-50 text-teal-600"
          trend="+1 dari bulan lalu"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Kegiatan"
          value={stats.totalActivities}
          color="bg-indigo-50 text-indigo-600"
          trend="Meningkat 12%"
        />
        <StatCard 
          icon={<MessageSquare className="w-6 h-6" />}
          label="Pesan Baru"
          value={stats.unreadMessages}
          color="bg-amber-50 text-amber-600"
          trend="Butuh tindakan"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6" />}
          label="Tagihan Aktif"
          value={stats.unpaidInvoices.length}
          color="bg-rose-50 text-rose-600"
          trend={stats.unpaidInvoices.length > 0 ? "Segera lunasi" : "Sudah lunas"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ArrowUpRight className="w-6 h-6 text-primary" />
              Aksi Cepat
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickActionCard 
              href="/private-area"
              title="Private Area"
              desc="Kelola dokumen & file pribadi"
              icon={<LayoutDashboard className="w-6 h-6" />}
              color="from-teal-500 to-emerald-600"
            />
            <QuickActionCard 
              href="/lms"
              title="Portal LMS"
              desc="Belajar & kembangkan skill"
              icon={<BookOpen className="w-6 h-6" />}
              color="from-indigo-500 to-purple-600"
            />
            <QuickActionCard 
              href="/cv"
              title="CV Builder"
              desc="Generasi CV otomatis"
              icon={<BarChart3 className="w-6 h-6" />}
              color="from-rose-500 to-orange-600"
            />
            <QuickActionCard 
              href="/profile"
              title="Pengaturan Profil"
              desc="Perbarui data diri Anda"
              icon={<User className="w-6 h-6" />}
              color="from-blue-500 to-cyan-600"
            />
          </div>
        </div>

        {/* Invoices Mini List */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-slate-400" />
              Tagihan
            </h3>
            <Link href="/payment" className="text-sm font-bold text-primary hover:underline">
               Lihat Semua
            </Link>
          </div>
          
          <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              {stats.unpaidInvoices.length > 0 ? (
                <div className="space-y-4">
                  {stats.unpaidInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-rose-200 transition-all cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-900">{invoice.jenis_iuran}</p>
                        <p className="text-xs text-slate-500">{invoice.periode}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-rose-600">Rp {invoice.nominal.toLocaleString('id-ID')}</p>
                        <span className="text-[10px] font-bold uppercase text-rose-400">Belum Bayar</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                   <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6" />
                   </div>
                   <p className="text-slate-900 font-bold">Semua Aman!</p>
                   <p className="text-sm text-slate-500">Tidak ada tagihan tertunda.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] border border-indigo-100">
             <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
               Info Penting
             </h4>
             <p className="text-sm text-indigo-700 leading-relaxed">
               Jangan lupa untuk selalu memperbarui data STR Anda di menu Profil untuk memvalidasi poin SKP.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, trend }: { icon: any, label: string, value: number, color: string, trend: string }) {
  return (
    <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ href, title, desc, icon, color }: { href: string, title: string, desc: string, icon: any, color: string }) {
  return (
    <Link href={href} className="group">
      <div className={`relative h-full p-6 rounded-3xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
          {icon}
        </div>
        <div className="relative z-10">
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            {icon}
          </div>
          <h4 className="text-xl font-bold mb-1">{title}</h4>
          <p className="text-white/70 text-sm">{desc}</p>
          <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
            Buka Sekarang <ArrowRight className="ml-2 w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  )
}