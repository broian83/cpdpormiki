import { WifiOff, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-teal-50/30">
      <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="mx-auto w-32 h-32 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center text-teal-600 border-4 border-teal-50">
          <WifiOff size={64} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Koneksi Terputus</h1>
          <p className="text-slate-500 leading-relaxed">
            Sepertinya Anda sedang offline. Beberapa fitur mungkin tidak tersedia sampai Anda terhubung kembali ke internet.
          </p>
        </div>

        <Button 
          onClick={() => window.location.reload()}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black h-14 rounded-2xl shadow-xl shadow-teal-200 transition-all active:scale-95"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Coba Muat Ulang
        </Button>
        
        <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
          Member Area PMIK Indonesia
        </p>
      </div>
    </div>
  )
}
