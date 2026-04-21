// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  Globe, 
  Monitor, 
  Shield, 
  Save, 
  CheckCircle2, 
  Languages, 
  ArrowLeft,
  ChevronRight,
  Mail,
  Zap,
  Smartphone,
  Moon,
  Sun,
  Lock,
  MessageSquare
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

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
      
      if (error) throw error
      toast.success('Pengaturan berhasil disimpan')
    } catch (error) { 
      toast.error('Gagal menyimpan pengaturan')
      console.error('Error:', error) 
    } finally { 
      setIsSaving(false) 
    }
  }

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-200"></div>
        <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memuat Preferensi...</span>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 pb-24 space-y-8">
      {/* Header Area */}
      <div className="flex justify-between items-start pt-4">
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-serif font-bold text-notion-text">Pengaturan</h1>
            <p className="text-sm text-notion-gray font-medium">Atur preferensi akun dan notifikasi Anda.</p>
         </div>
         <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-white border border-[#EFEFEF] rounded-md text-notion-gray hover:text-notion-text active:scale-95 transition-all">
            <ArrowLeft size={18} />
         </Link>
      </div>

      <div className="space-y-8">
        
        {/* Notifications Card */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Notifikasi & Lansiran</h3>
           <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
              <ToggleOption 
                icon={<Mail size={20} />}
                label="Email Notifikasi" 
                description="Terima informasi penagihan & pengingat berkala."
                checked={settings.notif_email}
                onCheckedChange={(val) => setSettings(s => ({ ...s, notif_email: val }))}
                color="bg-notion-blue"
              />
              <ToggleOption 
                icon={<Smartphone size={20} />}
                label="Push Notifikasi" 
                description="Peringatan instan untuk kegiatan mendesak."
                checked={settings.notif_push}
                onCheckedChange={(val) => setSettings(s => ({ ...s, notif_push: val }))}
                color="bg-emerald-500"
                last
              />
           </div>
        </section>

        {/* Global Settings Card */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Regional & Tampilan</h3>
           <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
              {/* Language Switcher */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-[#EFEFEF]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-md flex items-center justify-center text-white shadow-sm">
                       <Globe size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text leading-tight">Bahasa Utama</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">Pilih Lokal</p>
                    </div>
                 </div>
                 <div className="bg-stone-50 border border-stone-100 p-1 rounded-md flex gap-1">
                    <button 
                      onClick={() => setSettings(s => ({ ...s, bahasa: 'id' }))}
                      className={cn(
                        "px-4 py-1.5 rounded-sm text-[10px] font-black uppercase transition-all",
                        settings.bahasa === 'id' ? "bg-white border border-stone-200 text-notion-text shadow-sm" : "text-notion-gray"
                      )}
                    >
                       INA
                    </button>
                    <button 
                      onClick={() => setSettings(s => ({ ...s, bahasa: 'en' }))}
                      className={cn(
                        "px-4 py-1.5 rounded-sm text-[10px] font-black uppercase transition-all",
                        settings.bahasa === 'en' ? "bg-white border border-stone-200 text-notion-text shadow-sm" : "text-notion-gray"
                      )}
                    >
                       ENG
                    </button>
                 </div>
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center justify-between p-4 px-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-md flex items-center justify-center text-white shadow-sm">
                       <Monitor size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text leading-tight">Tema Aplikasi</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">Sesuaikan Look</p>
                    </div>
                 </div>
                 <div className="bg-stone-50 border border-stone-100 p-1 rounded-md flex gap-1">
                    <button 
                      onClick={() => setSettings(s => ({ ...s, tema: 'light' }))}
                      className={cn(
                        "p-2 rounded-sm transition-all",
                        settings.tema === 'light' ? "bg-white border border-stone-200 text-notion-blue shadow-sm" : "text-notion-gray"
                      )}
                    >
                       <Sun size={18} />
                    </button>
                    <button 
                      disabled
                      className={cn(
                        "p-2 rounded-sm transition-all opacity-20 cursor-not-allowed",
                        settings.tema === 'dark' ? "bg-white text-notion-blue shadow-sm" : "text-notion-gray"
                      )}
                    >
                       <Moon size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* Security Card */}
        <section className="space-y-4">
           <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em] px-1">Keamanan Akun</h3>
           <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
              <Link href="/forgot-password" title="Ganti Password" className="flex items-center justify-between p-4 px-6 hover:bg-stone-50 transition-colors group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500 rounded-md flex items-center justify-center text-white shadow-sm">
                       <Lock size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text leading-tight">Ubah Kata Sandi</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">Ganti berkala demi keamanan</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-stone-300 group-hover:text-notion-blue group-hover:translate-x-1 transition-all" />
              </Link>
           </div>
        </section>

        {/* Save Button Floating / Bottom */}
        <div className="pt-6">
           <Button 
              variant="default"
              size="lg"
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3"
           >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan Seluruh Perubahan'}
           </Button>
        </div>

      </div>
    </div>
  )
}

function ToggleOption({ icon, label, description, checked, onCheckedChange, last, color }: { icon: React.ReactNode, label: string, description: string, checked: boolean, onCheckedChange: (v: boolean) => void, last?: boolean, color: string }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 px-6 transition-colors group",
      !last && "border-b border-[#EFEFEF]"
    )}>
      <div className="flex items-center gap-4 min-w-0 pr-4">
        <div className={cn("w-12 h-12 rounded-md flex items-center justify-center text-white shadow-sm shrink-0", color)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-notion-text truncate">{label}</p>
          <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest opacity-60 truncate mt-1 leading-none">{description}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-notion-text"
      />
    </div>
  )
}