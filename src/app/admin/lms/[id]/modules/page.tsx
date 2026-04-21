// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2, GripVertical, ChevronLeft, Save, Video, FileText, Link as LinkIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { useConfirmStore } from '@/store/confirm-store'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

interface Module {
  id: string
  judul_modul: string
  urutan: number
  tipe_konten: 'video' | 'pdf' | 'text'
  konten_url: string
}

export default function AdminLmsModulesPage() {
  const { id: courseId } = useParams()
  const supabase = createClient()
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null)
  const [courseTitle, setCourseTitle] = useState('')
  const confirmModal = useConfirmStore(state => state.confirm)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    setIsLoading(true)
    const { data: courseData } = await supabase.from('lms_courses').select('judul').eq('id', courseId).single()
    if (courseData) setCourseTitle(courseData.judul)

    const { data } = await supabase
      .from('lms_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('urutan', { ascending: true })
    
    if (data) setModules(data)
    setIsLoading(false)
  }

  const handleOpenAdd = () => {
    setEditingModule({
      course_id: courseId,
      judul_modul: '',
      urutan: modules.length + 1,
      tipe_konten: 'video',
      konten_url: ''
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (mod: Module) => {
    setEditingModule(mod)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingModule?.judul_modul) return

    try {
        const payload = {
          judul_modul: editingModule.judul_modul,
          urutan: editingModule.urutan,
          tipe_konten: editingModule.tipe_konten,
          konten_url: editingModule.konten_url,
          course_id: courseId
        }

        if (editingModule.id) {
          const { error } = await supabase
            .from('lms_modules')
            .update(payload)
            .eq('id', editingModule.id)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from('lms_modules')
            .insert([payload])
          if (error) throw error
        }
        
        setIsDialogOpen(false)
        fetchData()
        toast.success('Modul berhasil disimpan')
    } catch (err: any) {
        console.error('Error saving module:', err)
        toast.error('Gagal menyimpan modul: ' + (err.message || 'Error tidak diketahui'))
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local state immediately for snappy feel
    const updatedItems = items.map((item, index) => ({
      ...item,
      urutan: index + 1
    }))
    setModules(updatedItems)

    // Update to Supabase
    try {
      const updates = updatedItems.map(item => ({
         id: item.id,
         urutan: item.urutan,
         course_id: courseId,
         judul_modul: item.judul_modul,
         tipe_konten: item.tipe_konten,
         konten_url: item.konten_url
      }))

      const { error } = await supabase
        .from('lms_modules')
        .upsert(updates)
      
      if (error) throw error
      toast.success('Urutan modul diperbarui')
    } catch (err) {
      toast.error('Gagal menyimpan urutan baru')
      fetchData() // Revert to DB state on error
    }
  }

  const handleDelete = async (id: string) => {
    confirmModal({
      title: 'Hapus Modul',
      message: 'Apakah Anda yakin ingin menghapus modul ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Hapus Sekarang',
      variant: 'danger',
      onConfirm: async () => {
        const { error } = await supabase.from('lms_modules').delete().eq('id', id)
        if (error) toast.error('Gagal menghapus modul.')
        else {
          toast.success('Modul berhasil dihapus')
          fetchData()
        }
      }
    })
  }

  if (isLoading) return (
     <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
     </div>
  )

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex items-center gap-4 mb-6">
           <Link href="/admin/lms" className="p-2 hover:bg-stone-50 rounded-md transition-colors border border-[#EFEFEF]">
              <ChevronLeft className="w-4 h-4" />
           </Link>
           <div>
              <div className="text-[10px] font-bold text-notion-blue uppercase tracking-widest mb-1">Manajemen Kurikulum</div>
              <h1 className="text-3xl font-serif font-bold text-notion-text tracking-tight">Kelola Modul</h1>
           </div>
        </div>
        
        <div className="bg-stone-50 border border-[#EFEFEF] p-4 rounded-md flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded border border-[#EFEFEF]">
                 <FileText className="w-5 h-5 text-notion-gray" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-notion-gray uppercase tracking-widest leading-none mb-1">Memberikan akses ke:</p>
                 <h2 className="font-bold text-[15px]">{courseTitle}</h2>
              </div>
           </div>
           <Button onClick={handleOpenAdd} className="bg-notion-text text-white hover:bg-[#201F1C] rounded-sm h-10 px-6 font-bold text-xs tracking-widest uppercase shadow-sm">
             <Plus className="w-4 h-4 mr-2" />
             TAMBAH MODUL
           </Button>
        </div>
      </div>

      {/* Modules List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="space-y-3"
            >
              {modules.length === 0 ? (
                <div className="border border-dashed border-[#EFEFEF] p-16 text-center rounded-lg bg-stone-50/50">
                  <Video className="w-12 h-12 text-notion-gray opacity-10 mx-auto mb-4" />
                  <p className="text-sm font-bold text-notion-gray">Belum ada modul. Klik tombol di atas untuk memulai.</p>
                </div>
              ) : (
                modules.map((mod, index) => (
                  <Draggable key={mod.id} draggableId={mod.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group flex items-center gap-4 p-4 bg-white border border-[#EFEFEF] hover:border-notion-gray/30 transition-all rounded-md shadow-sm",
                          snapshot.isDragging && "shadow-xl border-notion-blue/30 ring-1 ring-notion-blue/10 scale-[1.02] z-50 bg-stone-50"
                        )}
                      >
                        <div {...provided.dragHandleProps} className="p-1 hover:bg-stone-100 rounded cursor-grab active:cursor-grabbing">
                           <GripVertical className="w-4 h-4 text-notion-gray opacity-30 group-hover:opacity-100" />
                        </div>

                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-50 text-[11px] font-black text-notion-gray">
                          {mod.urutan}
                        </div>
                        
                        <div className="w-10 h-10 rounded bg-stone-50 flex items-center justify-center border border-[#EFEFEF] group-hover:bg-white text-notion-blue">
                          {mod.tipe_konten === 'video' ? <Video className="w-5 h-5 opacity-70" /> : 
                           mod.tipe_konten === 'text' ? <FileText className="w-5 h-5 opacity-70" /> : 
                           <LinkIcon className="w-5 h-5 opacity-70" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[15px] truncate">{mod.judul_modul}</h3>
                          <p className="text-[10px] font-bold text-notion-gray uppercase tracking-widest truncate">
                            {mod.tipe_konten} • {mod.konten_url?.substring(0, 40) || 'No Content'}{mod.konten_url?.length > 40 ? '...' : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(mod)} className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4 text-notion-gray" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(mod.id)} className="h-8 w-8 p-0 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-md border-[#EFEFEF]">
          <DialogHeader>
            <DialogTitle className="font-serif font-bold text-xl">{editingModule?.id ? 'Edit Modul' : 'Tambah Modul Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray">Judul Modul</Label>
              <Input 
                value={editingModule?.judul_modul || ''} 
                onChange={e => setEditingModule({...editingModule, judul_modul: e.target.value})}
                placeholder="Contoh: Pengantar RME"
                className="rounded-sm border-[#EFEFEF] focus-visible:ring-1 focus-visible:ring-notion-gray shadow-none h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Tipe Konten"
                  options={[
                    { value: 'video', label: 'Video (Youtube)' },
                    { value: 'pdf', label: 'Document (PDF/Link)' },
                    { value: 'text', label: 'Text Only' },
                  ]}
                  value={editingModule?.tipe_konten} 
                  onChange={e => setEditingModule({...editingModule, tipe_konten: e.target.value})}
                  className="rounded-sm border-[#EFEFEF] shadow-none h-10"
                />
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray">Urutan Tampil</Label>
                 <Input 
                   type="number"
                   value={editingModule?.urutan || ''} 
                   onChange={e => setEditingModule({...editingModule, urutan: parseInt(e.target.value)})}
                   className="rounded-sm border-[#EFEFEF] shadow-none h-10"
                 />
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-notion-gray">
                {editingModule?.tipe_konten === 'text' ? 'Isi Materi / Penjelasan' : 'URL Konten / Video'}
              </Label>
              <div className="relative">
                 {editingModule?.tipe_konten !== 'text' && (
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray opacity-30" />
                 )}
                 {editingModule?.tipe_konten === 'text' ? (
                    <Textarea 
                      value={editingModule?.konten_url || ''} 
                      onChange={e => setEditingModule({...editingModule, konten_url: e.target.value})}
                      placeholder="Tuliskan materi atau penjelasan di sini..."
                      className="rounded-sm border-[#EFEFEF] shadow-none min-h-[150px] leading-relaxed"
                    />
                 ) : (
                    <Input 
                      value={editingModule?.konten_url || ''} 
                      onChange={e => setEditingModule({...editingModule, konten_url: e.target.value})}
                      placeholder={editingModule?.tipe_konten === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                      className="pl-10 rounded-sm border-[#EFEFEF] shadow-none h-10"
                    />
                 )}
              </div>
              <p className="text-[10px] text-notion-gray mt-1">
                {editingModule?.tipe_konten === 'video' && 'Masukkan link Youtube untuk video.'}
                {editingModule?.tipe_konten === 'pdf' && 'Masukkan link Google Drive/Cloud untuk PDF.'}
                {editingModule?.tipe_konten === 'text' && 'Tuliskan materi pembelajaran langsung dalam format teks.'}
              </p>
            </div>

            <div className="pt-4 flex gap-3">
               <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-sm border-[#EFEFEF] h-10 font-bold text-[11px] tracking-widest uppercase">
                  BATAL
               </Button>
               <Button onClick={handleSave} className="flex-1 bg-notion-text text-white hover:bg-[#201F1C] rounded-sm h-10 font-bold text-[11px] tracking-widest uppercase">
                  SIMPAN
               </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
