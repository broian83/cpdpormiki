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
  ArrowLeft,
  Info,
  Clock,
  ShieldText
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
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-200"></div>
        <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Sinkronisasi Data...</span>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 pb-24 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2 pt-4">
        <h1 className="text-3xl font-serif font-bold text-notion-text">Profil PMIK</h1>
        <p className="text-sm text-notion-gray font-medium">Manajemen identitas dan informasi profesi Anda.</p>
      </div>

      {/* Main Profile Info Card - Boxy Style */}
      <section className="border border-[#EFEFEF] bg-white rounded-md p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
         <div className="relative shrink-0">
            <Avatar 
                name={profile?.nama_pmik} 
                src={profile?.foto_url || undefined} 
                className="h-32 w-32 rounded-md border border-[#EFEFEF] object-cover"
            />
            <button className="absolute -bottom-2 -right-2 p-2.5 bg-notion-text text-white rounded-md shadow-sm border border-stone-800 hover:bg-stone-800 transition-all">
               <Camera size={16} />
            </button>
         </div>

         <div className="flex-1 flex flex-col md:items-start items-center text-center md:text-left">
            <div className="flex flex-col gap-1 mb-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-notion-gray">Nama Lengkap</span>
               <h2 className="text-2xl font-serif font-bold text-notion-text line-clamp-2">
                  {profile?.nama_pmik || 'Lengkapi Nama Anda'}
               </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="flex flex-col p-3 bg-stone-50/50 border border-[#EFEFEF] rounded-md">
                  <span className="text-[9px] font-black uppercase tracking-tighter text-notion-gray mb-1">ID Anggota</span>
                  <span className="text-xs font-bold text-notion-text font-mono truncate">{profile?.nomor_anggota || 'PRO-PENDING'}</span>
               </div>
               <div className="flex flex-col p-3 bg-emerald-50/50 border border-emerald-100 rounded-md">
                  <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-800 mb-1">Status Akun</span>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span className="text-xs font-bold text-emerald-700">Aktif</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 flex gap-3">
               <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "secondary" : "default"}
                  className="px-6 font-bold text-[10px] uppercase tracking-widest"
               >
                  {isEditing ? <X className="mr-2 w-3 h-3" /> : <Edit3 className="mr-2 w-3 h-3" />}
                  {isEditing ? 'Batal' : 'Edit Profil'}
               </Button>
            </div>
         </div>
      </section>

      {/* Details Area */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 transition-all duration-500">
        
        {!isEditing ? (
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Informasi Detail</h3>
             <div className="grid grid-cols-1 gap-3">
                <InfoItem icon={<Building2 />} label="Unit Kerja / Instansi" value={profile?.unit_kerja} color="bg-notion-blue" />
                <InfoItem icon={<Briefcase />} label="Posisi / Jabatan" value={profile?.jabatan} color="bg-emerald-500" />
                <InfoItem icon={<Fingerprint />} label="Identitas KTP (NIK)" value={profile?.nik} color="bg-amber-500" />
                <InfoItem icon={<MapPin />} label="Wilayah Domisili" value={profile?.kota_cetak_default} color="bg-rose-500" />
                <InfoItem icon={<Mail />} label="Email Terdaftar" value={userEmail} color="bg-stone-700" />
             </div>
          </section>
        ) : (
          <section className="animate-in fade-in zoom-in-95 duration-500 space-y-4">
             <div className="border border-[#EFEFEF] bg-white rounded-md p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="col-span-2">
                      <EditInput label="Nama Lengkap Sesuai Ijazah" value={profile?.nama_pmik} onChange={(v) => setProfile(p => ({...p, nama_pmik: v}))} />
                   </div>
                   <EditInput label="Format Nomor Anggota" value={profile?.nomor_anggota} onChange={(v) => setProfile(p => ({...p, nomor_anggota: v}))} />
                   <EditInput label="Nomor Induk Kependudukan" value={profile?.nik} onChange={(v) => setProfile(p => ({...p, nik: v}))} />
                   <EditInput label="Unit Kerja" value={profile?.unit_kerja} onChange={(v) => setProfile(p => ({...p, unit_kerja: v}))} />
                   <EditInput label="Jabatan" value={profile?.jabatan} onChange={(v) => setProfile(p => ({...p, jabatan: v}))} />
                   <div className="col-span-2">
                      <EditInput label="Kota Domisili (Untuk Cetak Sertifikat)" value={profile?.kota_cetak_default} onChange={(v) => setProfile(p => ({...p, kota_cetak_default: v}))} />
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#EFEFEF] flex justify-end">
                   <Button 
                      variant="default"
                      size="lg"
                      className="px-10 font-bold uppercase text-[10px] tracking-widest"
                      onClick={handleSave}
                      isLoading={isSaving}
                   >
                      <Save size={14} className="mr-2" /> Simpan Perubahan
                   </Button>
                </div>
             </div>
          </section>
        )}

        {/* Action List Section - Same as Logbook */}
        {!isEditing && (
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Layanan & Keamanan</h3>
            <div className="grid grid-cols-1 gap-3">
               <Link href="/settings" className="group border border-[#EFEFEF] bg-white rounded-md p-4 hover:border-notion-text/20 hover:shadow-sm transition-all flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-stone-100 flex items-center justify-center text-notion-text group-hover:bg-notion-blue group-hover:text-white transition-colors shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-sm font-bold text-notion-text group-hover:text-notion-blue transition-colors">
                        Sistem & Keamanan
                     </h4>
                     <p className="text-[11px] text-notion-gray font-medium truncate">
                        Ganti password dan pengaturan keamanan akun lainnya.
                     </p>
                  </div>
                  <ChevronRight size={18} className="text-notion-gray/20 group-hover:text-notion-blue group-hover:translate-x-1 transition-all" />
               </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | null, color: string }) {
  return (
    <div className="group border border-[#EFEFEF] bg-white rounded-md p-4 flex items-center gap-4 transition-all">
      <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white shadow-sm shrink-0", color)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-notion-gray uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm text-notion-text font-bold truncate leading-tight">
          {value || <span className="text-stone-300 font-medium italic">Data belum lengkap</span>}
        </p>
      </div>
    </div>
  )
}

function EditInput({ label, value, onChange }: { label: string, value: string | null, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-notion-gray uppercase tracking-[0.1em] px-1">{label}</label>
      <Input 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Masukkan ${label}`}
        className="h-12 bg-white border-[#EFEFEF] rounded-md px-4 font-bold text-notion-text focus:border-notion-text transition-all text-sm shadow-none"
      />
    </div>
  )
}