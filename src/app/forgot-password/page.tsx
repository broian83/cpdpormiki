import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-indigo-50">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4 shadow-inner">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lupa Password?</h1>
          <p className="text-slate-500 mt-2">Jangan khawatir, masukkan email Anda untuk mereset.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 border border-white">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Sudah ingat password?{' '}
          <Link href="/login" className="font-bold text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
