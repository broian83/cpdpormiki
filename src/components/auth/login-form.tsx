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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-sm bg-notion-red_bg border border-notion-red/10 text-notion-red text-[13px] font-medium animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
          className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            className="rounded-sm border-[#EFEFEF] focus:border-notion-gray focus:ring-0 h-10 text-[14px] shadow-none bg-stone-50/30"
          />
          <div className="flex justify-end pr-1">
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-notion-gray hover:text-notion-blue transition-colors uppercase tracking-wider"
            >
              Lupa Password?
            </Link>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-notion-blue text-white hover:bg-notion-blue/90 font-bold h-10 rounded-sm shadow-none text-sm transition-all active:scale-[0.98]" 
        isLoading={isLoading}
      >
        Lanjutkan Ke Dashboard
      </Button>

      <div className="relative py-2">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EFEFEF]"></div></div>
         <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-notion-gray bg-white px-2">Atau</div>
      </div>

      <p className="text-center text-[13px] text-notion-gray">
        Belum punya akun?{' '}
        <Link href="/register" className="text-notion-blue hover:underline font-bold">
          Daftar Sekarang
        </Link>
      </p>
    </form>
  )
}