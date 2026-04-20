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
import { Card, CardContent } from '@/components/ui/card'

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
        .single()

      let logbookId = existingLogbook?.id
      if (!logbookId) {
        const { data: newLogbook } = await supabase
          .from('monthly_logbooks')
          .insert({ user_id: session.user.id, tahun: data.tahun, bulan: data.bulan, status_draft: true })
          .select()
          .single()
        logbookId = newLogbook?.id
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="rounded-full w-10 h-10 p-0 text-slate-500 hover:bg-white hover:text-teal-600 shadow-sm transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Input Logbook Bulanan</h2>
            <p className="text-slate-500">Formulir pencatatan kegiatan profesional rutin.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Periode Switcher Card */}
        <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900">Pilih Periode Laporan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Tahun Kegiatan" options={TAHUN_OPTIONS} {...register('tahun', { valueAsNumber: true })} />
              <Select label="Bulan Laporan" options={BULAN_OPTIONS} {...register('bulan', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        {/* Activities List Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
              Item Kegiatan ({fields.length})
            </h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ activity_category_id: '', jumlah_kegitan: 0, keterangan: '' })}
              className="rounded-xl border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Baris
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border-none shadow-lg shadow-slate-100 bg-white rounded-3xl overflow-hidden transition-all hover:shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-5">
                      <Select
                        label={`Item #${index + 1}: Kategori Kegiatan`}
                        placeholder="Pilih jenis kegiatan PMIK..."
                        options={activities.map((a) => ({ value: a.id, label: `${a.kode_kegitan} - ${a.nama_kegitan}` }))}
                        {...register(`details.${index}.activity_category_id` as const)}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <Input 
                            label="Jumlah Frekuensi" 
                            type="number" 
                            min={0} 
                            placeholder="0"
                            {...register(`details.${index}.jumlah_kegitan` as const, { valueAsNumber: true })} 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input 
                            label="Keterangan Tambahan" 
                            placeholder="Contoh: Unit Kerja, Nama RS, atau Detail Lainnya..." 
                            {...register(`details.${index}.keterangan` as const)} 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {index > 0 && (
                      <div className="md:pt-8 flex flex-row md:flex-col items-center justify-end">
                        <button 
                          type="button" 
                          onClick={() => remove(index)} 
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 pb-12">
          <Button 
            type="submit" 
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold h-14 rounded-2xl shadow-xl shadow-teal-100 transition-all text-lg" 
            isLoading={isSubmitting}
          >
            Simpan Data Laporan
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex-1 md:flex-none md:w-48 h-14 rounded-2xl font-semibold text-slate-500"
          >
            Batalkan
          </Button>
        </div>
      </form>
    </div>
  )
}