// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, BadgeCheck, Building2, Briefcase, MapPin, Fingerprint, Camera, Save, X } from 'lucide-react'

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
      .single()

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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Banner/Header */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-teal-500 to-indigo-600 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      {/* Profile Card */}
      <Card className="border-none shadow-2xl bg-white -mt-24 mx-4 md:mx-8 relative z-10 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
              <div className="relative group">
                <div className="p-1 bg-white rounded-full shadow-xl">
                  <Avatar 
                    name={profile?.nama_pmik} 
                    src={profile?.foto_url || undefined} 
                    className="h-32 w-32 border-4 border-slate-50"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-white text-slate-600 rounded-full shadow-lg hover:text-primary transition-colors border border-slate-100">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {profile?.nama_pmik || 'Nama Lengkap PMIK'}
                  </h2>
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Anggota Terverifikasi
                  </Badge>
                </div>
                <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  {profile?.nomor_anggota || 'Belum ada nomor anggota'}
                </p>
              </div>

              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl border-slate-200">
                  Edit Profil
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Profile Details */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Informasi Pekerjaan</h4>
                <div className="space-y-4">
                  <DetailItem icon={<Building2 className="w-4 h-4" />} label="Unit Kerja" value={profile?.unit_kerja || 'Belum diisi'} />
                  <DetailItem icon={<Briefcase className="w-4 h-4" />} label="Jabatan" value={profile?.jabatan || 'Belum diisi'} />
                  <DetailItem icon={<MapPin className="w-4 h-4" />} label="Kota Cetak" value={profile?.kota_cetak_default || 'Jakarta'} />
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Identitas Personal</h4>
                <div className="space-y-4">
                  <DetailItem icon={<Fingerprint className="w-4 h-4" />} label="NIK" value={profile?.nik || 'Belum diisi'} />
                  <DetailItem icon={<User className="w-4 h-4" />} label="Email" value={supabase.auth.getSession()?.data?.session?.user?.email || '-'} />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-12 p-8 bg-slate-50 rounded-3xl space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-slate-900">Ubah Profil</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input label="Nama Lengkap" value={profile?.nama_pmik || ''} onChange={(e) => setProfile(p => p ? { ...p, nama_pmik: e.target.value } : null)} />
                    <Input label="Nomor Anggota" value={profile?.nomor_anggota || ''} onChange={(e) => setProfile(p => p ? { ...p, nomor_anggota: e.target.value } : null)} />
                    <Input label="NIK" value={profile?.nik || ''} onChange={(e) => setProfile(p => p ? { ...p, nik: e.target.value } : null)} />
                  </div>
                  <div className="space-y-4">
                    <Input label="Unit Kerja" value={profile?.unit_kerja || ''} onChange={(e) => setProfile(p => p ? { ...p, unit_kerja: e.target.value } : null)} />
                    <Input label="Jabatan" value={profile?.jabatan || ''} onChange={(e) => setProfile(p => p ? { ...p, jabatan: e.target.value } : null)} />
                    <Input label="Kota Cetak Default" value={profile?.kota_cetak_default || ''} onChange={(e) => setProfile(p => p ? { ...p, kota_cetak_default: e.target.value } : null)} />
                  </div>
                </div>
                <div className="flex gap-3 pt-4 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl px-8">
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                  <Button onClick={handleSave} isLoading={isSaving} className="rounded-xl px-8 bg-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 p-2 bg-slate-50 text-slate-400 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-slate-900 font-semibold">{value}</p>
      </div>
    </div>
  )
}