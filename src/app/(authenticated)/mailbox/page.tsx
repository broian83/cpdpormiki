'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Mailbox
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full ring-4 ring-red-50">
                {unreadCount} Baru
              </span>
            )}
          </h2>
          <p className="text-slate-500 mt-1">Pesan resmi dan notifikasi sistem dari DPP PORMIKI.</p>
        </div>
        <Link href="/mailbox/compose">
          <Button className="bg-primary hover:bg-primary/90 shadow-md">
            <Send className="w-4 h-4 mr-2" />
            Tulis Pesan Baru
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Mini */}
        <div className="lg:col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start font-bold bg-white border border-slate-200">
            <Inbox className="w-4 h-4 mr-2 text-primary" />
            Kotak Masuk
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:bg-slate-100">
            <Send className="w-4 h-4 mr-2" />
            Terkirim
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:bg-slate-100">
            <Trash2 className="w-4 h-4 mr-2" />
            Sampah
          </Button>
        </div>

        {/* Inbox Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari pesan atau pengirim..." 
              className="pl-10 bg-white border-none shadow-sm focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card className="border-none shadow-md bg-white overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-slate-500">Memeriksa pesan baru...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <Mail className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="text-slate-900 font-bold text-lg">Tidak ada pesan</p>
                  <p className="text-slate-500 max-w-xs mt-1">Kotak masuk Anda dalam keadaan kosong atau tidak ada pesan yang sesuai pencarian.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {filteredMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-5 hover:bg-slate-50/80 transition-all cursor-pointer relative group ${!msg.is_read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!msg.is_read ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm tracking-tight truncate ${!msg.is_read ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}>
                              {msg.subject}
                            </h3>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                              {new Date(msg.sent_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1 group-hover:text-slate-700 transition-colors">
                            {msg.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}