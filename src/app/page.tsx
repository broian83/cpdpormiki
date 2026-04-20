// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Member Area PMIK</h1>
          <p className="text-slate-600 mt-2">Portal Member Area PROFESIONAL MANAJEMEN INFORMASI KESEHATAN (PMIK) Indonesia</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <div className="space-y-4">
            <Link href="/login">
              <Button className="w-full" size="lg">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full" size="lg">
                Daftar
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              Dengan masuk, Anda setuju dengan{' '}
              <a href="#" className="text-teal-600 hover:underline">Syarat & Ketentuan</a>
              {' '}dan{' '}
              <a href="#" className="text-teal-600 hover:underline">Kebijakan Privasi</a>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 PMIK Indonesia. All rights reserved.
        </p>
      </div>
    </div>
  )
}