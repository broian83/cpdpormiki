import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { ArrowLeft, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-notion-orange/5 rounded-full blur-[120px]" />
      
      {/* Container Mobile Shell */}
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] sm:min-h-[80vh] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] flex flex-col border border-[#EFEFEF] overflow-hidden relative animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="p-6">
           <Link href="/login" className="inline-flex items-center gap-2 p-2.5 bg-stone-50 border border-[#EFEFEF] rounded-xl text-notion-gray hover:text-notion-text hover:bg-stone-100 transition-all active:scale-90">
             <ArrowLeft size={18} />
             <span className="text-xs font-bold uppercase tracking-wider pr-1">Kembali</span>
           </Link>
        </div>
        
        <main className="flex-1 px-8 py-4">
          <div className="mb-10 animate-in slide-in-from-top-4 duration-700 delay-200">
            <div className="w-12 h-12 bg-notion-orange/10 rounded-xl flex items-center justify-center mb-6 border border-notion-orange/20">
               <KeyRound size={24} className="text-notion-orange" />
            </div>
            <h1 className="text-4xl font-serif font-black tracking-tight text-notion-text leading-tight">
              Lupa Password <span className="text-notion-orange">?</span>
            </h1>
            <p className="text-notion-gray mt-4 text-[15px] leading-relaxed font-medium">
              Masukkan email terdaftar Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
             <div className="bg-white border border-[#EFEFEF] rounded-[2rem] p-8 shadow-sm">
                <ForgotPasswordForm />
             </div>
          </div>
        </main>

        <footer className="p-10 text-center">
           <p className="text-[10px] text-notion-gray font-black uppercase tracking-[0.4em] opacity-30">Security Verification Required</p>
        </footer>
      </div>
    </div>
  )
}
