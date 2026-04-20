// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('messages').select('*').eq('receiver_id', session.user.id).order('sent_at', { ascending: false }).limit(20)
    if (data) setMessages(data)
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return
    await supabase.from('messages').delete().eq('id', id)
    fetchMessages()
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mailbox / Pesan</h2>
          <p className="text-slate-600">Kelola pesan masuk</p>
        </div>
        <Link href="/mailbox/compose"><Button>+ Tulis Pesan</Button></Link>
      </div>
      <Card>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada pesan</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {messages.map(msg => (
                <div key={msg.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{msg.subject}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{msg.body}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(msg.sent_at).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={msg.is_read ? 'default' : 'info'}>{msg.is_read ? 'Dibaca' : 'Baru'}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(msg.id)}>Hapus</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}