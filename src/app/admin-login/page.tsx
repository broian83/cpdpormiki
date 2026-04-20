'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Logika verifikasi role admin bisa ditambahkan di sini via profiles table
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Gagal masuk ke sistem admin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-notion-red_bg rounded-2xl flex items-center justify-center mb-6 border border-notion-red/10 shadow-sm">
            <ShieldAlert className="w-8 h-8 text-notion-red" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-notion-text tracking-tight mb-2">Admin Portal</h1>
          <p className="text-notion-gray text-sm font-medium">Hanya Pengurus Pusat & Daerah yang diizinkan masuk.</p>
        </div>

        <div className="border border-[#EFEFEF] bg-[#F9F9F9]/50 p-8 rounded-lg shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-notion-gray uppercase tracking-wider ml-1">Alamat Email</label>
              <Input 
                type="email" 
                placeholder="admin@pormiki.or.id" 
                className="h-11 rounded-md border-[#EFEFEF] shadow-none focus:ring-notion-red focus:border-notion-red" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-notion-gray uppercase tracking-wider ml-1">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="h-11 rounded-md border-[#EFEFEF] shadow-none focus:ring-notion-red focus:border-notion-red" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-notion-red text-[13px] font-medium">
                 <AlertCircle className="w-4 h-4 mt-0.5" />
                 {error}
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full h-11 bg-notion-red hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-all" 
                disabled={isLoading}
            >
              {isLoading ? 'Mengautentikasi...' : 'Masuk ke Dashboard Admin'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>

        <div className="text-center">
            <button 
                onClick={() => router.push('/login')}
                className="text-[13px] font-medium text-notion-gray hover:text-notion-text flex items-center justify-center gap-2 mx-auto transition-colors"
            >
                <Lock className="w-3.5 h-3.5" />
                Kembali ke Login Member
            </button>
        </div>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
