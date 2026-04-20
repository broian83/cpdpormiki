// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  HelpCircle, 
  PlusCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react'

interface Article {
  id: string
  judul: string
  slug: string
  isi: string
  kategori: string | null
}

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  category: string
  type: string
  status: string
  urgency: string
  created_at: string
}

export default function HelpPage() {
  const supabase = createClient()
  const [articles, setArticles] = useState<Article[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'articles' | 'tickets'>('articles')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Form states for new ticket
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newTicketType, setNewTicketType] = useState('Ticketing')
  const [selectedCategory, setSelectedCategory] = useState('KTA')
  const [urgency, setUrgency] = useState('Normal')
  const [description, setDescription] = useState('')

  useEffect(() => { 
    fetchData() 
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const [articlesRes, ticketsRes] = await Promise.all([
      supabase.from('help_articles').select('*').eq('is_published', true).order('updated_at', { ascending: false }),
      supabase.from('help_tickets').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    ])

    if (articlesRes.data) {
      setArticles(articlesRes.data)
      if (articlesRes.data.length > 0) setSelectedArticle(articlesRes.data[0])
    }
    if (ticketsRes.data) setTickets(ticketsRes.data)
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const ticketNumber = `TCK-${Math.floor(1000 + Math.random() * 9000)}`
      
      const { error } = await supabase.from('help_tickets').insert({
        user_id: session.user.id,
        ticket_number: ticketNumber,
        subject: description.substring(0, 50) + (description.length > 50 ? '...' : ''),
        description: description,
        type: newTicketType,
        category: selectedCategory,
        urgency: urgency,
        status: 'open'
      })

      if (!error) {
        setIsDialogOpen(false)
        setDescription('')
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredArticles = articles.filter(a => 
    a.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.kategori?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'open': 'bg-notion-blue_bg text-notion-blue',
      'in_progress': 'bg-notion-orange_bg text-notion-orange',
      'resolved': 'bg-notion-green_bg text-notion-green',
      'closed': 'bg-stone-100 text-notion-gray'
    }
    return (
      <span className={`px-2 py-0.5 rounded-sm text-xs font-medium uppercase ${styles[status] || styles.closed}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Pusat Bantuan</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Temukan jawaban atau hubungi tim dukungan kami.</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-stone-50 border border-[#EFEFEF] rounded-md w-fit">
             <button 
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${activeTab === 'articles' ? 'bg-white shadow-sm text-notion-text border border-[#EFEFEF]' : 'text-notion-gray hover:text-notion-text hover:bg-stone-100'}`}
             >
               <div className="flex items-center gap-2">
                 <BookOpen className="w-4 h-4 opacity-70" />
                 Knowledge Base
               </div>
             </button>
             <button 
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${activeTab === 'tickets' ? 'bg-white shadow-sm text-notion-text border border-[#EFEFEF]' : 'text-notion-gray hover:text-notion-text hover:bg-stone-100'}`}
             >
               <div className="flex items-center gap-2">
                 <MessageSquare className="w-4 h-4 opacity-70" />
                 E-Ticket Support
               </div>
             </button>
          </div>
        </div>
      </div>

      {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar Search & List */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray" />
              <Input 
                placeholder="Cari artikel bantuan..." 
                className="pl-9 bg-white border-[#EFEFEF] rounded-sm h-10 focus-visible:ring-0 focus-visible:border-notion-gray shadow-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden">
                <div className="p-4 border-b border-[#EFEFEF] flex items-center justify-between bg-stone-50">
                  <h3 className="font-semibold text-[15px] text-notion-text">Daftar Artikel</h3>
                  <span className="text-xs bg-[#EFEFEF] text-notion-gray px-2 py-0.5 rounded-sm font-medium">{filteredArticles.length}</span>
                </div>
                <div className="divide-y divide-[#EFEFEF] max-h-[600px] overflow-y-auto">
                  {filteredArticles.map(article => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className={`w-full text-left p-4 transition-colors group flex items-start justify-between ${selectedArticle?.id === article.id ? 'bg-stone-50' : 'hover:bg-stone-50'}`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`font-medium text-[15px] leading-tight mb-1 ${selectedArticle?.id === article.id ? 'text-notion-text' : 'text-notion-gray'}`}>
                          {article.judul}
                        </p>
                        <p className="text-[11px] text-notion-gray uppercase font-semibold">{article.kategori || 'Umum'}</p>
                      </div>
                    </button>
                  ))}
                  {filteredArticles.length === 0 && (
                    <div className="p-8 text-center text-notion-gray text-sm">
                      Tidak ada artikel ditemukan.
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* Article Viewer */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <div className="min-h-[600px] animate-in fade-in duration-500">
                  <div className="flex items-center gap-1.5 text-notion-gray font-medium text-xs uppercase mb-4">
                    <div className="w-1 h-1 rounded-full bg-notion-gray"></div>
                    <span>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <h1 className="text-3xl font-serif font-semibold text-notion-text mb-8 leading-tight">{selectedArticle.judul}</h1>
                  <div 
                    className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-notion-blue prose-p:leading-relaxed prose-p:text-[15px] prose-p:text-notion-text" 
                    dangerouslySetInnerHTML={{ __html: selectedArticle.isi.replace(/\n/g, '<br />') }} 
                  />
                  
                  <div className="mt-16 pt-8 border-t border-[#EFEFEF] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-notion-text font-medium text-[15px]">Apakah informasi ini membantu?</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#EFEFEF] text-notion-text hover:bg-stone-50 font-medium">Ya</Button>
                      <Button variant="outline" size="sm" className="h-8 border-[#EFEFEF] text-notion-text hover:bg-stone-50 font-medium">Tidak</Button>
                    </div>
                  </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-stone-50 rounded-md border border-[#EFEFEF] border-dashed">
                <div className="mb-4">
                  <BookOpen className="w-10 h-10 text-notion-gray opacity-30" />
                </div>
                <p className="text-notion-gray text-[15px]">Pilih artikel di sebelah kiri untuk membaca.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tickets View */
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-md border border-[#EFEFEF] gap-6">
             <div className="flex items-center gap-4">
                <div className="text-notion-blue opacity-80">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-lg font-serif font-semibold text-notion-text">Butuh bantuan lebih lanjut?</h3>
                   <p className="text-notion-gray text-sm mt-0.5">Buka tiket dukungan untuk berkonsultasi langsung dengan admin.</p>
                </div>
             </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm h-10 px-6 font-medium shadow-none transition-colors shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Tiket Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 gap-0">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-xl font-serif font-semibold text-notion-text">Mulai Percakapan</DialogTitle>
                  <DialogDescription className="text-notion-gray mt-1.5">
                    Mohon isi detail pertanyaan atau masalah Anda di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-notion-text">Kategori Layanan</Label>
                    <Select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      options={[
                        { value: 'KTA', label: 'KTA (Kartu Tanda Anggota)' },
                        { value: 'P2KB', label: 'P2KB (Pengembangan Profesional)' },
                        { value: 'Sertifikat', label: 'Sertifikat Kegiatan' },
                        { value: 'Lainnya', label: 'Lain-lain / Teknis' }
                      ]}
                      className="rounded-sm border-[#EFEFEF] shadow-none min-h-[36px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-notion-text">Prioritas</Label>
                    <Select 
                      value={urgency} 
                      onChange={(e) => setUrgency(e.target.value)}
                      options={[
                        { value: 'Normal', label: 'Normal (Respon dalam 24 Jam)' },
                        { value: 'Urgent', label: 'Urgent (Prioritas)' },
                        { value: 'Immediate', label: 'Immediate (Mendesak)' }
                      ]}
                      className="rounded-sm border-[#EFEFEF] shadow-none min-h-[36px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-notion-text">Deskripsi Lengkap</Label>
                    <Textarea 
                      placeholder="Jelaskan detail masalah Anda secara spesifik..."
                      className="min-h-[120px] rounded-sm border-[#EFEFEF] shadow-none resize-none focus-visible:ring-0 focus-visible:border-notion-gray text-[15px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2 mt-8">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-sm font-medium h-9 px-4 border-[#EFEFEF]">Batal</Button>
                  <Button onClick={handleSubmit} disabled={submitting || !description.trim()} className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm px-6 h-9 font-medium shadow-none">
                    {submitting ? 'Mengirim...' : 'Kirim Tiket'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
           </div>

           <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden min-h-[300px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#EFEFEF] bg-stone-50/50">
                        <th className="px-6 py-4 text-xs font-semibold text-notion-gray uppercase tracking-wider">Subjek & ID Tiket</th>
                        <th className="px-6 py-4 text-xs font-semibold text-notion-gray uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-4 text-xs font-semibold text-notion-gray uppercase tracking-wider">Urgensi</th>
                        <th className="px-6 py-4 text-xs font-semibold text-notion-gray uppercase tracking-wider text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFEFEF]">
                      {tickets.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                             <div className="flex flex-col items-center">
                               <MessageSquare className="w-8 h-8 text-notion-gray opacity-30 mb-4" />
                               <p className="text-notion-text font-semibold text-[15px]">Belum Ada Tiket</p>
                               <p className="text-notion-gray text-sm mt-1">Anda belum pernah membuat tiket dukungan.</p>
                             </div>
                          </td>
                        </tr>
                      ) : (
                        tickets.map(ticket => (
                          <tr key={ticket.id} className="hover:bg-stone-50 transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                              <p className="font-medium text-[15px] text-notion-text group-hover:text-notion-blue transition-colors">{ticket.subject}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-notion-gray">#{ticket.ticket_number}</span>
                                <span className="text-xs text-notion-gray">• {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs bg-stone-100 text-notion-gray font-medium px-2 py-0.5 rounded-sm">{ticket.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${ticket.urgency === 'Normal' ? 'bg-notion-blue' : ticket.urgency === 'Urgent' ? 'bg-notion-orange' : 'bg-notion-red'}`} />
                                <span className="text-sm text-notion-text font-medium">{ticket.urgency}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {getStatusBadge(ticket.status)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
           </div>

           <div className="bg-notion-red_bg border border-notion-red/20 rounded-md p-5 flex gap-3">
              <div className="text-notion-red mt-0.5">
                 <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-[15px] text-notion-text mb-1">Butuh respon kilat?</h4>
                <p className="text-sm text-notion-text leading-relaxed opacity-80 max-w-3xl">
                  Admin kami aktif di jam kerja (09:00 - 17:00 WIB). Gunakan status <strong>Immediate</strong> hanya untuk masalah kritis terkait akses akun atau pembayaran iuran yang gagal.
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}