// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function RegisterPage() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-notion-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
      
      {/* Container Mobile Shell */}
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] sm:min-h-[90vh] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] flex flex-col border border-[#EFEFEF] overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="p-6 flex items-center justify-between">
           <Link href="/" className="p-2.5 bg-stone-50 border border-[#EFEFEF] rounded-xl text-notion-gray hover:text-notion-text hover:bg-stone-100 transition-all active:scale-90">
             <ArrowLeft size={18} />
           </Link>
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-notion-text rounded flex items-center justify-center">
                 <span className="text-white font-serif font-black text-xs">P</span>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-300">Bergabung</span>
           </div>
        </div>
        
        <main className="flex-1 px-8 pt-4 pb-12 overflow-y-auto">
          <div className="mb-10">
            <Badge className="mb-4 bg-purple-50 text-purple-600 border-none px-3 py-1 font-black text-[9px] tracking-widest uppercase">Member Registration</Badge>
            <h1 className="text-4xl font-serif font-black tracking-tight text-notion-text leading-tight">
              Buat Akun <span className="text-purple-500">.</span>
            </h1>
            <p className="text-notion-gray mt-4 text-[15px] leading-relaxed font-medium">
              Lengkapi data diri Anda untuk membuka akses penuh ke ekosistem digital PMIK.
            </p>
          </div>

          <div className="animate-in fade-in duration-700 delay-300">
            <RegisterForm />
          </div>
        </main>

        <footer className="p-8 bg-stone-50/20 text-center border-t border-stone-50">
           <p className="text-[11px] font-bold text-notion-gray/40">© 2026 PMIK Indonesia. Seluruh hak cipta dilindungi.</p>
        </footer>
      </div>
    </div>
  )
}
