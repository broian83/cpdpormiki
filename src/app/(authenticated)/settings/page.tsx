// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Settings {
  notif_email: boolean
  notif_push: boolean
  bahasa: string
  tema: string
}

export default function SettingsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Settings>({ notif_email: true, notif_push: true, bahasa: 'id', tema: 'light' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('account_settings').select('*').eq('user_id', session.user.id).single()
    if (data) setSettings(data)
    setIsLoading(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      await supabase.from('account_settings').upsert({ user_id: session.user.id, ...settings, updated_at: new Date().toISOString() }, { onConflicts: 'user_id' })
    } catch (error) { console.error('Error:', error) }
    finally { setIsSaving(false) }
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-600">Kelola pengaturan akun</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Pengaturan Notifikasi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.notif_email} onChange={(e) => setSettings(s => ({ ...s, notif_email: e.target.checked }))} className="w-4 h-4" />
            <span>Notifikasi Email</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.notif_push} onChange={(e) => setSettings(s => ({ ...s, notif_push: e.target.checked }))} className="w-4 h-4" />
            <span>Notifikasi Push</span>
          </label>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Pengaturan Bahasa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="radio" name="bahasa" checked={settings.bahasa === 'id'} onChange={() => setSettings(s => ({ ...s, bahasa: 'id' }))} />
            <span>Bahasa Indonesia</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="bahasa" checked={settings.bahasa === 'en'} onChange={() => setSettings(s => ({ ...s, bahasa: 'en' }))} />
            <span>English</span>
          </label>
        </CardContent>
      </Card>
      <Button onClick={handleSave} isLoading={isSaving}>Simpan Pengaturan</Button>
    </div>
  )
}