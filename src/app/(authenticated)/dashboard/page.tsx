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
  PenSquare
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
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Hero Welcome Section */}
      <section className="relative -mx-6 px-6 pt-2 pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-notion-blue opacity-[0.03] blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-notion-red opacity-[0.02] blur-[100px] rounded-full -ml-20 -mb-20" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[#EFEFEF] flex items-center justify-center">
                <User size={24} className="text-notion-gray opacity-40" />
             </div>
             <div>
                <p className="text-[10px] font-black text-notion-blue uppercase tracking-widest leading-none mb-1">PROFIL AKTIF</p>
                <h1 className="text-xl font-serif font-black text-notion-text tracking-tight">{stats.profileName}</h1>
             </div>
          </div>
          <button className="relative p-2 bg-white border border-[#EFEFEF] rounded-xl shadow-sm active:scale-90 transition-transform">
             <MessageSquare size={20} className="text-notion-gray" />
             {stats.unreadMessages > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-notion-red rounded-full border-2 border-white" />
             )}
          </button>
        </div>

        {/* Dynamic Promo/Action Card */}
        <div className="relative group overflow-hidden bg-notion-text rounded-[2.5rem] p-8 shadow-2xl shadow-stone-200">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap size={150} />
           </div>
           <div className="relative z-10 space-y-4">
              <Badge className="bg-white/10 text-white/80 border-transparent backdrop-blur-md px-3 py-1 font-bold text-[10px] tracking-widest uppercase">Target SKP 2026</Badge>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">Terus Tingkatkan Kompetensi Anda.</h2>
              <div className="flex items-center gap-2">
                 <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-notion-blue w-[45%] rounded-full shadow-[0_0_10px_rgba(0,123,255,0.5)]" />
                 </div>
                 <span className="text-[10px] font-black text-white/50 tracking-tighter">45%</span>
              </div>
              <Button className="mt-4 bg-white text-notion-text hover:bg-stone-100 rounded-2xl h-12 px-6 font-bold shadow-none">
                 Lanjutkan Belajar <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
           </div>
        </div>
      </section>

      {/* 2. Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<PenSquare size={24} className="text-notion-blue" />}
          label="Total Kegiatan"
          value={stats.totalActivities}
          subLabel="Bulan ini"
          bgColor="bg-blue-50/50"
          borderColor="border-blue-100/50"
        />
        <StatCard 
          icon={<CreditCard size={24} className="text-notion-orange" />}
          label="Tagihan Iuran"
          value={stats.unpaidInvoices.length}
          subLabel="Awaiting Payment"
          bgColor="bg-orange-50/50"
          borderColor="border-orange-100/50"
        />
      </section>

      {/* 3. Main Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-serif font-bold text-notion-text">Layanan Utama</h3>
           <div className="w-8 h-[1px] bg-stone-200" />
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-8">
           <ServiceIcon 
              icon={<PenSquare size={24} />} 
              label="Logbook" 
              href="/logbook" 
              color="bg-blue-500"
           />
           <ServiceIcon 
              icon={<BookOpen size={24} />} 
              label="LMS" 
              href="/lms" 
              color="bg-purple-500"
           />
           <ServiceIcon 
              icon={<ShieldCheck size={24} />} 
              label="Borang" 
              href="/profile" 
              color="bg-emerald-500"
           />
           <ServiceIcon 
              icon={<LayoutDashboard size={24} />} 
              label="Lainnya" 
              href="/dashboard" 
              color="bg-stone-500"
           />
        </div>
      </section>

      {/* 4. Recent Activity / Invoices */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-notion-text">Tagihan Terbaru</h3>
            <Link href="/payment" className="text-[10px] font-black uppercase text-notion-blue hover:underline">Semua</Link>
        </div>
        
        <div className="space-y-4">
          {stats.unpaidInvoices.length > 0 ? (
            stats.unpaidInvoices.map((invoice) => (
              <div key={invoice.id} className="group relative bg-white border border-[#EFEFEF] p-5 rounded-[2rem] flex items-center gap-4 hover:shadow-xl hover:shadow-stone-200/50 hover:border-notion-blue transition-all duration-500">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0 border border-[#EFEFEF] group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                   <CreditCard size={24} className="text-notion-gray group-hover:text-notion-blue transition-colors" />
                </div>
                <div className="flex-1">
                   <h4 className="text-sm font-bold text-notion-text">{invoice.jenis_iuran}</h4>
                   <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">{invoice.periode}</p>
                </div>
                <div className="text-right">
                   <div className="text-sm font-black text-notion-text">Rp{invoice.nominal.toLocaleString('id-ID')}</div>
                   <div className="text-[9px] font-bold text-red-500 uppercase tracking-tighter mt-1">Belum Bayar</div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-[#F7F7F5]/50 rounded-[3rem] border border-dashed border-[#DEDEDE] space-y-3">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#EFEFEF]">
                  <ShieldCheck className="text-green-500 w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-bold text-notion-text">Administrasi Aman</p>
                  <p className="text-[10px] text-notion-gray uppercase font-bold tracking-widest mt-1">Tidak ada tagihan tertunda saat ini</p>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Footer CTA */}
      <section className="pt-8">
         <div className="p-8 bg-notion-blue/5 border border-notion-blue/10 rounded-[2.5rem] text-center space-y-4">
            <h4 className="text-sm font-serif font-bold text-notion-text">Butuh bantuan teknis?</h4>
            <p className="text-xs text-notion-gray leading-relaxed">Tim support kami siap membantu kendala aplikasi dan akun Anda.</p>
            <Button variant="outline" className="rounded-2xl border-[#EFEFEF] shadow-none h-11 px-8 font-bold text-xs uppercase tracking-widest">
               Hubungi CS
            </Button>
         </div>
      </section>

    </div>
  )
}

function StatCard({ icon, label, value, subLabel, bgColor, borderColor }: any) {
  return (
    <div className={cn("p-6 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-md", bgColor, borderColor)}>
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-white/50">
          {icon}
       </div>
       <p className="text-[10px] uppercase font-black text-stone-500 tracking-[0.1em] mb-1">{label}</p>
       <div className="flex items-baseline gap-2">
          <p className="text-3xl font-serif font-black text-notion-text">{value}</p>
          <span className="text-[10px] font-bold text-stone-400 capitalize">{subLabel}</span>
       </div>
    </div>
  )
}

function ServiceIcon({ icon, label, href, color }: any) {
  return (
    <Link href={href} className="flex flex-col items-center gap-3 active:scale-90 transition-transform group">
      <div className={cn(
        "w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-sm border border-stone-100 transition-all duration-300",
        "bg-white group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-transparent"
      )}>
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-inner", color)}>
          {icon}
        </div>
      </div>
      <span className="text-[10px] font-black text-notion-text text-center uppercase tracking-widest group-hover:text-notion-blue transition-colors">{label}</span>
    </Link>
  )
}