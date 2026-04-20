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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Nama Lengkap PMIK"
        placeholder="Masukkan nama sesuai ijazah/STR"
        error={errors.nama_pmik?.message}
        {...register('nama_pmik')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="email@contoh.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Minimal 6 karakter"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Konfirmasi Password"
        type="password"
        placeholder="Ulangi password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Daftar Sekarang
      </Button>

      <p className="text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Masuk
        </Link>
      </p>
    </form>
  )
}
