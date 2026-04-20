// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { FileUp, File, ShieldAlert, Download, Trash2 } from 'lucide-react'

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
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Private Area</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
              Kelola dan simpan dokumen profesional Anda dengan aman, tersedia kapanpun dibutuhkan.
            </p>
          </div>
          <Button className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm h-9 px-5 font-medium shadow-none transition-colors">
            <FileUp className="w-4 h-4 mr-2" />
            Unggah Dokumen
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Dokumen', value: '0', color: 'bg-stone-50 border-[#EFEFEF]' },
          { label: 'Penyimpanan Digunakan', value: '0 MB', color: 'bg-stone-50 border-[#EFEFEF]' },
          { label: 'Batas Penyimpanan', value: '100 MB', color: 'bg-stone-50 border-[#EFEFEF]' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-md border text-left flex flex-col justify-between min-h-[100px] ${stat.color}`}>
              <span className="text-sm text-notion-gray font-medium mb-3">{stat.label}</span>
              <span className="text-2xl font-semibold text-notion-text">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#EFEFEF] pb-2 mb-4">
          <File className="w-5 h-5 text-notion-text opacity-70" />
          <h2 className="text-xl font-serif font-semibold text-notion-text">Sistem Berkas</h2>
        </div>
        
        <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray mb-4"></div>
              <p className="text-sm text-notion-gray font-medium">Memuat berkas...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-sm flex items-center justify-center border border-[#EFEFEF] mb-6">
                 <File className="w-8 h-8 text-notion-gray opacity-50" />
              </div>
              <h3 className="text-[15px] font-semibold text-notion-text mb-2">Belum ada dokumen</h3>
              <p className="text-sm text-notion-gray max-w-sm mx-auto mb-6 leading-relaxed">
                Anda belum mengunggah dokumen apapun. Mulai dengan mengunggah ijazah, STR, atau sertifikat kompetensi Anda.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#EFEFEF]">
              {documents.map(doc => (
                <div key={doc.id} className="p-4 hover:bg-stone-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="opacity-60 text-notion-blue">
                       <File className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[15px] text-notion-text">{doc.name}</p>
                      <p className="text-xs text-notion-gray font-medium mt-0.5 uppercase tracking-wider">{doc.type} • {doc.size || '0 KB'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="h-8 border-[#EFEFEF] text-notion-text hover:bg-stone-100 shadow-none rounded-sm">
                      <Download className="w-3 h-3 mr-1" /> Unduh
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#EFEFEF] text-notion-red hover:bg-notion-red_bg shadow-none rounded-sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Information Alert (Notion Callout) */}
      <div className="bg-notion-blue_bg border border-[#EFEFEF] rounded-md p-5 flex gap-3 text-notion-text">
         <div className="text-notion-blue mt-0.5">
           <ShieldAlert className="w-5 h-5" />
         </div>
         <div>
           <h4 className="font-medium text-[15px] mb-1">Penyimpanan Aman Terenkripsi</h4>
           <p className="text-sm text-notion-gray leading-relaxed max-w-2xl">
             Dokumen yang Anda unggah di Private Area bersifat rahasia dan tidak akan dibagikan kepada siapapun kecuali Anda secara spesifik melampirkannya pada permohonan layanan.
           </p>
         </div>
      </div>
    </div>
  )
}