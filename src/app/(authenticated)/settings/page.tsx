// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Bell, Globe, Monitor, Shield, Save, CheckCircle2, Languages } from 'lucide-react'
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
    const { data } = await supabase.from('account_settings').select('*').eq('user_id', session.user.id).maybeSingle()
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
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-12 pb-16 animate-in fade-in duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Pengaturan</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Kelola preferensi akun, notifikasi, dan tampilan aplikasi Anda.</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="bg-notion-blue hover:bg-notion-blue/90 text-white shadow-none rounded-sm px-6 font-medium h-9"
          >
            {isSaving ? 'Menyimpan...' : (saveStatus === 'success' ? 'Tersimpan!' : 'Update Preferensi')}
            {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4 ml-2" />}
            {!isSaving && saveStatus === 'idle' && <Save className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Notifications */}
        <SettingsSection 
          icon={<Bell className="w-5 h-5 text-notion-text opacity-70" />} 
          title="Notifikasi" 
          description="Pilih bagaimana Anda ingin menerima pemberitahuan sistem."
        >
          <div className="space-y-1">
            <ToggleOption 
              label="Email Notifikasi" 
              description="Terima informasi penagihan dan pengingat via email."
              checked={settings.notif_email}
              onCheckedChange={(val) => setSettings(s => ({ ...s, notif_email: val }))}
            />
            <ToggleOption 
              label="Push Notifikasi" 
              description="Dapatkan peringatan penting langsung di aplikasi."
              checked={settings.notif_push}
              onCheckedChange={(val) => setSettings(s => ({ ...s, notif_push: val }))}
            />
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection 
          icon={<Globe className="w-5 h-5 text-notion-text opacity-70" />} 
          title="Regional & Tampilan" 
          description="Sesuaikan antarmuka sesuai preferensi Anda."
        >
          <div className="space-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-[#EFEFEF] last:border-0">
              <div className="flex items-center gap-3">
                <div className="text-notion-gray">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-notion-text text-[15px]">Bahasa Utama</p>
                  <p className="text-sm text-notion-gray mt-0.5">Pilih bahasa favorit Anda.</p>
                </div>
              </div>
              <div className="flex gap-1 p-1 bg-stone-50 border border-[#EFEFEF] rounded-md">
                 <button 
                  onClick={() => setSettings(s => ({ ...s, bahasa: 'id' }))}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${settings.bahasa === 'id' ? 'bg-white shadow-sm border border-[#EFEFEF] text-notion-text' : 'text-notion-gray hover:text-notion-text hover:bg-stone-100'}`}
                 >
                   Indonesia
                 </button>
                 <button 
                  onClick={() => setSettings(s => ({ ...s, bahasa: 'en' }))}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${settings.bahasa === 'en' ? 'bg-white shadow-sm border border-[#EFEFEF] text-notion-text' : 'text-notion-gray hover:text-notion-text hover:bg-stone-100'}`}
                 >
                   English
                 </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-[#EFEFEF] last:border-0">
              <div className="flex items-center gap-3">
                <div className="text-notion-gray">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-notion-text text-[15px]">Tema Tampilan</p>
                  <p className="text-sm text-notion-gray mt-0.5">Tema 'dark mode' akan tersedia segera.</p>
                </div>
              </div>
              <div className="flex gap-1 p-1 bg-stone-50 border border-[#EFEFEF] rounded-md">
                 <button 
                  onClick={() => setSettings(s => ({ ...s, tema: 'light' }))}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${settings.tema === 'light' ? 'bg-white shadow-sm border border-[#EFEFEF] text-notion-text' : 'text-notion-gray hover:text-notion-text hover:bg-stone-100'}`}
                 >
                   Light
                 </button>
                 <button 
                  disabled
                  onClick={() => setSettings(s => ({ ...s, tema: 'dark' }))}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors opacity-50 cursor-not-allowed ${settings.tema === 'dark' ? 'bg-white shadow-sm border border-[#EFEFEF] text-notion-text' : 'text-notion-gray'}`}
                 >
                   Dark
                 </button>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Info */}
        <SettingsSection 
          icon={<Shield className="w-5 h-5 text-notion-text opacity-70" />} 
          title="Keamanan Akun" 
          description="Informasi mengenai sandi dan login sesi."
        >
          <div className="py-2">
            <p className="text-sm text-notion-gray leading-relaxed max-w-2xl">
              Autentikasi dikendalikan oleh manajemen ID pusat (Supabase Auth). Untuk memperbarui kata sandi atau faktor ganda Anda, pastikan untuk menggunakan fitur Lupa Kata Sandi pada halaman awal atau kontak Administrator Nasional.
            </p>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}

function SettingsSection({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
        <div className="flex items-center gap-3 mb-4 p-5 border-b border-[#EFEFEF] bg-stone-50/50">
          <div>
            {icon}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-notion-text">{title}</h3>
            <p className="text-xs text-notion-gray mt-0.5">{description}</p>
          </div>
        </div>
        <div className="px-6 pb-6">
          {children}
        </div>
    </div>
  )
}

function ToggleOption({ label, description, checked, onCheckedChange }: { label: string, description: string, checked: boolean, onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[#EFEFEF] last:border-0 hover:bg-stone-50/30 -mx-6 px-6 transition-colors">
      <div className="space-y-0.5">
        <p className="font-medium text-[15px] text-notion-text">{label}</p>
        <p className="text-sm text-notion-gray max-w-[280px]">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}