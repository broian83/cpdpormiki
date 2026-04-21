// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { BULAN_OPTIONS, TAHUN_OPTIONS } from '@/lib/constants'
import { logbookInputSchema, type LogbookInput } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FileEdit, Plus, Trash2, ArrowLeft, Save, Briefcase, CalendarDays, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ActivityCategory {
  id: string
  kode_kegitan: string
  nama_kegitan: string
}

export default function InputLogbookPage() {
  const router = useRouter()
  const supabase = createClient()
  const [activities, setActivities] = useState<ActivityCategory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LogbookInput>({
    resolver: zodResolver(logbookInputSchema),
    defaultValues: {
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      details: [{ activity_category_id: '', jumlah_kegitan: 0, keterangan: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  })

  useEffect(() => {
    async function fetchActivities() {
      const { data } = await supabase
        .from('activity_categories')
        .select('id, kode_kegitan, nama_kegitan')
        .eq('is_active', true)
        .order('nama_kegitan')

      if (data) setActivities(data)
    }
    fetchActivities()
  }, [supabase])

  const onSubmit = async (data: LogbookInput) => {
    setIsSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: existingLogbook } = await supabase
        .from('monthly_logbooks')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tahun', data.tahun)
        .eq('bulan', data.bulan)
        .maybeSingle()

      let logbookId = existingLogbook?.id
      if (!logbookId) {
        const { data: newLogbook, error: createError } = await supabase
          .from('monthly_logbooks')
          .insert({ user_id: session.user.id, tahun: data.tahun, bulan: data.bulan, status_draft: true })
          .select()
          .single()
        
        if (createError || !newLogbook) throw new Error('Gagal membuat logbook baru')
        logbookId = newLogbook.id
      }

      for (const detail of data.details) {
        if (!detail.activity_category_id) continue
        const { error } = await supabase
          .from('monthly_logbook_details')
          .upsert({
            logbook_id: logbookId,
            activity_category_id: detail.activity_category_id,
            jumlah_kegitan: detail.jumlah_kegitan,
            keterangan: detail.keterangan || '',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'logbook_id,activity_category_id' })

        if (error) throw error
      }

      toast.success('Logbook berhasil disimpan')
      router.push('/logbook/list')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal menyimpan logbook')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-in fade-in pb-16 duration-500 space-y-6">
      {/* Mini Breadcrumb/Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-notion-gray hover:text-notion-text transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Formulir Logbook</h1>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl font-serif font-bold text-notion-text">Input Data Baru</h2>
        <p className="text-sm text-notion-gray font-medium">Lengkapi rincian kegiatan profesional Anda untuk divalidasi.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Periode Box (Gaya Box Design User Suka) */}
        <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex items-center gap-3">
             <CalendarDays className="w-4 h-4 text-notion-gray opacity-70" />
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-notion-gray">Periode Laporan</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Bulan</label>
                  <Select 
                    options={BULAN_OPTIONS} 
                    className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium" 
                    {...register('bulan', { valueAsNumber: true })} 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Tahun</label>
                  <Select 
                    options={TAHUN_OPTIONS} 
                    className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium" 
                    {...register('tahun', { valueAsNumber: true })} 
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Activities Box */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-serif font-bold text-notion-text">Daftar Kegiatan</h3>
              <span className="text-[10px] font-black text-notion-gray bg-stone-100 px-3 py-1 rounded uppercase tracking-widest border border-[#EFEFEF]">
                 {fields.length} Aktivitas
              </span>
           </div>

           <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
                   {/* Card Header/Actions */}
                   <div className="px-4 py-3 border-b border-[#EFEFEF] bg-stone-50/50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Detail #{index + 1}</span>
                      {index > 0 && (
                        <button type="button" onClick={() => remove(index)} className="text-notion-red/50 hover:text-notion-red transition-colors">
                           <Trash2 size={16} />
                        </button>
                      )}
                   </div>

                   <div className="p-6 space-y-5">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Kategori Kegiatan</label>
                         <Select
                           placeholder="Cari kegiatan..."
                           options={activities.map((a) => ({ value: a.id, label: `${a.kode_kegitan} - ${a.nama_kegitan}` }))}
                           className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-medium"
                           {...register(`details.${index}.activity_category_id` as const)}
                         />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Jumlah (Volume)</label>
                            <Input 
                              type="number" 
                              min={0} 
                              placeholder="0"
                              className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm font-bold"
                              {...register(`details.${index}.jumlah_kegitan` as const, { valueAsNumber: true })} 
                            />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-notion-gray uppercase tracking-widest px-1">Keterangan</label>
                            <Input 
                              placeholder="Unit kerja / Kasus..." 
                              className="h-10 rounded-md border-[#EFEFEF] shadow-none text-sm"
                              {...register(`details.${index}.keterangan` as const)} 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <Button 
             type="button" 
             variant="ghost" 
             onClick={() => append({ activity_category_id: '', jumlah_kegitan: 0, keterangan: '' })}
             className="w-full border-2 border-dashed border-stone-200 hover:border-stone-400 font-bold uppercase text-[10px] tracking-widest py-6"
           >
             <Plus className="w-4 h-4 mr-2" />
             Tambah Baris Kegiatan
           </Button>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-[#EFEFEF] flex flex-col md:flex-row gap-3">
           <Button 
             type="submit" 
             variant="default"
             size="lg"
             className="flex-1 font-bold uppercase text-[10px] tracking-widest" 
             isLoading={isSubmitting}
           >
             <Save className="w-4 h-4 mr-2" /> Simpan Logbook
           </Button>
           <Button 
             type="button" 
             variant="secondary" 
             size="lg"
             onClick={() => router.back()}
             className="md:w-40 font-bold uppercase text-[10px] tracking-widest"
           >
             Batal
           </Button>
        </div>
      </form>
    </div>
  )
}