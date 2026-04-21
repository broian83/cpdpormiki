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
  Lock
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
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-stone-100 border-t-notion-blue rounded-full animate-spin" />
        <p className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memuat Pengaturan...</p>
      </div>
    </div>
  )

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32">
      {/* Header Mobile Style */}
      <div className="flex items-center justify-between mb-10">
         <Link href="/dashboard" className="p-2.5 bg-white border border-[#EFEFEF] rounded-xl text-notion-gray hover:text-notion-text active:scale-95 transition-all">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="text-sm font-black uppercase tracking-[0.2em] text-notion-text">Pengaturan</h1>
         <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="h-10 px-5 bg-notion-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
         >
            {isSaving ? '...' : (
              <div className="flex items-center gap-2">
                Simpan
              </div>
            )}
         </Button>
      </div>

      <div className="space-y-10">
        
        {/* Notifications Card */}
        <section className="space-y-5">
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                 <Bell size={18} />
              </div>
              <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em]">Notifikasi</h3>
           </div>
           
           <div className="bg-white border border-[#EFEFEF] rounded-[2.5rem] overflow-hidden shadow-sm">
              <ToggleOption 
                icon={<Mail size={20} />}
                label="Email Notifikasi" 
                description="Terima informasi penagihan & pengingat."
                checked={settings.notif_email}
                onCheckedChange={(val) => setSettings(s => ({ ...s, notif_email: val }))}
              />
              <ToggleOption 
                icon={<Smartphone size={20} />}
                label="Push Notifikasi" 
                description="Peringatan penting di HP Anda."
                checked={settings.notif_push}
                onCheckedChange={(val) => setSettings(s => ({ ...s, notif_push: val }))}
                last
              />
           </div>
        </section>

        {/* Global Settings Card */}
        <section className="space-y-5">
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                 <Languages size={18} />
              </div>
              <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em]">Regional & Tampilan</h3>
           </div>
           
           <div className="bg-white border border-[#EFEFEF] rounded-[2.5rem] overflow-hidden shadow-sm">
              {/* Language Switcher */}
              <div className="flex items-center justify-between p-7 border-b border-[#EFEFEF]">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-notion-gray">
                       <Globe size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text">Bahasa Utama</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">ID / EN</p>
                    </div>
                 </div>
                 <div className="bg-stone-100 p-1 rounded-2xl flex gap-1">
                    <button 
                      onClick={() => setSettings(s => ({ ...s, bahasa: 'id' }))}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                        settings.bahasa === 'id' ? "bg-white text-notion-text shadow-sm" : "text-notion-gray"
                      )}
                    >
                       INA
                    </button>
                    <button 
                      onClick={() => setSettings(s => ({ ...s, bahasa: 'en' }))}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                        settings.bahasa === 'en' ? "bg-white text-notion-text shadow-sm" : "text-notion-gray"
                      )}
                    >
                       ENG
                    </button>
                 </div>
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center justify-between p-7">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-notion-gray">
                       <Monitor size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text">Tema Aplikasi</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">Light / Dark</p>
                    </div>
                 </div>
                 <div className="bg-stone-100 p-1 rounded-2xl flex gap-1">
                    <button 
                      onClick={() => setSettings(s => ({ ...s, tema: 'light' }))}
                      className={cn(
                        "p-2.5 rounded-xl transition-all",
                        settings.tema === 'light' ? "bg-white text-notion-blue shadow-sm" : "text-notion-gray"
                      )}
                    >
                       <Sun size={18} />
                    </button>
                    <button 
                      disabled
                      className={cn(
                        "p-2.5 rounded-xl transition-all opacity-20 cursor-not-allowed",
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
        <section className="space-y-5">
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                 <Shield size={18} />
              </div>
              <h3 className="text-[10px] font-black text-notion-gray uppercase tracking-[0.3em]">Keamanan</h3>
           </div>
           
           <div className="bg-white border border-[#EFEFEF] rounded-[2.5rem] overflow-hidden shadow-sm">
              <Link href="/forgot-password" title="Ganti Password" className="flex items-center justify-between p-7 hover:bg-stone-50 transition-colors group">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-notion-gray group-hover:text-notion-blue transition-colors">
                       <Lock size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-notion-text">Ganti Password</p>
                       <p className="text-[10px] text-notion-gray font-bold uppercase tracking-widest mt-1 opacity-60">Ubah kata sandi secara berkala</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-stone-300 group-hover:text-notion-blue group-hover:translate-x-1 transition-all" />
              </Link>
           </div>
           
           <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-50">
              <p className="text-[11px] font-medium text-notion-text/60 leading-relaxed italic">
                 "Keamanan data Anda adalah prioritas kami. Pastikan untuk selalu logout setelah menggunakan perangkat publik."
              </p>
           </div>
        </section>

      </div>
    </div>
  )
}

function ToggleOption({ icon, label, description, checked, onCheckedChange, last }: { icon: React.ReactNode, label: string, description: string, checked: boolean, onCheckedChange: (v: boolean) => void, last?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-7 transition-colors group",
      !last && "border-b border-[#EFEFEF]"
    )}>
      <div className="flex items-center gap-5 min-w-0 pr-4">
        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-notion-gray group-hover:text-notion-blue transition-colors shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-notion-text truncate">{label}</p>
          <p className="text-[10px] text-notion-gray font-bold uppercase tracking-tighter opacity-60 truncate mt-1">{description}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}