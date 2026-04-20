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
import { FileEdit, Plus, Trash2, ArrowLeft } from 'lucide-react'

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
        await supabase
          .from('monthly_logbook_details')
          .upsert({
            logbook_id: logbookId,
            activity_category_id: detail.activity_category_id,
            jumlah_kegitan: detail.jumlah_kegitan,
            keterangan: detail.keterangan || '',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'logbook_id,activity_category_id' })
      }

      router.push('/logbook/list')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 pb-16 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header with Back Button */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="rounded-sm w-9 h-9 mt-1 text-notion-gray hover:bg-stone-100 border border-transparent shadow-none transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight flex items-center gap-3">
              Input Logbook
            </h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Formulir pencatatan kegiatan profesional rutin PMIK.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Periode Switcher */}
        <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
          <div className="p-5 flex items-center gap-3 border-b border-[#EFEFEF] bg-stone-50/50">
            <div className="text-notion-text opacity-70">
              <FileEdit className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-notion-text text-[15px]">Periode Laporan</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Select label="Tahun Kegiatan" options={TAHUN_OPTIONS} className="h-9 rounded-sm shadow-none border-[#EFEFEF]" {...register('tahun', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Select label="Bulan Laporan" options={BULAN_OPTIONS} className="h-9 rounded-sm shadow-none border-[#EFEFEF]" {...register('bulan', { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>

        {/* Activities List Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-semibold text-xl text-notion-text">
              Daftar Kegiatan
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-notion-gray bg-stone-100 border border-[#EFEFEF] px-2.5 py-1 rounded-sm">
              {fields.length} Item
            </span>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden relative group">
                <div className="p-4 border-b border-[#EFEFEF] bg-stone-50/50 flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-notion-gray uppercase tracking-widest">
                    No. {index + 1}
                  </span>
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => remove(index)} 
                      className="text-notion-red opacity-80 hover:opacity-100 hover:bg-notion-red/10 p-1 rounded transition-colors"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <Select
                      label={`Kategori Kegiatan`}
                      placeholder="Pilih aktivitas..."
                      options={activities.map((a) => ({ value: a.id, label: `${a.kode_kegitan} - ${a.nama_kegitan}` }))}
                      className="h-10 rounded-sm shadow-none border-[#EFEFEF] text-[15px]"
                      {...register(`details.${index}.activity_category_id` as const)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-1 border border-[#EFEFEF] rounded-sm focus-within:border-notion-gray focus-within:ring-1 focus-within:ring-notion-gray transition-colors">
                        <Input 
                          label="Jumlah (x)" 
                          type="number" 
                          min={0} 
                          placeholder="0"
                          className="border-none shadow-none h-10 w-full focus-visible:ring-0 px-3 text-[15px]"
                          {...register(`details.${index}.jumlah_kegitan` as const, { valueAsNumber: true })} 
                        />
                      </div>
                      <div className="md:col-span-3 border border-[#EFEFEF] rounded-sm focus-within:border-notion-gray focus-within:ring-1 focus-within:ring-notion-gray transition-colors">
                        <Input 
                          label="Keterangan (Opsional)" 
                          placeholder="Unit, Kasus, dll..." 
                          className="border-none shadow-none h-10 w-full focus-visible:ring-0 px-3 text-[15px]"
                          {...register(`details.${index}.keterangan` as const)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={() => append({ activity_category_id: '', jumlah_kegitan: 0, keterangan: '' })}
            className="w-full h-10 rounded-sm border border-dashed border-[#EFEFEF] text-notion-gray hover:text-notion-text hover:bg-stone-50 hover:border-notion-gray/30 transition-all font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Baris Kegiatan Terpisah
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-[#EFEFEF] pt-8 flex flex-col sm:flex-row gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="sm:w-32 h-10 rounded-sm font-medium text-notion-gray border-[#EFEFEF] shadow-none"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-notion-blue text-white hover:bg-notion-blue/90 h-10 rounded-sm font-medium shadow-none text-[15px]" 
            isLoading={isSubmitting}
          >
            Simpan Entri Logbook
          </Button>
        </div>
      </form>
    </div>
  )
}