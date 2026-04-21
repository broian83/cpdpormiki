// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, BookOpen, CreditCard, MessageSquare, ArrowUpRight, TrendingUp } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalRevenue: 0,
    activeCourses: 0,
    unreadMessages: 0,
  })
  const [recentMembers, setRecentMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 1. Total Members
      const { count: memberCount } = await supabase
        .from('pmik_profiles')
        .select('*', { count: 'exact', head: true })

      // 2. Total Revenue (Paid Invoices)
      const { data: paidData } = await supabase
        .from('payment_invoices')
        .select('nominal')
        .eq('status', 'paid')
      
      const revenue = paidData?.reduce((sum, inv) => sum + (inv.nominal || 0), 0) || 0

      // 3. Active Courses
      const { count: courseCount } = await supabase
        .from('lms_courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // 4. Unread Messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      // 5. Recent Members
      const { data: recent } = await supabase
        .from('pmik_profiles')
        .select('nama_pmik, nira, foto_url, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalMembers: memberCount || 0,
        totalRevenue: revenue,
        activeCourses: courseCount || 0,
        unreadMessages: msgCount || 0,
      })
      setRecentMembers(recent || [])
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      {/* Header section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Admin Overview</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Statistik riil dan aktivitas terbaru dari platform PMIK Anda.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="text-xs font-semibold uppercase tracking-widest text-notion-gray hover:text-notion-text transition-colors flex items-center gap-2 mb-2"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-notion-orange animate-pulse' : 'bg-notion-green'}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<Users className="w-5 h-5" />}
            label="Total Member"
            value={stats.totalMembers.toLocaleString()}
            color="bg-notion-blue_bg text-notion-blue"
            isLoading={isLoading}
          />
          <StatCard 
            icon={<CreditCard className="w-5 h-5" />}
            label="Total Pendapatan"
            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
            color="bg-notion-green_bg text-notion-green"
            isLoading={isLoading}
          />
          <StatCard 
            icon={<BookOpen className="w-5 h-5" />}
            label="Kursus Aktif"
            value={stats.activeCourses.toString()}
            color="bg-notion-orange_bg text-notion-orange"
            isLoading={isLoading}
          />
          <StatCard 
            icon={<MessageSquare className="w-5 h-5" />}
            label="Pesan Baru"
            value={stats.unreadMessages.toString()}
            color="bg-stone-100 text-notion-gray"
            isLoading={isLoading}
          />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex justify-between items-center">
             <h3 className="font-semibold text-[13px] uppercase tracking-wider text-notion-gray">Member Terdaftar Terbaru</h3>
             <ArrowUpRight className="w-4 h-4 text-notion-gray" />
          </div>
          <div className="divide-y divide-[#EFEFEF]">
             {isLoading ? (
               <div className="p-12 flex justify-center text-notion-gray text-sm italic">Memuat data...</div>
             ) : recentMembers.length > 0 ? (
               recentMembers.map((member, i) => (
                 <div key={i} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.nama_pmik} src={member.foto_url} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-notion-text">{member.nama_pmik}</p>
                        <p className="text-xs text-notion-gray">NIRA: {member.nira || '-'}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-notion-gray">{formatDate(member.created_at)}</span>
                 </div>
               ))
             ) : (
               <div className="p-12 text-center text-notion-gray text-sm">Belum ada member terdaftar.</div>
             )}
          </div>
        </div>
        
        <div className="border border-[#EFEFEF] bg-white rounded-md p-6 shadow-sm">
           <div className="flex items-center gap-2 text-notion-text mb-6">
             <TrendingUp className="w-5 h-5 text-notion-green" />
             <h3 className="font-serif font-semibold text-lg">Ringkasan Sistem</h3>
           </div>
           <p className="text-sm text-notion-gray leading-relaxed mb-6">
             Platform sedang berjalan optimal. Gunakan menu navigasi di samping untuk mengelola materi pelatihan (LMS) atau memantau status iuran anggota.
           </p>
           <div className="space-y-4">
             <div className="p-4 rounded bg-stone-50 border border-[#EFEFEF]">
               <p className="text-xs text-notion-gray uppercase tracking-widest font-bold mb-1">Status Webhook</p>
               <div className="flex items-center gap-2 text-notion-green text-sm font-semibold">
                 <div className="w-2 h-2 rounded-full bg-notion-green animate-pulse" />
                 Mayar API Connected
               </div>
             </div>
             <div className="p-4 rounded bg-stone-50 border border-[#EFEFEF]">
               <p className="text-xs text-notion-gray uppercase tracking-widest font-bold mb-1">Penyimpanan</p>
               <div className="text-sm font-semibold text-notion-text">Supabase Cloud (PostgreSQL)</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, isLoading }) {
  return (
    <div className={`border border-[#EFEFEF] p-5 rounded-md bg-white hover:border-notion-gray/30 transition-all group shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded ${color} transition-transform group-hover:scale-110`}>
           {icon}
        </div>
        <h3 className="font-semibold text-[13px] uppercase tracking-wider text-notion-gray">{label}</h3>
      </div>
      {isLoading ? (
        <div className="h-9 w-24 bg-stone-100 animate-pulse rounded-md" />
      ) : (
        <p className="text-3xl font-serif font-semibold text-notion-text leading-none">{value}</p>
      )}
    </div>
  )
}
