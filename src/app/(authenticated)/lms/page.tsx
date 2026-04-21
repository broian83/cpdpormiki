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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-notion-gray font-medium text-[11px] uppercase tracking-[0.2em] mb-3">
              <GraduationCap className="w-4 h-4 opacity-70" />
              <span>Digital Learning Center</span>
            </div>
            <h1 className="text-4xl font-serif font-black text-notion-text mb-4 tracking-tight">Katalog Kursus</h1>
            <p className="text-notion-gray text-base max-w-2xl leading-relaxed">Tingkatkan keahlian rekam medis Anda dengan materi pilihan kami.</p>
          </div>
          
          <div className="w-full lg:w-auto shrink-0">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray opacity-50" />
              <Input 
                placeholder="Cari materi e-learning..." 
                className="pl-11 bg-white border-[#EFEFEF] rounded-md h-12 shadow-sm focus-visible:ring-0 focus-visible:border-notion-text text-sm font-bold placeholder:text-stone-300 transition-all font-mono w-full"
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
                  <span className="bg-white text-notion-text shadow-sm border border-[#EFEFEF] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">
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
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-t border-[#EFEFEF] mb-4">
                  <div className="flex items-center gap-1.5 text-notion-gray shrink-0">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Terpadu</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-notion-gray shrink-0">
                    <PlayCircle className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Multimedia</span>
                  </div>
                </div>

                {isEnrolled(course.id) ? (
                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-notion-gray">
                      <span>Proses Terpantau</span>
                      <span className="text-emerald-600">{getProgress(course.id)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-3 border border-stone-200">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${getProgress(course.id)}%` }}
                      />
                    </div>
                    <Link href={`/lms/${course.id}`} className="block w-full">
                      <Button variant="secondary" className="w-full h-11 font-bold text-[10px] tracking-widest uppercase mt-2 whitespace-nowrap">
                        Lanjutkan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button variant="default" className="w-full h-11 font-bold text-[10px] tracking-widest uppercase mt-auto whitespace-nowrap" onClick={() => handleEnroll(course.id)}>
                    Daftar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Banner Boxy */}
      <div className="bg-white border border-[#EFEFEF] shadow-sm rounded-md p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between mt-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 bg-stone-50 rounded-bl-full -mr-16 -mt-16 z-0" />
         <div className="max-w-2xl relative z-10 text-center md:text-left">
           <h3 className="font-serif font-black text-2xl text-notion-text mb-2">Program Spesialisasi.</h3>
           <p className="text-sm text-notion-gray font-medium leading-relaxed mb-6">
             Wujudkan karir maksimal dengan program magang virtual dan dapatkan sertifikat level regional. Modul disesuaikan standar PMIK 2026.
           </p>
           <Button variant="default" className="px-8 h-12 font-bold text-[10px] tracking-widest uppercase">
             Lihat Silabus Lengkap
           </Button>
         </div>
         <div className="hidden md:flex relative z-10 w-24 h-24 bg-stone-100 border border-[#EFEFEF] rounded-md shadow-sm items-center justify-center -rotate-6 hover:rotate-0 transition-transform">
            <GraduationCap className="w-10 h-10 text-notion-gray mix-blend-multiply" />
         </div>
      </div>
    </div>
  )
}