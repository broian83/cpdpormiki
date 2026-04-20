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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="pmik@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-sm font-medium animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-teal-100 transition-all active:scale-95"
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
