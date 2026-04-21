// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Filter, MoreHorizontal, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useConfirmStore } from '@/store/confirm-store'

export default function MasterKegiatanPage() {
  const supabase = createClient()
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // State for Add/Edit Form
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentActivity, setCurrentActivity] = useState({
    kode_kegitan: '',
    nama_kegitan: '',
    deskripsi: '',
    is_active: true
  })

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('activity_categories')
        .select('*')
        .order('kode_kegitan', { ascending: true })

      if (data) setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        kode_kegitan: currentActivity.kode_kegitan,
        nama_kegitan: currentActivity.nama_kegitan,
        deskripsi: currentActivity.deskripsi,
        is_active: currentActivity.is_active
      }

      let error;
      
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('activity_categories')
          .update(payload)
          .eq('id', currentActivity.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('activity_categories')
          .insert([payload])
        error = insertError
      }
      
      if (error) {
        toast.error('Gagal menyimpan: ' + error.message)
      } else {
        toast.success(isEditing ? 'Kegiatan berhasil diperbarui!' : 'Kegiatan baru berhasil ditambahkan!')
        setIsDialogOpen(false)
        fetchActivities()
        resetForm()
      }
    } catch (err) {
      console.error('Error saving activity:', err)
      toast.error('Terjadi kesalahan sistem saat menyimpan.')
    }
  }

  const handleToggleStatus = async (activity) => {
     try {
       const { error } = await supabase
         .from('activity_categories')
         .update({ is_active: !activity.is_active })
         .eq('id', activity.id)
       
       if (error) {
         toast.error('Gagal mengubah status: ' + error.message)
       } else {
         toast.success(`Status ${activity.kode_kegitan} berhasil diubah!`)
         fetchActivities()
       }
     } catch (error) {
       console.error('Error toggling status:', error)
       toast.error('Kesalahan sistem saat mengubah status.')
     }
  }

  const handleDelete = async (activity) => {
    const confirm = useConfirmStore.getState().confirm
    
    confirm({
      title: 'Hapus Kegiatan?',
      message: `Apakah Anda yakin ingin menghapus "${activity.nama_kegitan}"? Seluruh data logbook yang menggunakan kategori ini mungkin terdampak.`,
      confirmLabel: 'Ya, Hapus Data',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('activity_categories')
            .delete()
            .eq('id', activity.id)

          if (error) {
            toast.error('Gagal menghapus: ' + error.message)
          } else {
            toast.success('Kegiatan berhasil dihapus secara permanen.')
            fetchActivities()
          }
        } catch (error) {
           console.error('Error deleting activity:', error)
           toast.error('Kesalahan sistem saat menghapus kegiatan.')
        }
      }
    })
  }

  const resetForm = () => {
    setCurrentActivity({
      kode_kegitan: '',
      nama_kegitan: '',
      deskripsi: '',
      is_active: true
    })
    setIsEditing(false)
  }

  const filteredActivities = activities.filter(a => 
    a.nama_kegitan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.kode_kegitan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text tracking-tight">Master Kegiatan</h1>
          <p className="text-notion-gray text-lg mt-1">Kelola daftar aktivitas dan kode logbook PMIK.</p>
        </div>
        
        <Button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="bg-[#37352f] text-white hover:bg-stone-800 h-10 rounded-md px-6 shadow-sm border-none font-bold"
        >
          <Plus className="w-4 h-4 mr-2 text-white" /> Tambah Kegiatan
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
          <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-hidden">
             <div className="bg-notion-text px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center">
                   <Settings2 className="w-4 h-4 text-white" />
                </div>
                <DialogTitle className="text-white font-serif text-lg">{isEditing ? 'Ubah Kegiatan' : 'Kegiatan Baru'}</DialogTitle>
             </div>
             
             <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-notion-gray">Kode Kegiatan</label>
                   <Input 
                      placeholder="Contoh: A.1" 
                      value={currentActivity.kode_kegitan}
                      onChange={e => setCurrentActivity({...currentActivity, kode_kegitan: e.target.value})}
                      required
                      className="border-[#EFEFEF] rounded-sm focus:ring-notion-blue h-10"
                   />
                </div>
                
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-notion-gray">Nama Kegiatan</label>
                   <Input 
                      placeholder="Masukkan nama aktivitas..." 
                      value={currentActivity.nama_kegitan}
                      onChange={e => setCurrentActivity({...currentActivity, nama_kegitan: e.target.value})}
                      required
                      className="border-[#EFEFEF] rounded-sm focus:ring-notion-blue h-10"
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold uppercase tracking-wider text-notion-gray">Deskripsi (Opsional)</label>
                   <textarea
                      placeholder="Berikan penjelasan singkat mengenai kegiatan ini..."
                      value={currentActivity.deskripsi}
                      onChange={e => setCurrentActivity({...currentActivity, deskripsi: e.target.value})}
                      className="w-full min-h-[100px] p-3 text-sm border border-[#EFEFEF] rounded-sm focus:outline-none focus:border-notion-blue focus:ring-1 focus:ring-notion-blue transition-all"
                   />
                </div>

                <DialogFooter className="pt-4 gap-2">
                   <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-sm">Batal</Button>
                   <Button type="submit" className="bg-notion-blue text-white hover:bg-notion-blue/90 rounded-sm shadow-none min-w-[120px]">
                      {isEditing ? 'Simpan Perubahan' : 'Buat Kegiatan'}
                   </Button>
                </DialogFooter>
             </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards (Mini) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Kegiatan" value={activities.length} color="text-notion-text" />
          <StatCard label="Aktif" value={activities.filter(a => a.is_active).length} color="text-notion-green" />
          <StatCard label="Non-Aktif" value={activities.filter(a => !a.is_active).length} color="text-notion-red" />
      </div>

      {/* Table Area */}
      <div className="bg-white border border-[#EFEFEF] rounded-md shadow-sm overflow-hidden flex flex-col">
          {/* Controls */}
          <div className="p-4 border-b border-[#EFEFEF] flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-50/50">
             <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-notion-gray opacity-50" />
                <input 
                  type="text" 
                  placeholder="Cari kode atau nama..." 
                  className="w-full h-10 pl-10 pr-4 rounded-sm border border-[#EFEFEF] focus:outline-none focus:border-notion-gray focus:ring-1 focus:ring-notion-gray transition-colors text-sm shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="outline" className="h-10 border-[#EFEFEF] hover:bg-white rounded-sm shadow-none text-xs font-bold uppercase tracking-widest text-notion-gray">
                <Filter className="w-3 h-3 mr-2" /> Filter Kategori
             </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-[10px] font-bold uppercase tracking-[0.2em] text-notion-gray border-b border-[#EFEFEF]">
                   <tr>
                      <th className="px-6 py-4">Kode</th>
                      <th className="px-6 py-4">Nama Kegiatan</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFEF]">
                   {isLoading ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-notion-gray italic">Memuat data kegiatan...</td></tr>
                   ) : filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                         <tr key={activity.id} className="hover:bg-stone-50/50 transition-colors group">
                            <td className="px-6 py-4 font-mono font-bold text-notion-text">{activity.kode_kegitan}</td>
                            <td className="px-6 py-4">
                               <div className="font-semibold text-notion-text">{activity.nama_kegitan}</div>
                               <div className="text-xs text-notion-gray mt-0.5 line-clamp-1">{activity.deskripsi || '-'}</div>
                            </td>
                            <td className="px-6 py-4">
                               <button 
                                 onClick={() => handleToggleStatus(activity)}
                                 className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${activity.is_active ? 'bg-notion-green_bg text-notion-green border border-notion-green/10' : 'bg-notion-red_bg text-notion-red border border-notion-red/10'}`}
                               >
                                  {activity.is_active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                  {activity.is_active ? 'AKTIF' : 'NON-AKTIF'}
                               </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 border-[#EFEFEF]"
                                    onClick={() => { setIsEditing(true); setCurrentActivity(activity); setIsDialogOpen(true); }}
                                  >
                                     <Edit2 className="w-3.5 h-3.5 text-notion-gray" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 border-[#EFEFEF] hover:bg-notion-red_bg hover:border-notion-red group/del"
                                    onClick={() => handleDelete(activity)}
                                  >
                                     <Trash2 className="w-3.5 h-3.5 text-notion-gray group-hover/del:text-notion-red" />
                                  </Button>
                               </div>
                               <button className="sm:hidden text-notion-gray"><MoreHorizontal className="w-4 h-4" /></button>
                            </td>
                         </tr>
                      ))
                   ) : (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-notion-gray italic">Tidak ada kegiatan ditemukan.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-[#EFEFEF] p-4 rounded-md shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-wider text-notion-gray mb-1">{label}</div>
      <div className={`text-2xl font-serif font-bold ${color}`}>{value}</div>
    </div>
  )
}
