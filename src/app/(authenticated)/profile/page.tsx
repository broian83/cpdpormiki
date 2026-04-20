// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, BadgeCheck, Building2, Briefcase, MapPin, Fingerprint, Save, X } from 'lucide-react'

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

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

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

      if (!error) setIsEditing(false)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 pb-16">
      {/* Cover Page */}
      <div className="h-44 bg-[#F1F1EF] w-full rounded-t-md relative">
        {/* Cover functionality can be expanded later */}
      </div>

      <div className="px-4 md:px-12 max-w-5xl mx-auto -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
          <div className="p-1 bg-white rounded-md">
            <Avatar 
                name={profile?.nama_pmik} 
                src={profile?.foto_url || undefined} 
                className="h-[100px] w-[100px] border-2 border-white rounded-md"
            />
          </div>
          
          <div className="flex-1 pb-1">
             <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-serif font-bold text-notion-text tracking-tight">
                  {profile?.nama_pmik || 'Nama Lengkap PMIK'}
                </h1>
                <Badge className="bg-notion-green_bg text-notion-green border-none flex items-center md:gap-1 text-[11px] h-6 font-medium rounded-sm">
                  <BadgeCheck className="w-3 h-3" />
                  <span className="hidden md:inline">Terverifikasi</span>
                </Badge>
             </div>
             <p className="text-notion-gray font-medium text-sm">
               {profile?.nomor_anggota || 'Belum ada nomor anggota'}
             </p>
          </div>

          <div className="pb-1 mt-4 md:mt-0">
             {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-[#EFEFEF] shadow-none rounded-md hover:bg-stone-50 h-8 px-4 text-sm font-medium">
                  Edit Profil
                </Button>
             )}
          </div>
        </div>

        {/* Content Section - Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-6">
             <h2 className="text-xl font-serif font-semibold text-notion-text border-b border-[#EFEFEF] pb-2">Informasi Pekerjaan</h2>
             <div className="space-y-4">
                <DetailItem icon={<Building2 className="w-4 h-4" />} label="Unit Kerja" value={profile?.unit_kerja || 'Belum diisi'} />
                <DetailItem icon={<Briefcase className="w-4 h-4" />} label="Jabatan" value={profile?.jabatan || 'Belum diisi'} />
                <DetailItem icon={<MapPin className="w-4 h-4" />} label="Kota Cetak Default" value={profile?.kota_cetak_default || 'Jakarta'} />
             </div>
          </div>
          <div className="space-y-6">
             <h2 className="text-xl font-serif font-semibold text-notion-text border-b border-[#EFEFEF] pb-2">Identitas Personal</h2>
             <div className="space-y-4">
                <DetailItem icon={<Fingerprint className="w-4 h-4" />} label="NIK" value={profile?.nik || 'Belum diisi'} />
                <DetailItem icon={<User className="w-4 h-4" />} label="Email" value={supabase.auth.getSession()?.data?.session?.user?.email || '-'} />
             </div>
          </div>
        </div>

        {/* Edit Form Section */}
        {isEditing && (
          <div className="mt-12">
            <h2 className="text-xl font-serif font-semibold text-notion-text border-b border-[#EFEFEF] pb-2 mb-6">Ubah Profil</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">Nama Lengkap</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.nama_pmik || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, nama_pmik: e.target.value } : null)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">Nomor Anggota</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.nomor_anggota || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, nomor_anggota: e.target.value } : null)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">NIK</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.nik || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, nik: e.target.value } : null)} 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">Unit Kerja</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.unit_kerja || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, unit_kerja: e.target.value } : null)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">Jabatan</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.jabatan || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, jabatan: e.target.value } : null)} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-notion-gray">Kota Cetak Default</label>
                  <Input 
                    className="h-9 font-medium text-notion-text border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-blue"
                    value={profile?.kota_cetak_default || ''} 
                    onChange={(e) => setProfile(p => p ? { ...p, kota_cetak_default: e.target.value } : null)} 
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-8 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-sm border-[#EFEFEF] h-9 px-4 font-medium hover:bg-stone-50">
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving} className="rounded-sm bg-notion-blue text-white hover:bg-notion-blue/90 h-9 px-4 font-medium shadow-none">
                Save Adjustments
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 text-notion-gray">
        {icon}
      </div>
      <div>
        <p className="text-sm text-notion-gray mb-0.5">{label}</p>
        <p className="text-[15px] text-notion-text font-medium">{value}</p>
      </div>
    </div>
  )
}