// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Globe, Moon, Shield, Save, CheckCircle2, Languages, Monitor } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle')

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
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
      const { error } = await supabase.from('account_settings').upsert({ 
        user_id: session.user.id, 
        ...settings, 
        updated_at: new Date().toISOString() 
      })
      
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-slate-500 mt-1">Kelola preferensi akun dan keamanan Anda.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-8 font-bold"
        >
          {isSaving ? 'Menyimpan...' : (saveStatus === 'success' ? 'Tersimpan!' : 'Simpan Perubahan')}
          {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4 ml-2" />}
          {!isSaving && saveStatus === 'idle' && <Save className="w-4 h-4 ml-2" />}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <SettingsSection 
          icon={<Bell className="w-5 h-5 text-amber-500" />} 
          title="Notifikasi" 
          description="Pilih bagaimana Anda ingin menerima pembaruan dari kami."
        >
          <div className="space-y-4 pt-2">
            <ToggleOption 
              label="Notifikasi Email" 
              description="Terima ringkasan dwi-mingguan dan berita penting."
              checked={settings.notif_email}
              onCheckedChange={(val) => setSettings(s => ({ ...s, notif_email: val }))}
            />
            <ToggleOption 
              label="Notifikasi Push" 
              description="Dapatkan peringatan langsung di perangkat Anda."
              checked={settings.notif_push}
              onCheckedChange={(val) => setSettings(s => ({ ...s, notif_push: val }))}
            />
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection 
          icon={<Globe className="w-5 h-5 text-indigo-500" />} 
          title="Tampilan & Bahasa" 
          description="Atur bahasa dan tema aplikasi."
        >
          <div className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Languages className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Bahasa</p>
                  <p className="text-xs text-slate-500">Pilih bahasa antarmuka aplikasi.</p>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                 <button 
                  onClick={() => setSettings(s => ({ ...s, bahasa: 'id' }))}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${settings.bahasa === 'id' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Indonesia
                 </button>
                 <button 
                  onClick={() => setSettings(s => ({ ...s, bahasa: 'en' }))}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${settings.bahasa === 'en' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   English
                 </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Tema</p>
                  <p className="text-xs text-slate-500">Sesuaikan tampilan dengan kenyamanan mata Anda.</p>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                 <button 
                  onClick={() => setSettings(s => ({ ...s, tema: 'light' }))}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${settings.tema === 'light' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Light
                 </button>
                 <button 
                  onClick={() => setSettings(s => ({ ...s, tema: 'dark' }))}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${settings.tema === 'dark' ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Dark
                 </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Info */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Keamanan Akun</h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-lg mt-1">
              Kata sandi Anda dikelola oleh Supabase Auth. Untuk mengganti kata sandi, silakan klik tombol "Lupa Kata Sandi" di halaman login atau hubungi administrator jika Anda menggunakan akun yang dikelola sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function ToggleOption({ label, description, checked, onCheckedChange }: { label: string, description: string, checked: boolean, onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 pb-4">
      <div className="space-y-0.5">
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 max-w-[280px]">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}