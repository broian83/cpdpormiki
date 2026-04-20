// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Article {
  id: string
  judul: string
  slug: string
  isi: string
  kategori: string | null
}

export default function HelpPage() {
  const supabase = createClient()
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchArticles() }, [])

  const fetchArticles = async () => {
    const { data } = await supabase.from('help_articles').select('*').eq('is_published', true).order('updated_at', { ascending: false })
    if (data) {
      setArticles(data)
      if (data.length > 0) setSelectedArticle(data[0])
    }
    setIsLoading(false)
  }

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Help / Bantuan</h2>
        <p className="text-slate-600">Pusat bantuan dan FAQ</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader><CardTitle>Daftar Artikel</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {articles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-4 hover:bg-slate-50 ${selectedArticle?.id === article.id ? 'bg-teal-50' : ''}`}
                  >
                    <p className="font-medium text-slate-900">{article.judul}</p>
                    {article.kategori && <p className="text-xs text-slate-500">{article.kategori}</p>}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedArticle ? (
            <Card>
              <CardHeader><CardTitle>{selectedArticle.judul}</CardTitle></CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.isi.replace(/\n/g, '<br />') }} />
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="p-8 text-center text-slate-500">Pilih artikel untuk membaca</CardContent></Card>
          )}
        </div>
      </div>
    </div>
  )
}