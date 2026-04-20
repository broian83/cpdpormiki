// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Akun</h1>
          <p className="text-slate-600 mt-2">Bergabung dengan komunitas profesional PMIK Indonesia</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <RegisterForm />
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
