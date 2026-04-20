'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Search, Trash2, MailOpen, Inbox, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  subject: string
  body: string
  is_read: boolean
  sent_at: string
  sender_id: string
}

export default function MailboxPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('messages').select('*').eq('receiver_id', session.user.id).order('sent_at', { ascending: false }).limit(50)
    if (data) setMessages(data)
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return
    await supabase.from('messages').delete().eq('id', id)
    setMessages(messages.filter(m => m.id !== id))
  }

  const filteredMessages = messages.filter(m => 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight flex items-center gap-3">
              Mailbox
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center bg-notion-red_bg text-notion-red text-xs font-semibold px-2 py-0.5 rounded-sm">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Pesan resmi dan notifikasi sistem dari DPP PORMIKI.</p>
          </div>
          <Link href="/mailbox/compose">
            <Button className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm h-9 px-5 font-medium shadow-none transition-colors">
              <Send className="w-4 h-4 mr-2" />
              Tulis Pesan Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Mini */}
        <div className="lg:col-span-1 space-y-1">
          <Button variant="ghost" className="w-full justify-start font-medium bg-stone-50 text-notion-text hover:bg-stone-100 rounded-sm h-9">
            <Inbox className="w-4 h-4 mr-2 opacity-70" />
            Kotak Masuk
          </Button>
          <Button variant="ghost" className="w-full justify-start text-notion-gray hover:text-notion-text hover:bg-stone-50 font-medium rounded-sm h-9">
            <Send className="w-4 h-4 mr-2 opacity-70" />
            Terkirim
          </Button>
          <Button variant="ghost" className="w-full justify-start text-notion-gray hover:text-notion-text hover:bg-stone-50 font-medium rounded-sm h-9">
            <Trash2 className="w-4 h-4 mr-2 opacity-70" />
            Sampah
          </Button>
        </div>

        {/* Inbox Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray" />
            <Input 
              placeholder="Cari pesan atau pengirim..." 
              className="pl-9 bg-white border-[#EFEFEF] shadow-none h-9 rounded-sm focus-visible:ring-0 focus-visible:border-notion-gray text-[15px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden min-h-[400px]">
              {isLoading ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray mx-auto mb-4"></div>
                  <p className="text-notion-gray text-sm font-medium">Memeriksa pesan baru...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <Mail className="h-8 w-8 text-notion-gray opacity-30 mb-4" />
                  <p className="text-notion-text font-semibold text-[15px]">Tidak ada pesan</p>
                  <p className="text-notion-gray text-sm max-w-xs mt-1 leading-relaxed">Kotak masuk Anda dalam keadaan kosong atau tidak ada pesan yang sesuai pencarian.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#EFEFEF]">
                  {filteredMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-4 hover:bg-stone-50 transition-colors cursor-pointer relative group flex gap-3 ${!msg.is_read ? 'bg-notion-blue_bg' : ''}`}
                    >
                      <div className="flex-1 min-w-0 flex items-start gap-3">
                         <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${!msg.is_read ? 'bg-notion-blue' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className={`text-[15px] truncate ${!msg.is_read ? 'font-semibold text-notion-text' : 'font-medium text-notion-text'}`}>
                              {msg.subject}
                            </h3>
                            <span className="text-xs text-notion-gray whitespace-nowrap ml-4">
                              {new Date(msg.sent_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-notion-gray line-clamp-1 pr-8">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-notion-gray hover:text-notion-red hover:bg-notion-red_bg rounded-sm" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}