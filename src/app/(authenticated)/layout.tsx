import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { BottomNavPrivate } from '@/components/layout/bottom-nav-private'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center">
      {/* Mobile-centric Shell */}
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col border-x border-[#EFEFEF] pb-24 shadow-sm relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#EFEFEF] h-16 flex items-center justify-between px-6 shadow-[0_1px_0_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-notion-text rounded-sm flex items-center justify-center">
               <span className="text-white font-serif font-black text-lg">P</span>
             </div>
             <span className="font-serif font-bold text-lg tracking-tight">Dashboard</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-stone-100 border border-[#EFEFEF] flex items-center justify-center overflow-hidden">
              <span className="text-[10px] font-bold text-notion-gray">User</span>
           </div>
        </header>

        <main className="flex-1 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </div>

      <BottomNavPrivate />
    </div>
  )
}
