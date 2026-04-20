// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, MoreHorizontal, UserCheck, Shield } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

interface Profile {
  id: string
  user_id: string
  nama_pmik: string
  nira: string
  str_number: string
  sip_number: string
  dpd: string
  dpc: string
  foto_url: string
  created_at: string
  status_verifikasi?: string // Assuming we have this column
}

export default function AdminMembersPage() {
  const supabase = createClient()
  const [members, setMembers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchMembers()
  }, [page, searchTerm])

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('pmik_profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
      
      if (searchTerm) {
         query = query.or(`nama_pmik.ilike.%${searchTerm}%,nira.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (data) {
        setMembers(data as Profile[])
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Data Member PMIK</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Manajemen database anggota, verifikasi STR/SIP, dan status keaktifan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#EFEFEF] shadow-none rounded-sm font-medium h-10 px-5 text-notion-text hover:bg-stone-50">
             <Filter className="w-4 h-4 mr-2" />
             Filter
          </Button>
          <Button className="bg-notion-blue hover:bg-notion-blue/90 text-white rounded-sm font-medium px-5 h-10 shadow-none">
             <Plus className="w-4 h-4 mr-2" />
             Tambah Member
          </Button>
        </div>
      </div>

      <div className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#EFEFEF] bg-stone-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96 text-[15px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-notion-gray opacity-70" />
              <input 
                type="text" 
                placeholder="Cari nama atau NIRA..." 
                className="w-full h-9 pl-9 pr-4 rounded-sm border border-[#EFEFEF] focus:outline-none focus:border-notion-gray focus:ring-1 focus:ring-notion-gray transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-xs font-medium text-notion-gray bg-white border border-[#EFEFEF] px-3 py-1.5 rounded-sm shadow-sm">
              Menampilkan {members.length} dari total data
           </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-24 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin h-6 w-6 border-b-2 border-notion-gray rounded-full"></div>
              <span className="text-sm text-notion-gray font-medium">Memuat database...</span>
            </div>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F9F9F9] border-b border-[#EFEFEF]">
                <tr>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider w-[350px]">Profil Anggota</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">Registrasi & Lisensi</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider">DPD / DPC</th>
                  <th className="px-5 py-3 font-semibold text-notion-gray uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-[#F9F9F9]/80 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.nama_pmik} src={member.foto_url} size="md" className="border border-[#EFEFEF]" />
                        <div>
                          <div className="font-semibold text-notion-text text-[14px]">{member.nama_pmik || '-'}</div>
                          <div className="text-notion-gray text-xs mt-0.5 font-medium flex items-center gap-1.5">
                            ID: {member.id.substring(0,8)}...
                            <span className="w-1 h-1 rounded-full bg-notion-green"></span>
                            Terdaftar: {formatDate(member.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-bold text-notion-gray uppercase tracking-wider w-8">NIRA</span>
                             <span className="font-medium text-notion-text">{member.nira || 'Belum diisi'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-bold text-notion-gray uppercase tracking-wider w-8">STR</span>
                             <span className="text-notion-text">{member.str_number || 'Belum diisi'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="space-y-1">
                          <div className="font-medium text-notion-text text-sm">{member.dpd || '-'}</div>
                          <div className="text-xs text-notion-gray font-medium">{member.dpc || '-'}</div>
                       </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-notion-gray hover:text-notion-text hover:bg-white border text-transparent border-transparent hover:border-[#EFEFEF] transition-all shadow-none group-hover:border-[#EFEFEF]">
                           <MoreHorizontal className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!isLoading && members.length === 0 && (
          <div className="p-16 text-center text-sm font-medium text-notion-gray">
             Tidak ada member ditemukan.
          </div>
        )}
        
        {/* Simple Pagination Placeholder */}
        <div className="p-4 border-t border-[#EFEFEF] bg-stone-50 flex justify-between items-center text-xs text-notion-gray font-medium">
           <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="h-8 shadow-none border-[#EFEFEF] font-semibold text-xs">Prev</Button>
           <span>Halaman {page}</span>
           <Button variant="outline" onClick={() => setPage(p => p + 1)} className="h-8 shadow-none border-[#EFEFEF] font-semibold text-xs">Next</Button>
        </div>
      </div>
    </div>
  )
}
