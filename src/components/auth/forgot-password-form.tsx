'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Loader2 } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Instruksi reset password telah dikirim ke email Anda.',
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-notion-gray">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-sm border text-[13px] font-medium animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-notion-green_bg border-notion-green/10 text-notion-green' : 'bg-notion-red_bg border-notion-red/10 text-notion-red'}`}>
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-notion-blue text-white hover:bg-notion-blue/90 font-bold h-10 rounded-sm shadow-none text-sm transition-all active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          'Kirim Instruksi Reset'
        )}
      </Button>
    </form>
  )
}
