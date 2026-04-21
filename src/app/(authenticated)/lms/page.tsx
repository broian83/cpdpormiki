// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, GraduationCap, PlayCircle, Star, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Course {
  id: string
  judul: string
  kategori: string | null
  deskripsi: string | null
  thumbnail_url?: string
}

interface Enrollment {
  course_id: string
  progress_percent: number
  status: string
}

export default function LmsPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [coursesRes, enrollRes] = await Promise.all([
        supabase.from('lms_courses').select('*').eq('status_publish', true).order('created_at', { ascending: false }),
        supabase.from('lms_enrollments').select('course_id, progress_percent, status').eq('user_id', session.user.id)
      ])

      if (coursesRes.data) setCourses(coursesRes.data)
      if (enrollRes.data) setEnrollments(enrollRes.data)
    } catch (error) {
      console.error('Error fetching LMS data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase.from('lms_enrollments').insert({
        user_id: session.user.id,
        course_id: courseId,
        status: 'enrolled',
        progress_percent: 0
      })
      
      if (error) throw error
      fetchCourses()
    } catch (error) {
      console.error('Enrollment error:', error)
      alert('Gagal mendaftar kursus. Silakan coba lagi.')
    }
  }

  const isEnrolled = (courseId: string) => enrollments.some(e => e.course_id === courseId)
  const getProgress = (courseId: string) => enrollments.find(e => e.course_id === courseId)?.progress_percent || 0

  const filteredCourses = courses.filter(c => 
    c.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.kategori?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-notion-gray"></div>
    </div>
  )

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="pt-6 border-b border-[#EFEFEF] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-notion-gray font-medium text-[11px] uppercase tracking-[0.2em] mb-3">
              <GraduationCap className="w-4 h-4 opacity-70" />
              <span>Digital Learning Center</span>
            </div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Katalog Kursus</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Tingkatkan keahlian rekam medis Anda dengan materi pilihan kami.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray opacity-50" />
              <Input 
                placeholder="Cari kursus..." 
                className="pl-9 bg-white border-[#EFEFEF] rounded-sm focus-visible:ring-1 focus-visible:ring-notion-gray focus-visible:border-transparent shadow-none h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="border border-[#EFEFEF] bg-stone-50 p-20 text-center rounded-md">
          <div className="flex flex-col items-center max-w-xs mx-auto">
            <BookOpen className="h-12 w-12 text-notion-gray opacity-10 mb-4" />
            <h3 className="text-sm font-semibold text-notion-text mb-1">Belum ada kursus tersedia</h3>
            <p className="text-xs text-notion-gray leading-relaxed">Maaf, saat ini tidak ada kursus yang sesuai dengan kriteria pencarian Anda.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="group border border-[#EFEFEF] hover:shadow-md hover:border-notion-gray/20 transition-all duration-300 rounded-md overflow-hidden bg-white flex flex-col h-full">
              <div className="aspect-video relative overflow-hidden bg-stone-100 border-b border-[#EFEFEF]">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.judul}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-notion-gray/10">
                    <BookOpen className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur-sm text-notion-blue border border-notion-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                    {course.kategori || 'Medis'}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-notion-yellow mb-3">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-notion-gray text-[10px] font-bold ml-1 tracking-tighter opacity-50">4.9/5.0</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-notion-text line-clamp-2 mb-2 group-hover:text-notion-blue transition-colors leading-tight">
                  {course.judul}
                </h3>
                <p className="text-sm text-notion-gray line-clamp-2 mb-6 leading-relaxed flex-1 opacity-80">
                  {course.deskripsi || 'Pelajari standar kompetensi terbaru dalam manajemen informasi kesehatan.'}
                </p>
                
                <div className="flex items-center gap-4 py-4 border-t border-[#EFEFEF] mb-4">
                  <div className="flex items-center gap-1.5 text-notion-gray">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Terpadu</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-notion-gray">
                    <PlayCircle className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">Multimedia</span>
                  </div>
                </div>

                {isEnrolled(course.id) ? (
                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-notion-gray">
                      <span>Proses</span>
                      <span className="text-notion-blue">{getProgress(course.id)}%</span>
                    </div>
                    <div className="h-1 w-full bg-[#F5F5F5] rounded-full overflow-hidden mb-3">
                      <div 
                        className="h-full bg-notion-blue transition-all duration-1000 shadow-[0_0_8px_rgba(55,114,255,0.3)]" 
                        style={{ width: `${getProgress(course.id)}%` }}
                      ></div>
                    </div>
                    <Link href={`/lms/${course.id}`} className="block w-full">
                      <Button className="w-full bg-white text-notion-text border border-[#EFEFEF] hover:bg-stone-50 shadow-none rounded-sm h-10 font-bold text-xs tracking-widest uppercase">
                        Lanjutkan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button className="w-full bg-notion-text text-white hover:bg-[#201F1C] shadow-sm rounded-sm h-10 font-bold text-xs tracking-widest uppercase mt-auto" onClick={() => handleEnroll(course.id)}>
                    Daftar Sekarang
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Banner */}
      <div className="bg-notion-blue_bg border border-[#EFEFEF] rounded-md p-8 md:p-10 flex gap-6 md:gap-10 items-center justify-between">
         <div className="max-w-2xl">
           <h3 className="font-serif font-semibold text-xl text-notion-text mb-3">Butuh Sertifikat Kompetensi Khusus?</h3>
           <p className="text-sm text-notion-gray leading-relaxed mb-6">
             Ikuti program pelatihan intensif kami dan dapatkan sertifikat yang diakui secara nasional untuk menunjang karier Anda. Modul disesuaikan dengan standar regulasi terkini.
           </p>
           <Button className="bg-white border border-[#EFEFEF] text-notion-text hover:bg-stone-50 rounded-sm font-medium shadow-none h-9 px-5">
             Lihat Program Spesialisasi
           </Button>
         </div>
         <div className="hidden md:flex p-6 bg-white border border-[#EFEFEF] rounded-md shadow-sm">
            <GraduationCap className="w-10 h-10 text-notion-blue" />
         </div>
      </div>
    </div>
  )
}