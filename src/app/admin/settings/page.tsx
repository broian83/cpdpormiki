// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, ShieldCheck, Key, Info, CheckCircle2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const supabase = createClient()
  const [mayarKey, setMayarKey] = useState('')
  const [serviceRoleKey, setServiceRoleKey] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('system_settings').select('*')
    if (data) {
      const mKey = data.find(s => s.id === 'MAYAR_API_KEY')?.value || ''
      const sKey = data.find(s => s.id === 'SUPABASE_SERVICE_ROLE_KEY')?.value || ''
      setMayarKey(mKey)
      setServiceRoleKey(sKey)
    }
    setIsLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      await supabase.from('system_settings').upsert([
        { id: 'MAYAR_API_KEY', value: mayarKey },
        { id: 'SUPABASE_SERVICE_ROLE_KEY', value: serviceRoleKey }
      ])
      setMessage('Konfigurasi berhasil disimpan!')
    } catch (err) {
      setMessage('Gagal menyimpan konfigurasi.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="pt-8 border-b border-[#EFEFEF] pb-8">
        <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4">Pengaturan Sistem</h1>
        <p className="text-notion-gray text-lg">Kelola integrasi pihak ketiga dan kunci keamanan aplikasi secara terpusat.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Mayar Integration */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-notion-text">
            <Key className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold">Integrasi Mayar.id</h2>
          </div>
          <div className="bg-white border border-[#EFEFEF] rounded-md p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-notion-gray uppercase tracking-wider">Mayar API Key</label>
              <Input 
                type="password" 
                placeholder="Misal: bearer_xxxx..." 
                className="font-mono h-11"
                value={mayarKey}
                onChange={(e) => setMayarKey(e.target.value)}
              />
              <p className="text-[11px] text-notion-gray italic">Dapatkan di Dashboard Mayar &gt; Intergrasi &gt; API Keys.</p>
            </div>
          </div>
        </section>

        {/* Security / Supabase */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-notion-text">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold">Keamanan Data (Supabase)</h2>
          </div>
          <div className="bg-white border border-[#EFEFEF] rounded-md p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-notion-gray uppercase tracking-wider">Service Role Key</label>
              <Input 
                type="password" 
                placeholder="Your service_role secret" 
                className="font-mono h-11"
                value={serviceRoleKey}
                onChange={(e) => setServiceRoleKey(e.target.value)}
              />
              <div className="flex gap-2 p-3 bg-notion-bg/50 border border-[#EFEFEF] rounded text-notion-gray text-xs leading-relaxed">
                <Info className="w-4 h-4 shrink-0 text-notion-blue" />
                <p>Key ini digunakan untuk memproses Webhook (bypass RLS). Pastikan tidak membagikan kunci ini kepada siapapun.</p>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="p-4 bg-notion-green_bg border border-notion-green/20 rounded-md text-notion-green flex items-center gap-2 text-sm font-medium">
             <CheckCircle2 className="w-4 h-4" />
             {message}
          </div>
        )}

        <div className="flex justify-end border-t border-[#EFEFEF] pt-6">
          <Button 
            disabled={isSaving}
            className="bg-notion-red hover:bg-red-700 text-white font-semibold px-8 h-11 rounded-sm shadow-sm"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  )
}
