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
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Document Title / Welcome */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold text-notion-text mb-4 tracking-tight">
          Welcome, {stats.profileName}
        </h1>
        <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
          Pantau progres capaian SKP dan aktifitas keprofesian Anda secara real-time. Mulai dengan membuat logbook baru atau menyelesaikan tagihan Anda.
        </p>
        <div className="mt-6">
          <Link href="/logbook/input">
            <Button className="bg-notion-text text-white hover:bg-[#201F1C] rounded-md px-5 h-9 font-medium shadow-none text-sm transition-colors">
              <PlusCircle className="mr-2 h-4 w-4" />
              Input Logbook
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-semibold text-notion-text">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<Calendar className="w-5 h-5 text-notion-blue" />}
            label="Logbook Bulan Ini"
            value={stats.totalEntries.toString()}
            color="bg-notion-blue_bg border-[#EFEFEF]"
          />
          <StatCard 
            icon={<TrendingUp className="w-5 h-5 text-notion-green" />}
            label="Total Kegiatan"
            value={stats.totalActivities.toString()}
            color="bg-notion-green_bg border-[#EFEFEF]"
          />
          <StatCard 
            icon={<MessageSquare className="w-5 h-5 text-notion-orange" />}
            label="Pesan Belum Dibaca"
            value={stats.unreadMessages.toString()}
            color="bg-notion-orange_bg border-[#EFEFEF]"
          />
          <StatCard 
            icon={<Zap className="w-5 h-5 text-notion-gray" />}
            label="Tagihan Aktif"
            value={stats.unpaidInvoices.length.toString()}
            color="bg-stone-50 border-[#EFEFEF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Quick Links Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-notion-text mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickActionCard 
              href="/private-area"
              title="Private Area"
              icon="📄"
            />
            <QuickActionCard 
              href="/lms"
              title="Portal LMS"
              icon="🎓"
            />
            <QuickActionCard 
              href="/logbook/rekap-12"
              title="Rekap Logbook"
              icon="📊"
            />
            <QuickActionCard 
              href="/profile"
              title="Pengaturan Profil"
              icon="👤"
            />
          </div>
        </div>

        {/* Side Panel: Invoices & Info */}
        <div className="space-y-8">
           <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-semibold text-notion-text">Tagihan</h2>
              <Link href="/payment" className="text-sm text-notion-gray hover:text-notion-text transition-colors">
                View All
              </Link>
            </div>
            
            <div className="border border-[#EFEFEF] rounded-md overflow-hidden bg-white">
                {stats.unpaidInvoices.length > 0 ? (
                  <div className="divide-y divide-[#EFEFEF]">
                    {stats.unpaidInvoices.map((invoice) => (
                      <div key={invoice.id} className="p-4 bg-white hover:bg-stone-50 transition-colors cursor-pointer flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-medium text-notion-text">{invoice.jenis_iuran}</p>
                          <p className="text-xs text-notion-gray mt-0.5">{invoice.periode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-notion-text font-medium">
                            Rp {invoice.nominal.toLocaleString('id-ID')}
                          </p>
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-notion-red_bg text-notion-red">Unpaid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-notion-gray text-sm flex flex-col items-center">
                    <span className="text-2xl mb-2">🎉</span>
                    Tidak ada tagihan tertunda
                  </div>
                )}
            </div>
          </div>

          {/* Info Card */}
          <div className="p-4 bg-notion-bg border border-[#EFEFEF] rounded-md flex gap-3 shadow-none">
             <div className="mt-0.5 text-notion-yellow">💡</div>
             <div>
               <h4 className="text-sm font-medium text-notion-text mb-1">Informasi</h4>
               <p className="text-sm text-notion-gray leading-relaxed">
                 Pastikan data STR Anda selalu diperbarui melalui menu Profil untuk kelancaran validasi logbook bulanan.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className={`p-4 rounded-md border text-left flex flex-col justify-between min-h-[100px] ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm text-notion-text font-medium">{label}</span>
      </div>
      <div>
        <span className="text-2xl font-semibold text-notion-text">{value}</span>
      </div>
    </div>
  )
}

function QuickActionCard({ href, title, icon }: { href: string, title: string, icon: string }) {
  return (
    <Link href={href} className="group block">
      <div className="p-3 border border-[#EFEFEF] rounded-md bg-white hover:bg-stone-50 transition-colors flex items-center gap-3">
        <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-sm font-medium text-notion-text">{title}</span>
      </div>
    </Link>
  )
}