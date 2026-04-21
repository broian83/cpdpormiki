// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ArrowLeft } from 'lucide-react'

export default async function LoginPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-notion-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-notion-red/5 rounded-full blur-[120px]" />
      
      {/* Container Mobile Shell */}
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] sm:min-h-[85vh] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] flex flex-col border border-[#EFEFEF] overflow-hidden relative animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="p-6 flex items-center justify-between">
           <Link href="/" className="p-2.5 bg-stone-50 border border-[#EFEFEF] rounded-xl text-notion-gray hover:text-notion-text hover:bg-stone-100 transition-all active:scale-90">
             <ArrowLeft size={18} />
           </Link>
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-notion-text rounded flex items-center justify-center">
                 <span className="text-white font-serif font-black text-xs">P</span>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-300">Member Area</span>
           </div>
        </div>
        
        <main className="flex-1 px-8 pt-6 pb-12 overflow-y-auto">
          <div className="mb-10 animate-in slide-in-from-top-4 duration-700 delay-200">
            <h1 className="text-4xl font-serif font-black tracking-tight text-notion-text leading-tight bg-clip-text">
              Masuk Akun <span className="text-notion-blue">.</span>
            </h1>
            <p className="text-notion-gray mt-4 text-[15px] leading-relaxed font-medium">
              Akses borang logbook, LMS, dan layanan profesional lainnya dalam satu portal.
            </p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <LoginForm />
          </div>
        </main>

        <footer className="p-8 border-t border-stone-50 bg-stone-50/30 text-center space-y-4">
           <p className="text-[10px] text-notion-gray font-black uppercase tracking-[0.3em]">PORMIKI INDONESIA</p>
           <div className="flex items-center justify-center gap-6">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
           </div>
        </footer>
      </div>

      <div className="mt-8 hidden sm:block">
         <p className="text-xs font-bold text-notion-gray/40 uppercase tracking-[0.4em]">PMIK Super App v1.0.4</p>
      </div>
    </div>
  )
}