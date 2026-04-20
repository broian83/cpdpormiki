// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'

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
        }, { onConflicts: 'user_id' })

      if (!error) setIsEditing(false)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profil PMIK</h2>
        <p className="text-slate-600">Kelola profil Anda</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar name={profile?.nama_pmik} src={profile?.foto_url || undefined} size="lg" />
          <div>
            <CardTitle>{profile?.nama_pmik || 'Nama PMIK'}</CardTitle>
            <CardDescription>{profile?.nomor_anggota || 'Nomor Anggota'}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">NIK</p><p className="font-medium">{profile?.nik || '-'}</p></div>
                <div><p className="text-sm text-slate-500">Unit Kerja</p><p className="font-medium">{profile?.unit_kerja || '-'}</p></div>
                <div><p className="text-sm text-slate-500">Jabatan</p><p className="font-medium">{profile?.jabatan || '-'}</p></div>
                <div><p className="text-sm text-slate-500">Kota Cetak</p><p className="font-medium">{profile?.kota_cetak_default || 'Jakarta'}</p></div>
              </div>
              <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Nama PMIK" value={profile?.nama_pmik || ''} onChange={(e) => setProfile(p => p ? { ...p, nama_pmik: e.target.value } : null)} />
              <Input label="Nomor Anggota" value={profile?.nomor_anggota || ''} onChange={(e) => setProfile(p => p ? { ...p, nomor_anggota: e.target.value } : null)} />
              <Input label="NIK" value={profile?.nik || ''} onChange={(e) => setProfile(p => p ? { ...p, nik: e.target.value } : null)} />
              <Input label="Unit Kerja" value={profile?.unit_kerja || ''} onChange={(e) => setProfile(p => p ? { ...p, unit_kerja: e.target.value } : null)} />
              <Input label="Jabatan" value={profile?.jabatan || ''} onChange={(e) => setProfile(p => p ? { ...p, jabatan: e.target.value } : null)} />
              <Input label="Kota Cetak" value={profile?.kota_cetak_default || ''} onChange={(e) => setProfile(p => p ? { ...p, kota_cetak_default: e.target.value } : null)} />
              <div className="flex gap-2">
                <Button onClick={handleSave} isLoading={isSaving}>Simpan</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}