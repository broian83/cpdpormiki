// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Building2, 
  MapPin, 
  Phone,
  ArrowLeft,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface DirectoryEntry {
  id: string
  name: string
  address: string
  contact_1: string
  contact_2: string
}

export default function AdminDirectoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<DirectoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    contact_1: '',
    contact_2: ''
  })

  useEffect(() => {
    fetchDirectory()
  }, [])

  const fetchDirectory = async () => {
    setIsLoading(true)
    try {
      const { data: res } = await supabase
        .from('pormiki_directory')
        .select('*')
        .order('name', { ascending: true })

      if (res) setData(res)
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengambil data direktori')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setFormData({ id: '', name: '', address: '', contact_1: '', contact_2: '' })
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: DirectoryEntry) => {
    setFormData(item)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact_1) {
      toast.error('Nama dan Kontak Utama wajib diisi')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('pormiki_directory')
          .update({
            name: formData.name,
            address: formData.address,
            contact_1: formData.contact_1,
            contact_2: formData.contact_2,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id)

        if (error) throw error
        toast.success('Direktori diperbarui')
      } else {
        const { error } = await supabase
          .from('pormiki_directory')
          .insert({
            name: formData.name,
            address: formData.address,
            contact_1: formData.contact_1,
            contact_2: formData.contact_2
          })

        if (error) throw error
        toast.success('Unit baru ditambahkan')
      }
      setIsModalOpen(false)
      fetchDirectory()
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat menyimpan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!isDeletingId) return
    try {
      const { error } = await supabase
        .from('pormiki_directory')
        .delete()
        .eq('id', isDeletingId)

      if (error) throw error
      toast.success('Data dihapus')
      setIsDeletingId(null)
      fetchDirectory()
    } catch (err) {
      console.error(err)
      toast.error('Gagal menghapus data')
    }
  }

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Admin Header */}
      <div className="flex flex-col gap-6 pt-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-notion-gray hover:text-notion-text transition-colors w-fit group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-notion-text flex items-center gap-4">
              Manajemen Direktori
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Live</span>
            </h1>
            <p className="text-sm text-notion-gray font-medium mt-1">Kelola daftar kontak pengurus DPD/DPC PORMIKI.</p>
          </div>
          
          <Button 
            onClick={handleOpenAdd}
            className="bg-notion-text text-white hover:bg-stone-800 h-12 px-6 rounded-md font-black uppercase text-[10px] tracking-widest shadow-md transition-all active:scale-95"
          >
            <Plus size={18} className="mr-2" /> Tambah Unit Daerah
          </Button>
        </div>
      </div>

      {/* Stats Mini Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EFEFEF] p-5 rounded-md shadow-sm">
          <p className="text-[9px] font-black text-notion-gray uppercase tracking-widest mb-1">Total Unit Terdaftar</p>
          <p className="text-2xl font-serif font-bold text-notion-text">{data.length} <span className="text-xs font-sans font-medium text-notion-gray">Wilayah</span></p>
        </div>
        <div className="bg-white border border-[#EFEFEF] p-5 rounded-md shadow-sm">
          <p className="text-[9px] font-black text-notion-gray uppercase tracking-widest mb-1">Status Database</p>
          <div className="flex items-center gap-2 text-emerald-600">
             <CheckCircle2 size={16} />
             <span className="text-sm font-bold">Sinkronisasi OK</span>
          </div>
        </div>
        <div className="bg-white border border-[#EFEFEF] p-5 rounded-md shadow-sm relative overflow-hidden group">
          <Search className="absolute right-[-10px] bottom-[-10px] w-20 h-20 opacity-[0.03] group-focus-within:scale-110 transition-transform" />
          <p className="text-[9px] font-black text-notion-gray uppercase tracking-widest mb-2">Cari Cepat</p>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-none bg-stone-50 focus-visible:ring-0 text-xs font-medium"
            placeholder="Ketik wilayah..."
          />
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-[#EFEFEF]">
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Unit Wilayah</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest">Informasi Kontak</th>
                <th className="px-6 py-4 text-[10px] font-black text-notion-gray uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEFEF]">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-text"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Sinkronisasi...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center opacity-40 italic text-sm">
                    Belum ada data unit daerah.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-notion-text">{item.name}</span>
                        <div className="flex items-start gap-1 text-[11px] text-notion-gray max-w-xs">
                          <MapPin size={12} className="mt-0.5 shrink-0 opacity-40" />
                          <span className="line-clamp-1">{item.address || 'Alamat belum diset'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-notion-gray uppercase tracking-tighter">Kontak 1</span>
                          <span className="text-[11px] font-bold">{item.contact_1}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-notion-gray uppercase tracking-tighter">Kontak 2</span>
                          <span className="text-[11px] font-bold">{item.contact_2 || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(item)}
                          className="h-8 w-8 p-0 rounded-md hover:bg-white hover:border-[#EFEFEF] hover:shadow-sm"
                        >
                          <Pencil size={14} className="text-notion-text" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsDeletingId(item.id)}
                          className="h-8 w-8 p-0 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-lg bg-white z-[99999]">
          <div className="p-6 bg-stone-50 border-b border-[#EFEFEF] flex justify-between items-center">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-notion-text">
                {isEditing ? 'Perbarui Data Unit' : 'Tambah Unit Wilayah Baru'}
              </DialogTitle>
            </DialogHeader>
            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-md transition-all text-notion-gray opacity-40">
              <X size={18} />
            </button>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray ml-1">Nama DPD/DPC</Label>
              <Input 
                placeholder="Contoh: DPD PORMIKI Jawa Barat"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-11 rounded-md border-2 border-stone-100 focus-visible:ring-0 focus-visible:border-notion-text font-medium text-sm transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray ml-1">Alamat Lengkap</Label>
              <Input 
                placeholder="Alamat kantor sekretariat..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="h-11 rounded-md border-2 border-stone-100 focus-visible:ring-0 focus-visible:border-notion-text font-medium text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray ml-1">Kontak Utama 1</Label>
                <Input 
                  placeholder="08XXX / Nama"
                  value={formData.contact_1}
                  onChange={(e) => setFormData({...formData, contact_1: e.target.value})}
                  className="h-11 rounded-md border-2 border-stone-100 focus-visible:ring-0 focus-visible:border-notion-text font-medium text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray ml-1">Kontak Utama 2</Label>
                <Input 
                  placeholder="08XXX / Nama"
                  value={formData.contact_2}
                  onChange={(e) => setFormData({...formData, contact_2: e.target.value})}
                  className="h-11 rounded-md border-2 border-stone-100 focus-visible:ring-0 focus-visible:border-notion-text font-medium text-sm transition-all"
                />
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-md p-4 flex gap-3 border border-amber-100">
               <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-800 leading-relaxed font-medium">Pastikan format penulisan kontak adalah: <strong>[NO HP] / [NAMA]</strong> agar mudah dibaca oleh anggota.</p>
            </div>
          </div>

          <DialogFooter className="p-6 bg-stone-50 border-t border-[#EFEFEF]">
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-notion-text text-white hover:bg-stone-800 h-12 rounded-md font-black uppercase text-[10px] tracking-widest transition-all"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!isDeletingId} onOpenChange={() => setIsDeletingId(null)}>
        <DialogContent className="max-w-sm p-8 text-center bg-white border-none shadow-2xl rounded-lg z-[99999]">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-notion-text mb-2">Hapus Unit Wilayah?</h3>
          <p className="text-sm text-notion-gray mb-8">Data yang dihapus tidak dapat dikembalikan. Lanjutkan?</p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => setIsDeletingId(null)} className="h-11 text-[10px] font-black uppercase tracking-widest rounded-md">Batal</Button>
            <Button onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600 text-white h-11 text-[10px] font-black uppercase tracking-widest rounded-md">Ya, Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
