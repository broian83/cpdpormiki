// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CvPage() {
  const supabase = createClient()
  const [cv, setCv] = useState<any>({ ringkasan: '', pendidikan: '', pengalaman_kerja: '', sertifikasi: '', organisasi: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { fetchCv() }, [])

  const fetchCv = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('cvs').select('*').eq('user_id', session.user.id).single()
    if (data) setCv(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      
      const updateData = { 
        ringkasan: cv.ringkasan, 
        pendidikan: cv.pendidikan, 
        pengalaman_kerja: cv.pengalaman_kerja, 
        sertifikasi: cv.sertifikasi, 
        organisasi: cv.organisasi, 
        updated_at: new Date().toISOString() 
      }
      
      await (supabase.from('cvs') as any).update(updateData).eq('user_id', session.user.id)
    } catch (error) { console.error('Error:', error) }
    finally { setIsSaving(false) }
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Curriculum Vitae</h2>
        <p className="text-slate-600">Kelola data CV Anda</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
        <CardContent><Textarea value={cv.ringkasan || ''} onChange={(e) => setCv({...cv, ringkasan: e.target.value })} placeholder="Tulis ringkasan singkat..." /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pendidikan</CardTitle></CardHeader>
        <CardContent><Textarea value={cv.pendidikan || ''} onChange={(e) => setCv({...cv, pendidikan: e.target.value })} placeholder="Riwayat pendidikan..." /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pengalaman Kerja</CardTitle></CardHeader>
        <CardContent><Textarea value={cv.pengalaman_kerja || ''} onChange={(e) => setCv({...cv, pengalaman_kerja: e.target.value })} placeholder="Riwayat pekerjaan..." /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sertifikasi</CardTitle></CardHeader>
        <CardContent><Textarea value={cv.sertifikasi || ''} onChange={(e) => setCv({...cv, sertifikasi: e.target.value })} placeholder="Sertifikasi yang dimiliki..." /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Organisasi</CardTitle></CardHeader>
        <CardContent><Textarea value={cv.organisasi || ''} onChange={(e) => setCv({...cv, organisasi: e.target.value })} placeholder="Keanggotaan organisasi..." /></CardContent>
      </Card>

      <Button onClick={handleSave} isLoading={isSaving} className="w-full md:w-auto">Simpan CV</Button>
    </div>
  )
}