// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Eye, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

interface LogbookOverview {
  id: string
  user_id: string
  tahun: number
  bulan: number
  status_draft: boolean
  created_at: string
  profiles: {
    nama_pmik: string
    nira: string
    foto_url: string
  }
}

export default function AdminLogbookPage() {
  const supabase = createClient()
  const [logbooks, setLogbooks] = useState<LogbookOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLogbooks()
  }, [])

  const fetchLogbooks = async () => {
    setIsLoading(true)
    try {
      // Query to get monthly_logbooks with profile info
      const { data, error } = await supabase
        .from('monthly_logbooks')
        .select(`
          id, user_id, tahun, bulan, status_draft, created_at,
          pmik_profiles:user_id (nama_pmik, nira, foto_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) {
        setLogbooks(data as any)
      }
    } catch (error) {
      console.error('Error fetching logbooks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogbooks = logbooks.filter(lb => 
    lb.pmik_profiles?.nama_pmik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lb.pmik_profiles?.nira?.includes(searchTerm)
  )

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      {/* Header section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Verifikasi Logbook</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Monitor dan tinjau submisi logbook kegiatan dari seluruh anggota PMIK.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#EFEFEF] shadow-none rounded-sm font-medium h-10 px-5 text-notion-text hover:bg-stone-50">
             <Filter className="w-4 h-4 mr-2" />
             Filter Status
          </Button>
        </div>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
           <div className="flex items-center gap-2 text-notion-gray mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Review</span>
           </div>
           <p className="text-2xl font-serif font-semibold">124</p>
        </div>
        <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
           <div className="flex items-center gap-2 text-notion-green mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Tervalidasi</span>
           </div>
           <p className="text-2xl font-serif font-semibold">856</p>
        </div>
        <div className="border border-[#EFEFEF] p-5 rounded-md bg-white">
           <div className="flex items-center gap-2 text-notion-red mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Perlu Revisi</span>
           </div>
           <p className="text-2xl font-serif font-semibold">12</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50">
           <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-notion-gray opacity-70" />
              <input 
                type="text" 
                placeholder="Cari nama member..." 
                className="w-full h-9 pl-9 pr-4 rounded-sm border border-[#EFEFEF] focus:outline-none focus:border-notion-gray focus:ring-1 focus:ring-notion-gray transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin h-6 w-6 border-b-2 border-notion-gray rounded-full"></div>
              <span className="text-sm text-notion-gray">Memuat data logbook...</span>
            </div>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F9F9F9] border-b border-[#EFEFEF]">
                <tr>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Member</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Periode</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Tanggal Submit</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {filteredLogbooks.map((lb) => (
                  <tr key={lb.id} className="hover:bg-[#F9F9F9]/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={lb.pmik_profiles?.nama_pmik} src={lb.pmik_profiles?.foto_url} size="sm" />
                        <div>
                          <div className="font-semibold text-notion-text">{lb.pmik_profiles?.nama_pmik || 'Unknown Member'}</div>
                          <div className="text-[11px] text-notion-gray font-medium">NIRA: {lb.pmik_profiles?.nira || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <span className="font-medium text-notion-text">
                         {lb.bulan}/{lb.tahun}
                       </span>
                    </td>
                    <td className="px-5 py-4">
                       <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${lb.status_draft ? 'bg-stone-100 text-notion-gray' : 'bg-notion-green_bg text-notion-green border border-notion-green/10'}`}>
                         {lb.status_draft ? 'Draft' : 'Submitted'}
                       </span>
                    </td>
                    <td className="px-5 py-4 text-notion-gray">
                       {formatDate(lb.created_at)}
                    </td>
                    <td className="px-5 py-4 text-center">
                       <Button variant="ghost" size="sm" className="h-8 gap-2 text-notion-blue hover:bg-notion-blue_bg shadow-none rounded-sm border border-transparent hover:border-notion-blue/20 transition-all font-semibold">
                          <Eye className="w-3.5 h-3.5" />
                          Detail Review
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!isLoading && filteredLogbooks.length === 0 && (
          <div className="p-16 text-center text-sm font-medium text-notion-gray">
             Belum ada submisi logbook untuk saat ini.
          </div>
        )}
      </div>
    </div>
  )
}
