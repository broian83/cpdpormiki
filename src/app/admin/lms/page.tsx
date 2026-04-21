// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Search, BookOpen, Users, Clock, Edit3, Trash2 } from 'lucide-react'

interface Course {
  id: string
  judul: string
  deskripsi: string
  thumbnail_url: string
  status_publish: boolean
  kategori: string
  created_at: string
  enrollments_count?: { count: number }[]
}

export default function AdminLMSPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    deskripsi: '',
    thumbnail_url: '',
    status_publish: true
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('lms_courses')
        .select(`
          *,
          enrollments:lms_enrollments(count)
        `)
        .order('created_at', { ascending: false })
      
      if (data) setCourses(data)
      if (error) throw error
    } catch (error) {
       console.error('Error:', error)
    } finally {
       setIsLoading(false)
    }
  }

  const handleOpenModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        judul: course.judul,
        kategori: course.kategori || '',
        deskripsi: course.deskripsi || '',
        thumbnail_url: course.thumbnail_url || '',
        status_publish: course.status_publish
      })
    } else {
      setEditingCourse(null)
      setFormData({
        judul: '',
        kategori: 'Pelatihan',
        deskripsi: '',
        thumbnail_url: '',
        status_publish: true
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('lms_courses')
          .update(formData)
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lms_courses')
          .insert([formData])
        if (error) throw error
      }
      setIsModalOpen(false)
      fetchCourses()
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Gagal menyimpan kursus.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kursus ini? Semua data pendaftaran terkait akan hilang.')) return
    try {
      const { error } = await supabase.from('lms_courses').delete().eq('id', id)
      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Gagal menghapus kursus.')
    }
  }

  const togglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('lms_courses')
        .update({ status_publish: !course.status_publish })
        .eq('id', course.id)
      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-2 tracking-tight">Manajemen LMS</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Kelola katalog pelatihan, kursus online, dan monitoring partisipasi peserta.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-notion-text hover:bg-[#201F1C] text-white rounded-md font-medium px-5 h-10 shadow-sm transition-all"
        >
           <Plus className="w-4 h-4 mr-2" />
           Tambah Kursus
        </Button>
      </div>

      {/* Grid List of Courses */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="p-24 text-center border border-[#EFEFEF] bg-white rounded-md text-notion-gray font-medium animate-pulse">
            Menyinkronkan data kurikulum...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-24 text-center border border-dashed border-[#EFEFEF] bg-stone-50/50 rounded-md text-notion-gray flex flex-col items-center">
            <BookOpen className="w-12 h-12 opacity-10 mb-4" />
            <p className="font-medium">Belum ada kursus aktif.</p>
            <Button variant="link" onClick={() => handleOpenModal()} className="mt-2 text-notion-blue">Mulai buat kursus pertama</Button>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden group hover:shadow-md transition-all flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-44 bg-stone-100 relative overflow-hidden flex-shrink-0">
                 {course.thumbnail_url ? (
                   <img src={course.thumbnail_url} alt={course.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-notion-gray/20">
                      <BookOpen className="w-16 h-16" />
                   </div>
                 )}
                 <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${course.status_publish ? 'bg-notion-green_bg text-notion-green border-notion-green/10' : 'bg-notion-red_bg text-notion-red border-notion-red/10'}`}>
                       {course.status_publish ? 'Published' : 'Draft'}
                    </span>
                 </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-notion-blue bg-notion-blue_bg px-2 py-0.5 rounded-sm">
                          {course.kategori || 'Satu Hari'}
                       </span>
                       <span className="text-[11px] font-medium text-notion-gray flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(course.created_at).toLocaleDateString()}
                       </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-notion-text mb-2 group-hover:text-notion-blue transition-colors">
                       {course.judul}
                    </h3>
                    <p className="text-[14px] text-notion-gray line-clamp-2 leading-relaxed">
                       {course.deskripsi || 'Tidak ada deskripsi tersedia untuk kursus ini.'}
                    </p>
                 </div>
                 
                 <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EFEFEF]">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-notion-gray" />
                          <span className="text-[13px] font-semibold text-notion-text">
                            {course.enrollments?.[0]?.count || 0} Peserta
                          </span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Link href={`/admin/lms/${course.id}/modules`}>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-[11px] font-bold text-notion-blue hover:bg-notion-blue_bg"
                         >
                           KELOLA MODUL
                         </Button>
                       </Link>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => togglePublish(course)}
                         className="text-[11px] font-bold text-notion-gray hover:text-notion-text"
                       >
                         {course.status_publish ? 'UNPUBLISH' : 'PUBLISH'}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleOpenModal(course)}
                         className="h-8 w-8 text-notion-gray hover:text-notion-text bg-stone-50 border border-[#EFEFEF]"
                       >
                          <Edit3 className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleDelete(course.id)}
                         className="h-8 w-8 text-notion-red hover:bg-notion-red_bg border border-notion-red/10"
                       >
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-[#EFEFEF] flex justify-between items-center sticky top-0 bg-white z-10">
                 <h2 className="text-xl font-serif font-bold text-notion-text">
                    {editingCourse ? 'Edit Kursus' : 'Buat Kursus Baru'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-notion-gray hover:text-notion-text">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-notion-text">Judul Kursus</label>
                    <input 
                      required
                      className="w-full h-10 px-3 border border-[#EFEFEF] rounded-sm focus:outline-none focus:ring-1 focus:ring-notion-gray"
                      value={formData.judul}
                      onChange={(e) => setFormData({...formData, judul: e.target.value})}
                      placeholder="Contoh: Dasar Manajemen Rekam Medis Eletronik"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-notion-text">Kategori</label>
                       <select 
                         className="w-full h-10 px-3 border border-[#EFEFEF] rounded-sm focus:outline-none focus:ring-1 focus:ring-notion-gray"
                         value={formData.kategori}
                         onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                       >
                          <option value="Pelatihan">Pelatihan</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Webinar">Webinar</option>
                          <option value="Sertifikasi">Sertifikasi</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-notion-text">Thumbnail URL</label>
                       <input 
                         className="w-full h-10 px-3 border border-[#EFEFEF] rounded-sm focus:outline-none focus:ring-1 focus:ring-notion-gray"
                         value={formData.thumbnail_url}
                         onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                         placeholder="https://..."
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-notion-text">Deskripsi</label>
                    <textarea 
                      rows={4}
                      className="w-full p-3 border border-[#EFEFEF] rounded-sm focus:outline-none focus:ring-1 focus:ring-notion-gray"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      placeholder="Jelaskan mengenai tujuan dan materi kursus ini..."
                    />
                 </div>
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="status_publish"
                      checked={formData.status_publish}
                      onChange={(e) => setFormData({...formData, status_publish: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="status_publish" className="text-sm font-medium text-notion-text">Publish kursus ini agar dapat dilihat anggota</label>
                 </div>
                 <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
                    <Button type="submit" className="bg-notion-text text-white">Simpan Kursus</Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
