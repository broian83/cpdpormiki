// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight flex items-center gap-3">
              CV Generator
            </h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Lengkapi data profesional Anda untuk pembuatan resume otomatis yang terstandarisasi.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="border-[#EFEFEF] text-notion-text hover:bg-stone-50 rounded-sm shadow-none h-9">
               <FileDown className="w-4 h-4 mr-2 opacity-70" />
               Preview PDF
             </Button>
             <Button onClick={handleSave} disabled={isSaving} className="bg-notion-blue text-white hover:bg-notion-blue/90 shadow-none rounded-sm px-6 font-medium h-9 transition-colors">
              {isSaving ? 'Menyimpan...' : (saveStatus === 'success' ? 'Tersimpan!' : 'Simpan Mode')}
              {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4 ml-2" />}
              {!isSaving && saveStatus === 'idle' && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-6">
          {/* Ringkasan */}
          <SectionCard 
            icon={<FileText className="w-5 h-5 opacity-70" />} 
            title="Ringkasan Profesional" 
            description="Perkenalkan diri Anda secara singkat dan padat."
          >
            <Textarea 
              value={cv.ringkasan || ''} 
              onChange={(e) => setCv({...cv, ringkasan: e.target.value })} 
              placeholder="Contoh: Profesional Rekam Medis dengan pengalaman 5 tahun di RSUD..." 
              className="min-h-[140px] border-[#EFEFEF] bg-white focus-visible:ring-0 focus-visible:border-notion-gray transition-colors rounded-sm resize-none p-4 text-[15px] shadow-none"
            />
          </SectionCard>

          {/* Pendidikan */}
          <SectionCard 
            icon={<GraduationCap className="w-5 h-5 opacity-70" />} 
            title="Riwayat Pendidikan" 
            description="Sebutkan pendidikan formal terakhir Anda."
          >
            <Textarea 
              value={cv.pendidikan || ''} 
              onChange={(e) => setCv({...cv, pendidikan: e.target.value })} 
              placeholder="Contoh: D3 Rekam Medis & Informasi Kesehatan - Poltekkes Jakarta (2015-2018)" 
              className="min-h-[120px] border-[#EFEFEF] bg-white focus-visible:ring-0 focus-visible:border-notion-gray transition-colors rounded-sm resize-none p-4 text-[15px] shadow-none"
            />
          </SectionCard>

          {/* Pengalaman Kerja */}
          <SectionCard 
            icon={<Briefcase className="w-5 h-5 opacity-70" />} 
            title="Pengalaman Kerja" 
            description="Daftar riwayat pekerjaan Anda dari yang terbaru."
          >
            <Textarea 
              value={cv.pengalaman_kerja || ''} 
              onChange={(e) => setCv({...cv, pengalaman_kerja: e.target.value })} 
              placeholder="Contoh: Koordinator Rekam Medis - RS Harapan Bangsa (2019-Sekarang)" 
              className="min-h-[140px] border-[#EFEFEF] bg-white focus-visible:ring-0 focus-visible:border-notion-gray transition-colors rounded-sm resize-none p-4 text-[15px] shadow-none"
            />
          </SectionCard>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24">
          {/* Sertifikasi */}
          <SectionCard 
            icon={<Award className="w-5 h-5 opacity-70" />} 
            title="Sertifikasi & Pelatihan"
          >
            <Textarea 
              value={cv.sertifikasi || ''} 
              onChange={(e) => setCv({...cv, sertifikasi: e.target.value })} 
              placeholder="STR Aktif, Pelatihan ICD-10/11, Coding BPJS, dll." 
              className="min-h-[120px] border-[#EFEFEF] bg-white focus-visible:ring-0 focus-visible:border-notion-gray transition-colors rounded-sm resize-none p-4 text-[15px] shadow-none"
            />
          </SectionCard>

          {/* Organisasi */}
          <SectionCard 
            icon={<Users className="w-5 h-5 opacity-70" />} 
            title="Pengalaman Organisasi"
          >
            <Textarea 
              value={cv.organisasi || ''} 
              onChange={(e) => setCv({...cv, organisasi: e.target.value })} 
              placeholder="Keanggotaan PORMIKI aktif atau panitia acara nasional." 
              className="min-h-[120px] border-[#EFEFEF] bg-white focus-visible:ring-0 focus-visible:border-notion-gray transition-colors rounded-sm resize-none p-4 text-[15px] shadow-none"
            />
          </SectionCard>

          {/* Tips Card */}
          <div className="bg-stone-50 border border-[#EFEFEF] rounded-md p-5 mt-8">
            <h4 className="text-notion-text font-semibold mb-2 flex items-center gap-2 text-[15px]">
              💡 Tips Resume Notion-Style
            </h4>
            <p className="text-sm text-notion-gray leading-relaxed">
              Gunakan poin bulat (bullet points) seperti simbol "-" untuk menjabarkan pengalaman Anda. Pastikan nama lengkap dan info kontak Anda sesuai di halaman profil dasar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ icon, title, description, children }: { icon: React.ReactNode, title: string, description?: string, children: React.ReactNode }) {
  return (
    <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
      <div className="p-5 flex items-center gap-3 border-b border-[#EFEFEF] bg-stone-50/50">
        <div className="text-notion-text">
          {icon}
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-notion-text">{title}</h3>
          {description && <p className="text-xs text-notion-gray mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5 bg-stone-50/30">
        {children}
      </div>
    </div>
  )
}