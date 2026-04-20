// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Search, BookOpen, Users, Clock, Edit3, Trash2 } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  status: string
  category: string
  created_at: string
}

export default function AdminLMSPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setCourses(data)
    } catch (error) {
       console.error('Error:', error)
    } finally {
       setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-16 duration-500">
      <div className="pt-6 border-b border-[#EFEFEF] pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Manajemen LMS</h1>
          <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">
            Kelola katalog pelatihan, kursus online, dan monitoring partisipasi peserta.
          </p>
        </div>
        <Button className="bg-notion-blue hover:bg-notion-blue/90 text-white rounded-sm font-medium px-5 h-10 shadow-none">
           <Plus className="w-4 h-4 mr-2" />
           Tambah Kursus Baru
        </Button>
      </div>

      {/* Grid List of Courses */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="p-20 text-center border border-dashed border-[#EFEFEF] rounded-md text-notion-gray">Memproses katalog LMS...</div>
        ) : courses.length === 0 ? (
          <div className="p-20 text-center border border-dashed border-[#EFEFEF] rounded-md text-notion-gray">Belum ada kursus yang dibuat.</div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="border border-[#EFEFEF] bg-white rounded-md overflow-hidden group hover:border-notion-gray/30 transition-all flex flex-col md:flex-row">
              <div className="w-full md:w-56 h-40 bg-stone-100 relative overflow-hidden flex-shrink-0">
                 {course.thumbnail_url ? (
                   <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-notion-gray/30">
                      <BookOpen className="w-12 h-12" />
                   </div>
                 )}
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                 <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-notion-blue bg-notion-blue_bg px-2 py-0.5 rounded-sm">
                          {course.category || 'General'}
                       </span>
                       <span className="text-[11px] font-medium text-notion-gray">Dibuat {new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-notion-text mb-2 group-hover:text-notion-blue transition-colors">
                       {course.title}
                    </h3>
                    <p className="text-[14px] text-notion-gray line-clamp-2 leading-relaxed">
                       {course.description || 'Tidak ada deskripsi tersedia.'}
                    </p>
                 </div>
                 
                 <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EFEFEF]">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-notion-gray" />
                          <span className="text-[13px] font-semibold text-notion-text">254 Peserta</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-notion-gray hover:text-notion-text hover:bg-stone-50 border border-transparent hover:border-[#EFEFEF] transition-all">
                          <Edit3 className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-notion-red hover:bg-notion-red_bg border border-transparent hover:border-notion-red/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
