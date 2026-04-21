// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Phone, 
  User,
  Building2,
  ExternalLink
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

interface DirectoryEntry {
  id: string
  name: string
  address: string
  contact_1: string
  contact_2: string
}

export default function DirectoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<DirectoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const formatWhatsAppLink = (contact: string) => {
    const number = contact.split('/')[0].trim()
    // Bersihkan nomor: hapus spasi, strip, dll.
    const cleanNumber = number.replace(/\D/g, '')
    // Jika mulai dengan 0, ganti dengan 62 (Indonesia)
    const formattedNumber = cleanNumber.startsWith('0') 
      ? '62' + cleanNumber.slice(1) 
      : cleanNumber
    
    return `https://wa.me/${formattedNumber}`
  }

  useEffect(() => {
    fetchDirectory()
  }, [])

  const fetchDirectory = async () => {
    setIsLoading(true)
    try {
      const { data: res, error } = await supabase
        .from('pormiki_directory')
        .select('*')
        .order('name', { ascending: true })

      if (res) setData(res)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return (
    <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-200"></div>
      <span className="text-[10px] font-black text-notion-gray uppercase tracking-widest">Memuat Direktori...</span>
    </div>
  )

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-6 pt-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-notion-gray hover:text-notion-text transition-colors w-fit group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Kembali</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-notion-text">Direktori DPD/DPC</h1>
            <p className="text-sm text-notion-gray font-medium mt-1">Daftar kontak pengurus PORMIKI di seluruh Indonesia.</p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray opacity-40 group-focus-within:text-notion-text transition-colors" />
            <Input 
              placeholder="Cari Wilayah..." 
              className="pl-12 bg-white border-[#EFEFEF] rounded-md h-12 focus-visible:ring-0 focus-visible:border-notion-text shadow-sm text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-[#EFEFEF]">
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest w-16">No.</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Nama DPD/DPC</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Alamat Sekretariat</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Kontak Utama 1</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Kontak Utama 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEFEF]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Building2 size={40} className="mb-2" />
                      <p className="text-sm font-bold uppercase tracking-widest">Data Tidak Ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5 text-xs font-black text-notion-gray">{index + 1}.</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-notion-text group-hover:bg-white transition-colors border border-transparent group-hover:border-[#EFEFEF]">
                          <Building2 size={16} />
                        </div>
                        <span className="text-sm font-bold text-notion-text">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MapPin size={14} className="mt-0.5 text-stone-300 shrink-0" />
                        <span className="text-xs text-notion-gray leading-relaxed">{item.address || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <a 
                          href={formatWhatsAppLink(item.contact_1)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-notion-text hover:text-emerald-600 transition-colors group/link"
                        >
                          <div className="w-5 h-5 flex items-center justify-center text-emerald-500 group-hover/link:scale-110 transition-transform">
                            <WhatsAppIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold border-b border-transparent group-hover/link:border-emerald-200">
                            {item.contact_1.split('/')[0]}
                          </span>
                        </a>
                        {item.contact_1.includes('/') && (
                          <div className="flex items-center gap-2 text-notion-gray translate-x-[24px]">
                            <span className="text-[10px] uppercase font-black tracking-tighter opacity-50">{item.contact_1.split('/')[1]}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        {item.contact_2 ? (
                          <>
                            <a 
                              href={formatWhatsAppLink(item.contact_2)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-notion-text hover:text-blue-600 transition-colors group/link"
                            >
                              <div className="w-5 h-5 flex items-center justify-center text-blue-500 group-hover/link:scale-110 transition-transform">
                                <WhatsAppIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold border-b border-transparent group-hover/link:border-blue-200">
                                {item.contact_2.split('/')[0]}
                              </span>
                            </a>
                            {item.contact_2.includes('/') && (
                              <div className="flex items-center gap-2 text-notion-gray translate-x-[24px]">
                                <span className="text-[10px] uppercase font-black tracking-tighter opacity-50">{item.contact_2.split('/')[1]}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-notion-gray opacity-40">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-md flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
            <User size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-0.5">Informasi Keanggotaan Lokal</p>
            <p className="text-xs text-emerald-700/80 font-medium">Data di atas diperbarui secara berkala oleh Admin Pusat. Hubungi kontak di atas untuk urusan verifikasi berkas daerah.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
