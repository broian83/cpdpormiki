// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Article {
  id: string
  judul: string
  slug: string
  isi: string
  kategori: string | null
}

export default function HelpPage() {
  const router = useRouter()
  const supabase = createClient()
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data } = await supabase
        .from('help_articles')
        .select('*')
        .eq('is_published', true)
        .order('updated_at', { ascending: false })

      if (data) {
        setArticles(data)
        if (data.length > 0) setSelectedArticle(data[0])
      }
    } catch (error) {
      console.error('Error fetching help data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = articles.filter(a => 
    a.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.kategori?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) return (
    <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-200"></div>
      <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memuat Bantuan...</span>
    </div>
  )

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-500">
      {/* Mini Breadcrumb/Back */}
      <div className="flex items-center gap-3 pt-4">
        <button onClick={() => router.back()} className="text-notion-gray hover:text-notion-text transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-notion-text/50">Support Center</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-notion-text">Pusat Bantuan</h2>
          <p className="text-sm text-notion-gray font-medium mt-1">Panduan lengkap dan dokumentasi layanan PORMIKI.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
         {/* Search Overlay Style */}
         <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray opacity-40 group-focus-within:text-notion-text transition-colors" />
            <Input 
              placeholder="Cari panduan (misal: 'KTA', 'Logbook', 'Iuran')..." 
              className="pl-12 bg-white border-[#EFEFEF] rounded-md h-14 focus-visible:ring-0 focus-visible:border-notion-text shadow-sm text-sm font-medium placeholder:text-stone-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         <div className="space-y-12">
            {['AKUN', 'LOGBOOK', 'PEMBAYARAN', 'UMUM'].map((cat) => {
               const catArticles = filteredArticles.filter(a => (a.kategori || 'UMUM').toUpperCase() === cat);
               if (catArticles.length === 0) return null;
               return (
                 <div key={cat} className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                       <h3 className="text-[11px] font-black text-notion-text uppercase tracking-[0.3em] shrink-0">{cat}</h3>
                       <div className="h-px w-full bg-stone-100/50" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                       {catArticles.map(article => (
                         <div 
                             key={article.id} 
                             className={cn(
                               "group border rounded-md transition-all overflow-hidden bg-white",
                               selectedArticle?.id === article.id 
                                 ? "border-notion-text shadow-md ring-1 ring-notion-text/5" 
                                 : "border-[#EFEFEF] hover:border-stone-300 shadow-sm"
                             )}
                         >
                            <button 
                               onClick={() => setSelectedArticle(selectedArticle?.id === article.id ? null : article)}
                               className="w-full text-left p-5 flex items-center justify-between gap-4"
                            >
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                     "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                                     selectedArticle?.id === article.id ? "bg-notion-text text-white" : "bg-stone-50 text-notion-gray/40 group-hover:bg-stone-100"
                                  )}>
                                     <BookOpen size={16} />
                                  </div>
                                  <span className={cn(
                                     "text-sm font-bold transition-colors",
                                     selectedArticle?.id === article.id ? "text-notion-text" : "text-notion-gray group-hover:text-notion-text"
                                  )}>
                                     {article.judul}
                                  </span>
                               </div>
                               <ChevronRight size={16} className={cn(
                                  "transition-all text-notion-gray/30",
                                  selectedArticle?.id === article.id ? "rotate-90 text-notion-text" : "group-hover:text-notion-text"
                               )} />
                            </button>

                            {selectedArticle?.id === article.id && (
                              <div className="p-8 pt-0 animate-in slide-in-from-top-2 duration-300">
                                 <div className="h-px bg-[#EFEFEF] mb-8" />
                                 <div 
                                   className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-notion-text prose-p:leading-relaxed prose-p:text-notion-text/60 prose-p:text-base prose-strong:text-notion-text prose-strong:font-black marker:text-notion-text/10" 
                                   dangerouslySetInnerHTML={{ __html: article.isi.replace(/\n/g, '<br />') }} 
                                 />
                                 <div className="mt-10 pt-6 border-t border-stone-50 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Informasi Terverifikasi</p>
                                 </div>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                 </div>
               )
            })}
         </div>

         {filteredArticles.length === 0 && searchQuery && (
           <div className="py-20 text-center bg-stone-50/50 rounded-md border border-dashed border-[#EFEFEF]">
              <Search className="w-10 h-10 text-stone-200 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-notion-text uppercase tracking-widest">Tidak Ditemukan</h3>
              <p className="text-xs text-notion-gray mt-1">Coba gunakan kata kunci yang lebih luas.</p>
           </div>
         )}
      </div>

      <div className="mt-12 bg-stone-50 border border-[#EFEFEF] rounded-md p-6 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-start gap-4">
            <div>
               <h4 className="text-[10px] font-black text-notion-text uppercase tracking-[0.2em] mb-1">Butuh Bantuan Lainnya?</h4>
               <p className="text-xs text-notion-gray font-medium leading-relaxed max-w-2xl">
                 Silakan hubungi DPD PORMIKI di wilayah Anda untuk pertanyaan seputar keanggotaan dan logbook daerah.
               </p>
            </div>
         </div>
         <Button 
           onClick={() => router.push('/help/directory')} 
           variant="outline" 
           className="w-full md:w-auto h-11 px-6 rounded-md border-[#EFEFEF] bg-white text-[10px] font-black uppercase tracking-widest text-notion-text hover:bg-white hover:border-notion-text transition-all shadow-sm"
         >
            <BookOpen size={14} className="mr-2" /> Direktori DPD/DPC
         </Button>
      </div>
    </div>
  )
}