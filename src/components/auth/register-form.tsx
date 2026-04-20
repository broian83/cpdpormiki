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
      <div className="text-center space-y-4">
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 text-teal-700">
          <p className="font-semibold text-lg">Pendaftaran Berhasil!</p>
          <p className="text-sm mt-1">Silakan cek email Anda untuk verifikasi (jika diaktifkan) atau silakan masuk.</p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full mt-4">
            Ke Halaman Masuk
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Nama Lengkap PMIK"
          placeholder="Sesuai ijazah/STR"
          error={errors.nama_pmik?.message}
          {...register('nama_pmik')}
          className="rounded-2xl border-slate-200 focus:border-teal-500 h-12"
        />

        <Input
          label="Email"
          type="email"
          placeholder="email@contoh.com"
          error={errors.email?.message}
          {...register('email')}
          className="rounded-2xl border-slate-200 focus:border-teal-500 h-12"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimal 6 karakter"
          error={errors.password?.message}
          {...register('password')}
          className="rounded-2xl border-slate-200 focus:border-teal-500 h-12"
        />

        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          className="rounded-2xl border-slate-200 focus:border-teal-500 h-12"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black h-12 rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-95" 
        isLoading={isLoading}
      >
        Bergabung Sekarang
      </Button>

      <p className="text-center text-sm text-slate-500 pt-2">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-teal-600 hover:text-teal-700 font-black">
          Masuk
        </Link>
      </p>
    </form>
  )
}
