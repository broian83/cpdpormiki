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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    watch,
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
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Input Logbook Bulanan</h2>
        <p className="text-slate-600">Catat kegiatan bulan ini</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Periode</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Select label="Tahun" options={TAHUN_OPTIONS} {...register('tahun', { valueAsNumber: true })} />
              <Select label="Bulan" options={BULAN_OPTIONS} {...register('bulan', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Jenis Kegiatan</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ activity_category_id: '', jumlah_kegitan: 0, keterangan: '' })}>
              + Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <Select
                        label="Jenis Kegiatan"
                        placeholder="Pilih jenis kegiatan"
                        options={activities.map((a) => ({ value: a.id, label: `${a.kode_kegitan} - ${a.nama_kegitan}` }))}
                        {...register(`details.${index}.activity_category_id` as const)}
                      />
                      <Input label="Jumlah Kegiatan" type="number" min={0} {...register(`details.${index}.jumlah_kegitan` as const, { valueAsNumber: true })} />
                      <Input label="Keterangan (Opsional)" placeholder="Tambahkan keterangan..." {...register(`details.${index}.keterangan` as const)} />
                    </div>
                    {index > 0 && (
                      <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 mt-6">
          <Button type="submit" className="flex-1" isLoading={isSubmitting}>Simpan Logbook</Button>
        </div>
      </form>
    </div>
  )
}