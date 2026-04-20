// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Document {
  id: string
  name: string
  type: string
  uploaded_at: string
}

export default function PrivateAreaPage() {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchDocuments() }, [])

  const fetchDocuments = async () => {
    setIsLoading(false)
    setDocuments([])
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Private Area</h2>
        <p className="text-slate-600">Area dokumen pribadi</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Dokumen Pribadi</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-slate-500">Memuat...</p>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Belum ada dokumen</p>
              <p className="text-sm text-slate-400">Fitur upload dokumen akan segera tersedia</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span>{doc.name}</span>
                  <span className="text-sm text-slate-500">{doc.type}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}