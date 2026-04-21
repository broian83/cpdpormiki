// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  BadgeCheck, 
  Building2, 
  Briefcase, 
  MapPin, 
  Fingerprint, 
  Save, 
  X, 
  Edit3, 
  Mail, 
  ShieldCheck, 
  Calendar,
  Camera,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

interface Profile {
  nama_pmik: string
  nomor_anggota: string | null
  nik: string | null
  unit_kerja: string | null
  jabatan: string | null
  kota_cetak_default: string
  foto_url: string | null
}

export default function ProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    
    setUserEmail(session.user.email)

    const { data } = await supabase
      .from('pmik_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (data) setProfile(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !profile) return

      const { error } = await supabase
        .from('pmik_profiles')
        .upsert({
          user_id: session.user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      
      toast.success('Profil berhasil diperbarui')
      setIsEditing(false)
    } catch (error) {
      toast.error('Gagal memperbarui profil')
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-stone-100 border-t-notion-blue rounded-full animate-spin" />
        <p className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memuat Profil...</p>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32">
      {/* Header Mobile Style */}
      <div className="flex items-center justify-between mb-8">
         <Link href="/dashboard" className="p-2.5 bg-white border border-[#EFEFEF] rounded-xl text-notion-gray hover:text-notion-text active:scale-95 transition-all">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="text-sm font-black uppercase tracking-[0.2em] text-notion-text">Profil Saya</h1>
         <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Hero Profile Section */}
      <section className="relative mb-12">
        {/* Background Card */}
        <div className="bg-notion-text rounded-[2.5rem] p-8 pb-20 relative overflow-hidden shadow-2xl shadow-stone-200">
           <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
              <User size={200} />
           </div>
           
           <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="p-1 bg-white/20 backdrop-blur-md rounded-[2.5rem] shadow-xl">
                  <Avatar 
                      name={profile?.nama_pmik} 
                      src={profile?.foto_url || undefined} 
                      className="h-28 w-28 rounded-[2rem] border-4 border-white/10"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2.5 bg-notion-blue text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-95 transition-all">
                   <Camera size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                 <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-serif font-black text-white tracking-tight">
                      {profile?.nama_pmik || 'Nama PMIK'}
                    </h2>
                    <ShieldCheck className="w-6 h-6 text-notion-blue" />
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <p className="text-white/50 text-[11px] font-black uppercase tracking-widest">No. Anggota</p>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white font-mono text-xs px-4 py-1 rounded-full">
                       {profile?.nomor_anggota || 'PRO-PENDING'}
                    </Badge>
                 </div>
              </div>
           </div>
        </div>

        {/* Floating Quick Action */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-sm">
           <div className="bg-white border border-[#EFEFEF] p-4 rounded-3xl shadow-xl shadow-stone-200/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <BadgeCheck size={20} />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-notion-gray uppercase tracking-tighter leading-none mb-1">Status Keanggotaan</p>
                    <p className="text-xs font-bold text-notion-text">Aktif s/d 2026</p>
                 </div>
              </div>
              <div className="w-[1px] h-8 bg-stone-100" />
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                  isEditing ? "bg-stone-100 text-notion-gray" : "bg-notion-blue/10 text-notion-blue hover:bg-notion-blue/20"
                )}
              >
                 {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                 {isEditing ? 'Batal' : 'Edit'}
              </button>
           </div>
        </div>
      </section>

      {/* Profile Details Content */}
      <div className="mt-16 space-y-6">
        
        {!isEditing ? (
          <>
            {/* Work Info Group */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-4">Informasi Pekerjaan</h3>
               <div className="bg-white border border-[#EFEFEF] rounded-[2rem] overflow-hidden shadow-sm">
                  <ProfileInfoItem icon={<Building2 />} label="Unit Kerja" value={profile?.unit_kerja} />
                  <ProfileInfoItem icon={<Briefcase />} label="Jabatan" value={profile?.jabatan} />
                  <ProfileInfoItem icon={<MapPin />} label="Domisili Cetak" value={profile?.kota_cetak_default} last />
               </div>
            </div>

            {/* Account Info Group */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-4">Detail Akun & ID</h3>
               <div className="bg-white border border-[#EFEFEF] rounded-[2rem] overflow-hidden shadow-sm">
                  <ProfileInfoItem icon={<Fingerprint />} label="Nomor Induk Kependudukan (NIK)" value={profile?.nik} />
                  <ProfileInfoItem icon={<Mail />} label="Alamat Email Terdaftar" value={userEmail} last />
               </div>
            </div>
          </>
        ) : (
          /* Edit Form */
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8 pb-20">
             <div className="bg-white border border-[#EFEFEF] p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 space-y-6">
                <h3 className="text-lg font-serif font-black text-notion-text mb-2">Perbarui Informasi</h3>
                
                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">Nama Lengkap Sesuai Ijazah</label>
                      <Input 
                        value={profile?.nama_pmik || ''} 
                        onChange={(e) => setProfile(p => p ? { ...p, nama_pmik: e.target.value } : null)}
                        className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">NIK</label>
                         <Input 
                           value={profile?.nik || ''} 
                           onChange={(e) => setProfile(p => p ? { ...p, nik: e.target.value } : null)}
                           className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">No. Anggota</label>
                         <Input 
                           value={profile?.nomor_anggota || ''} 
                           onChange={(e) => setProfile(p => p ? { ...p, nomor_anggota: e.target.value } : null)}
                           className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">Unit Kerja / Institusi</label>
                      <Input 
                        value={profile?.unit_kerja || ''} 
                        onChange={(e) => setProfile(p => p ? { ...p, unit_kerja: e.target.value } : null)}
                        className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">Jabatan Saat Ini</label>
                      <Input 
                        value={profile?.jabatan || ''} 
                        onChange={(e) => setProfile(p => p ? { ...p, jabatan: e.target.value } : null)}
                        className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">Kota Cetak Sertifikat</label>
                      <Input 
                        value={profile?.kota_cetak_default || ''} 
                        onChange={(e) => setProfile(p => p ? { ...p, kota_cetak_default: e.target.value } : null)}
                        className="h-14 bg-stone-50 border-transparent rounded-2xl px-6 font-bold text-notion-text focus:bg-white focus:border-notion-blue transition-all"
                      />
                   </div>
                </div>

                <div className="pt-6 border-t border-stone-50 flex gap-4">
                   <Button 
                     variant="ghost" 
                     className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-notion-gray"
                     onClick={() => setIsEditing(false)}
                   >
                      Batalkan
                   </Button>
                   <Button 
                     className="flex-1 h-14 bg-notion-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
                     onClick={handleSave}
                     isLoading={isSaving}
                   >
                      Simpan Perubahan
                   </Button>
                </div>
             </div>
          </div>
        )}

        {/* System Settings Link Card */}
        <section className="pt-4">
           <Link href="/settings" className="flex items-center justify-between p-6 bg-stone-50/50 border border-stone-100 rounded-[2rem] group hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-notion-gray group-hover:text-notion-blue transition-colors">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-notion-text">Keamanan & Layanan</h4>
                    <p className="text-[10px] text-notion-gray font-bold uppercase tracking-tighter opacity-60">Ganti Password, Verifikasi 2FA</p>
                 </div>
              </div>
              <ChevronRight size={20} className="text-stone-300 group-hover:text-notion-blue transition-all group-hover:translate-x-1" />
           </Link>
        </section>

      </div>
    </div>
  )
}

function ProfileInfoItem({ icon, label, value, last }: { icon: React.ReactNode, label: string, value: string | null, last?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-5 p-6 group hover:bg-stone-50/50 transition-colors",
      !last && "border-b border-[#EFEFEF]"
    )}>
      <div className="w-12 h-12 bg-[#F7F7F5] rounded-2xl flex items-center justify-center text-notion-gray group-hover:text-notion-blue transition-colors shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-notion-gray uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-[15px] text-notion-text font-bold truncate leading-tight">
          {value || <span className="text-stone-300 font-medium italic">Belum diisi</span>}
        </p>
      </div>
      <ChevronRight size={14} className="text-stone-200 group-hover:text-notion-blue opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </div>
  )
}