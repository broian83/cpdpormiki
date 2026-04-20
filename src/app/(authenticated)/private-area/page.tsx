// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Document {
  id: string
  name: string
  type: string
  uploaded_at: string
  size?: string
}

export default function PrivateAreaPage() {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      // Simulasi delay untuk efek loading yang halus
      setTimeout(() => {
        setIsLoading(false)
        setDocuments([])
      }, 500)
    }
    fetchDocuments()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Private Area</h2>
          <p className="text-slate-500 mt-1">Kelola dan simpan dokumen profesional Anda dengan aman.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all duration-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Unggah Dokumen
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Dokumen', value: '0', color: 'bg-blue-50 text-blue-600' },
          { label: 'Penyimpanan Digunakan', value: '0 MB', color: 'bg-purple-50 text-purple-600' },
          { label: 'Batas Penyimpanan', value: '100 MB', color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-2 ${stat.color.split(' ')[1]}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium tracking-wide">Menyiapkan berkas pribadi Anda...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Belum ada dokumen</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Anda belum mengunggah dokumen apapun. Mulai dengan mengunggah ijazah, STR, atau sertifikat kompetensi Anda.
              </p>
              <Button variant="outline" className="mt-8 border-slate-200 hover:bg-slate-50">
                Pelajari Tentang Penyimpanan Aman
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map(doc => (
                <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-0.5">{doc.type} • {doc.size || '0 KB'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-teal-600">
                      Unduh
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600">
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Information Alert */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-xl shadow-indigo-100">
         <div className="relative z-10">
           <h4 className="text-xl font-bold">Butuh Bantuan Navigasi?</h4>
           <p className="text-indigo-100 mt-2 max-w-md">Dokumen yang Anda unggah di sini tidak akan dibagikan kepada siapapun kecuali Anda melampirkannya pada permohonan STR atau Logbook.</p>
         </div>
         <div className="flex gap-3 relative z-10">
           <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold px-6">
             Hubungi Support
           </Button>
         </div>
         {/* Simple background decoration */}
         <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50 shadow-inner"></div>
         <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-20 h-20 bg-indigo-700 rounded-full opacity-30 shadow-inner"></div>
      </div>
    </div>
  )
}