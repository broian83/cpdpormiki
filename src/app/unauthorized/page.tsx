import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100/50">
          <ShieldAlert size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Akses Ditolak</h1>
          <p className="text-slate-500">Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi admin jika ini adalah kesalahan.</p>
        </div>

        <div className="pt-4">
          <Link href="/dashboard">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-2xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
