// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, GraduationCap, Briefcase, Award, Users, Save, CheckCircle2, FileDown } from 'lucide-react'

export default function CvPage() {
  const supabase = createClient()
  const [cv, setCv] = useState<any>({ ringkasan: '', pendidikan: '', pengalaman_kerja: '', sertifikasi: '', organisasi: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle')

  useEffect(() => { fetchCv() }, [])

  const fetchCv = async () => {
    setIsLoading(true)
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
      
      const { error } = await supabase.from('cvs').update(updateData).eq('user_id', session.user.id)
      if (!error) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            CV Generator
          </h2>
          <p className="text-slate-500 mt-1">Lengkapi data profesional Anda untuk pembuatan CV otomatis.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-slate-200 rounded-xl">
             <FileDown className="w-4 h-4 mr-2" />
             Preview PDF
           </Button>
           <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-8 font-bold">
            {isSaving ? 'Menyimpan...' : (saveStatus === 'success' ? 'Tersimpan!' : 'Simpan Perubahan')}
            {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4 ml-2" />}
            {!isSaving && saveStatus === 'idle' && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Ringkasan */}
          <SectionCard 
            icon={<FileText className="w-5 h-5" />} 
            title="Ringkasan Profesional" 
            description="Perkenalkan diri Anda secara singkat dan padat."
          >
            <Textarea 
              value={cv.ringkasan || ''} 
              onChange={(e) => setCv({...cv, ringkasan: e.target.value })} 
              placeholder="Contoh: Profesional Rekam Medis dengan pengalaman 5 tahun di RSUD..." 
              className="min-h-[150px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none py-4"
            />
          </SectionCard>

          {/* Pendidikan */}
          <SectionCard 
            icon={<GraduationCap className="w-5 h-5" />} 
            title="Riwayat Pendidikan" 
            description="Sebutkan pendidikan formal terakhir Anda."
          >
            <Textarea 
              value={cv.pendidikan || ''} 
              onChange={(e) => setCv({...cv, pendidikan: e.target.value })} 
              placeholder="Contoh: D3 Rekam Medis & Informasi Kesehatan - Poltekkes Jakarta (2015-2018)" 
              className="min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none py-4"
            />
          </SectionCard>

          {/* Pengalaman Kerja */}
          <SectionCard 
            icon={<Briefcase className="w-5 h-5" />} 
            title="Pengalaman Kerja" 
            description="Daftar riwayat pekerjaan Anda dari yang terbaru."
          >
            <Textarea 
              value={cv.pengalaman_kerja || ''} 
              onChange={(e) => setCv({...cv, pengalaman_kerja: e.target.value })} 
              placeholder="Contoh: Koordinator Rekam Medis - RS Harapan Bangsa (2019-Sekarang)" 
              className="min-h-[150px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none py-4"
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Sertifikasi */}
          <SectionCard 
            icon={<Award className="w-5 h-5" />} 
            title="Sertifikasi & Pelatihan"
          >
            <Textarea 
              value={cv.sertifikasi || ''} 
              onChange={(e) => setCv({...cv, sertifikasi: e.target.value })} 
              placeholder="Sertifikasi STR, Pelatihan ICD-10, dll." 
              className="min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none py-4"
            />
          </SectionCard>

          {/* Organisasi */}
          <SectionCard 
            icon={<Users className="w-5 h-5" />} 
            title="Pengalaman Organisasi"
          >
            <Textarea 
              value={cv.organisasi || ''} 
              onChange={(e) => setCv({...cv, organisasi: e.target.value })} 
              placeholder="Keanggotaan PORMIKI atau organisasi lainnya." 
              className="min-h-[120px] border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none py-4"
            />
          </SectionCard>

          {/* Tips Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8">
            <h4 className="text-indigo-900 font-bold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              Tips Profesional
            </h4>
            <p className="text-sm text-indigo-700 leading-relaxed italic">
              "Gunakan bahasa formal dan pastikan detail kontak serta nomor anggota Anda sudah benar di halaman profil untuk hasil CV yang maksimal."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ icon, title, description, children }: { icon: React.ReactNode, title: string, description?: string, children: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-3xl overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
        </div>
        {children}
      </div>
    </Card>
  )
}