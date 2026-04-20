// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
          <p className="text-slate-600 mt-2">Selamat datang kembali di Member Area PMIK</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/" className="text-teal-600 hover:text-teal-700">
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  )
}