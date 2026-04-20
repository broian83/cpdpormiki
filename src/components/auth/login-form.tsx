'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
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
          placeholder="Masukkan password"
          error={errors.password?.message}
          {...register('password')}
          className="rounded-2xl border-slate-200 focus:border-teal-500 h-12"
        />
      </div>

      <div className="flex items-center justify-end px-1">
        <Link
          href="/forgot-password"
          className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline underline-offset-4"
        >
          Lupa Password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black h-12 rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-95" 
        isLoading={isLoading}
      >
        Masuk Sekarang
      </Button>

      <p className="text-center text-sm text-slate-500 pt-2">
        Belum punya akun?{' '}
        <Link href="/register" className="text-teal-600 hover:text-teal-700 font-black">
          Daftar Gratis
        </Link>
      </p>
    </form>
  )
}