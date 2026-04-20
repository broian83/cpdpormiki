// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
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
  Clock, 
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
      'open': 'bg-blue-100 text-blue-700',
      'in_progress': 'bg-amber-100 text-amber-700',
      'resolved': 'bg-emerald-100 text-emerald-700',
      'closed': 'bg-slate-100 text-slate-700'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.closed}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pusat Bantuan</h2>
          <p className="text-slate-500 mt-2 text-lg">Temukan jawaban atau hubungi tim dukungan kami.</p>
        </div>
        
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit shadow-inner">
           <button 
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'articles' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <div className="flex items-center gap-2">
               <BookOpen className="w-4 h-4" />
               Knowledge Base
             </div>
           </button>
           <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'tickets' ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
           >
             <div className="flex items-center gap-2">
               <MessageSquare className="w-4 h-4" />
               E-Ticket Support
             </div>
           </button>
        </div>
      </div>

      {activeTab === 'articles' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Search & List */}
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Cari artikel bantuan..." 
                className="pl-12 bg-white border-slate-100 rounded-2xl h-14 focus:ring-primary shadow-sm hover:shadow-md transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
               <CardContent className="p-0">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Daftar Artikel</h3>
                    <Badge variant="outline" className="rounded-lg">{filteredArticles.length}</Badge>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredArticles.map(article => (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className={`w-full text-left p-6 transition-all group flex items-center justify-between ${selectedArticle?.id === article.id ? 'bg-teal-50/50' : 'hover:bg-slate-50/50'}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold truncate ${selectedArticle?.id === article.id ? 'text-primary' : 'text-slate-700'}`}>
                            {article.judul}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{article.kategori || 'Umum'}</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${selectedArticle?.id === article.id ? 'text-primary' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    {filteredArticles.length === 0 && (
                      <div className="p-12 text-center text-slate-400 text-sm">
                        Tidak ada artikel ditemukan.
                      </div>
                    )}
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Article Viewer */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
                <CardContent className="p-8 md:p-14">
                  <div className="flex items-center gap-2 text-teal-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                    <span>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">{selectedArticle.judul}</h1>
                  <div 
                    className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-a:text-primary prose-img:rounded-3xl" 
                    dangerouslySetInnerHTML={{ __html: selectedArticle.isi.replace(/\n/g, '<br />') }} 
                  />
                  
                  <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/50 -mx-14 -mb-14 p-14">
                    <div>
                      <p className="text-slate-900 font-bold text-lg">Apakah informasi ini membantu?</p>
                      <p className="text-slate-500 text-sm">Masukan Anda membantu kami meningkatkan layanan.</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-2xl px-8 h-12 font-bold bg-white hover:bg-teal-50 hover:text-teal-600 transition-all border-slate-200">Ya, membantu</Button>
                      <Button variant="outline" className="rounded-2xl px-8 h-12 font-bold bg-white hover:bg-rose-50 hover:text-rose-600 transition-all border-slate-200">Tidak</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                  <BookOpen className="w-12 h-12 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold">Pilih artikel di sebelah kiri untuk membaca.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tickets View */
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 gap-6">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Butuh bantuan lebih lanjut?</h3>
                   <p className="text-slate-500 text-sm">Buka tiket dukungan untuk berkonsultasi langsung dengan admin.</p>
                </div>
             </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl h-14 px-10 font-black text-lg">
                  <PlusCircle className="mr-3 h-6 w-6" />
                  Buat Tiket Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none">
                <DialogHeader>
                   <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <MessageSquare className="w-7 h-7" />
                   </div>
                  <DialogTitle className="text-3xl font-black text-slate-900">Mulai Percakapan</DialogTitle>
                  <DialogDescription className="text-slate-500 pt-1">
                    Mohon isi detail pertanyaan atau masalah Anda di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">Kategori Layanan</Label>
                    <Select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      options={[
                        { value: 'KTA', label: 'KTA (Kartu Tanda Anggota)' },
                        { value: 'P2KB', label: 'P2KB (Pengembangan Profesional)' },
                        { value: 'Sertifikat', label: 'Sertifikat Kegiatan' },
                        { value: 'Lainnya', label: 'Lain-lain / Teknis' }
                      ]}
                      className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">Prioritas</Label>
                    <Select 
                      value={urgency} 
                      onChange={(e) => setUrgency(e.target.value)}
                      options={[
                        { value: 'Normal', label: 'Normal (Respon dalam 24 Jam)' },
                        { value: 'Urgent', label: 'Urgent (Prioritas)' },
                        { value: 'Immediate', label: 'Immediate (Mendesak)' }
                      ]}
                      className="rounded-2xl border-slate-100 bg-slate-50 h-14 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-[0.2em]">Deskripsi Lengkap</Label>
                    <Textarea 
                      placeholder="Jelaskan detail masalah Anda secara spesifik..."
                      className="min-h-[150px] rounded-[1.5rem] border-slate-100 bg-slate-50 focus:bg-white resize-none p-5 text-base"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3 mt-4">
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-2xl font-bold h-12 px-6">Batal</Button>
                  <Button onClick={handleSubmit} disabled={submitting || !description.trim()} className="bg-primary hover:bg-primary/90 rounded-2xl px-10 h-12 font-black shadow-lg shadow-primary/20">
                    {submitting ? 'Mengirim...' : 'Kirim Tiket Sekarang'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
           </div>

           <Card className="border-none shadow-xl shadow-slate-100 bg-white rounded-[2.5rem] overflow-hidden">
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjek & ID Tiket</th>
                        <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                        <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Urgensi</th>
                        <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tickets.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-10 py-24 text-center">
                             <div className="flex flex-col items-center">
                               <div className="w-20 h-20 rounded-full bg-slate-50 text-slate-100 flex items-center justify-center mb-6">
                                  <MessageSquare className="w-10 h-10" />
                               </div>
                               <p className="text-slate-900 font-bold text-xl">Belum Ada Tiket</p>
                               <p className="text-slate-400 mt-1">Anda belum pernah membuat tiket dukungan.</p>
                             </div>
                          </td>
                        </tr>
                      ) : (
                        tickets.map(ticket => (
                          <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                            <td className="px-10 py-8">
                              <p className="font-extrabold text-slate-900 group-hover:text-primary transition-colors text-lg">{ticket.subject}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">#{ticket.ticket_number}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ticket.created_at))}</span>
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <Badge variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold px-4 py-1">{ticket.category}</Badge>
                            </td>
                            <td className="px-10 py-8 text-sm font-bold">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full shadow-sm ${ticket.urgency === 'Normal' ? 'bg-blue-400' : ticket.urgency === 'Urgent' ? 'bg-amber-400' : 'bg-red-500'}`} />
                                <span className="text-slate-700">{ticket.urgency}</span>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-center text-sm font-bold">
                              {getStatusBadge(ticket.status)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
             </CardContent>
           </Card>

           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 backdrop-blur-md">
                   <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xl mb-1">Butuh respon kilat?</h4>
                  <p className="text-slate-400 leading-relaxed max-w-2xl">
                    Admin kami aktif di jam kerja (09:00 - 17:00 WIB). Gunakan status <strong>Immediate</strong> hanya untuk masalah kritis terkait akses akun atau pembayaran iuran yang gagal.
                  </p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}