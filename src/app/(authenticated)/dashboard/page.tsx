// @ts-nocheck
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
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
  ArrowUpRight,
  ShieldCheck,
  LogIn,
  PenSquare,
  Clock
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
    <div className="space-y-8 pb-32 animate-in fade-in duration-500 max-w-2xl mx-auto">
      
      {/* 1. Header Area Boxy Style */}
      <section className="flex items-start justify-between border-b border-[#EFEFEF] pb-6 pt-4">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-stone-100 border border-[#EFEFEF] rounded-md flex items-center justify-center">
              <User size={24} className="text-notion-gray" />
           </div>
           <div>
              <p className="text-[10px] font-black text-notion-gray uppercase tracking-widest leading-none mb-1">PROFIL AKTIF</p>
              <h1 className="text-xl font-serif font-black text-notion-text tracking-tight">{stats.profileName}</h1>
           </div>
        </div>
        
        <Link href="/messages" className="relative p-2 bg-stone-50 border border-[#EFEFEF] rounded-md hover:bg-stone-100 transition-colors">
           <MessageSquare size={20} className="text-notion-text" />
           {stats.unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
           )}
        </Link>
      </section>

      {/* 2. Hero Promo Box */}
      <section>
        <div className="bg-notion-text border border-stone-800 rounded-md p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="relative z-10 space-y-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <Zap size={14} className="text-yellow-400" />
                 <span className="text-[10px] font-black text-white/70 tracking-widest uppercase">Target SKP Tahunan</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">Terus Tingkatkan Kompetensi Profesi Anda.</h2>
              <div className="flex items-center gap-3 pt-2">
                 <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-[45%]" />
                 </div>
                 <span className="text-[10px] font-black text-white tracking-widest">45%</span>
              </div>
            </div>
            <Button variant="inverted" className="w-full md:w-auto px-6 font-bold text-[10px] uppercase tracking-widest shrink-0 whitespace-nowrap">
               Lihat Detail
            </Button>
        </div>
      </section>

      {/* 3. Main Stats Grid */}
      <section className="grid grid-cols-2 gap-4 -mx-2 px-2 md:-mx-0 md:px-0">
        <StatBox 
          icon={<PenSquare size={18} className="text-notion-blue" />}
          label="Total Kegiatan"
          value={stats.totalActivities.toString()}
          subLabel="Bulan Ini"
          iconBg="bg-blue-50"
        />
        <StatBox 
          icon={<CreditCard size={18} className="text-orange-500" />}
          label="Tagihan Iuran"
          value={stats.unpaidInvoices.length.toString()}
          subLabel="Belum Dibayar"
          iconBg="bg-orange-50"
        />
      </section>

      {/* 4. Main Nav Grid (Layaknya Aplikasi/Widget) */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Menu Utama</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <NavBox icon={<PenSquare size={20} />} label="Logbook" href="/logbook" color="bg-notion-blue" />
           <NavBox icon={<BookOpen size={20} />} label="LMS PMIK" href="/lms" color="bg-purple-500" />
           <NavBox icon={<ShieldCheck size={20} />} label="Sertifikasi" href="/profile" color="bg-emerald-500" />
           <NavBox icon={<LayoutDashboard size={20} />} label="Menu Lain" href="/dashboard" color="bg-stone-700" />
        </div>
      </section>

      {/* 5. Invoices List Boxy */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em]">Tagihan Tertunda</h3>
            <Link href="/payment" className="text-[10px] font-bold text-notion-blue hover:underline">Lihat Semua</Link>
        </div>
        
        <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden">
          {stats.unpaidInvoices.length > 0 ? (
            <div className="divide-y divide-[#EFEFEF]">
              {stats.unpaidInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-orange-50 rounded-md flex items-center justify-center shrink-0 border border-orange-100">
                        <CreditCard size={18} className="text-orange-600" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-notion-text">{invoice.jenis_iuran}</h4>
                        <p className="text-[10px] text-notion-gray uppercase tracking-widest mt-0.5">{invoice.periode}</p>
                     </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full pt-2 md:pt-0 border-t md:border-t-0 border-[#EFEFEF]">
                     <div className="text-left md:text-right">
                        <div className="text-sm font-black text-notion-text">Rp{invoice.nominal.toLocaleString('id-ID')}</div>
                        <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Awaiting</div>
                     </div>
                     <Link href="/payment">
                       <Button className="h-8 px-4 bg-notion-text text-white text-[9px] uppercase tracking-widest rounded-md shrink-0">
                         Bayar
                       </Button>
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 flex flex-col items-center justify-center">
               <ShieldCheck className="text-emerald-500 w-8 h-8 mb-3 opacity-50" />
               <p className="text-xs font-bold text-notion-text">Tidak ada tagihan tertunda</p>
               <p className="text-[10px] text-notion-gray uppercase font-bold tracking-widest mt-1">Status keanggotaan Anda bersih</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. Footer Support */}
      <section className="pt-4">
         <div className="p-6 border border-[#EFEFEF] bg-stone-50 rounded-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-xs font-bold text-notion-text uppercase tracking-widest mb-1">Pusat Bantuan PMIK</h4>
              <p className="text-[11px] text-notion-gray font-medium">Kendala teknis akun atau aplikasi?</p>
            </div>
            <Link href="/help" className="w-full md:w-auto">
              <Button variant="default" className="w-full px-6 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                 Hubungi CS
              </Button>
            </Link>
         </div>
      </section>

    </div>
  )
}

function StatBox({ icon, label, value, subLabel, iconBg }: any) {
  return (
    <div className="p-4 bg-white rounded-md border border-[#EFEFEF] flex flex-col justify-between hover:border-stone-300 transition-colors">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", iconBg)}>
             {icon}
          </div>
          <span className="text-[9px] font-bold text-notion-gray uppercase tracking-widest">{subLabel}</span>
       </div>
       <div>
          <p className="text-2xl font-serif font-black text-notion-text leading-none mb-1">{value}</p>
          <p className="text-[10px] uppercase font-bold text-notion-gray tracking-widest">{label}</p>
       </div>
    </div>
  )
}

function NavBox({ icon, label, href, color }: any) {
  return (
    <Link href={href} className="group flex flex-col items-center justify-center p-4 bg-white border border-[#EFEFEF] rounded-md hover:border-notion-blue hover:shadow-sm transition-all text-center gap-3">
      <div className={cn("w-10 h-10 rounded-md flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform", color)}>
        {icon}
      </div>
      <span className="text-[9px] font-black text-notion-text uppercase tracking-widest group-hover:text-notion-blue transition-colors leading-tight">{label}</span>
    </Link>
  )
}