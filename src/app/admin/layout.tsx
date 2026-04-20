import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin-login')
  }

  // TODO: Secure layout by validating user role has admin privileges

  return (
    <div className="min-h-screen bg-white selection:bg-notion-red_bg selection:text-notion-red">
      <AdminSidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
