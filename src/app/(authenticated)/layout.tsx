// @ts-nocheck
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { Header } from '@/components/layout/header'

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
    <div className="min-h-screen bg-notion-bg selection:bg-notion-blue_bg selection:text-notion-blue">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
