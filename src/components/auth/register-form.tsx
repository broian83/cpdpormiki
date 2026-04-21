'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nama_pmik: data.nama_pmik,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
      // Redirect after a delay or show success message
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in duration-500">
        <div className="p-6 rounded-sm bg-notion-green_bg border border-notion-green/10 text-notion-green">
          <p className="font-serif font-bold text-xl mb-2">Pendaftaran Berhasil!</p>
          <p className="text-sm opacity-80">Silakan cek email Anda untuk verifikasi atau silakan coba masuk ke sistem.</p>
        </div>
        <Link href="/login" className="block">
          <Button variant="outline" className="w-full h-10 border-[#EFEFEF] hover:bg-stone-50 rounded-sm shadow-none font-semibold">
            Ke Halaman Masuk
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-sm bg-notion-red_bg border border-notion-red/10 text-notion-red text-[13px] font-medium animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <Input
          label="Nama Lengkap PMIK"
          placeholder="Sesuai ijazah atau STR"
          error={errors.nama_pmik?.message}
          {...register('nama_pmik')}
          className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
          className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-notion-blue text-white hover:bg-notion-blue/90 font-bold h-10 rounded-sm shadow-none text-sm transition-all active:scale-[0.98]" 
          isLoading={isLoading}
        >
          Daftar Sekarang
        </Button>
      </div>

      <p className="text-center text-[13px] text-notion-gray">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-notion-blue hover:underline font-bold">
          Masuk
        </Link>
      </p>
    </form>
  )
}
