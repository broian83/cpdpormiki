// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, GraduationCap, PlayCircle, Star, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Course {
  id: string
  judul: string
  kategori: string | null
  deskripsi: string | null
  image_url?: string
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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const [coursesRes, enrollRes] = await Promise.all([
      supabase.from('lms_courses').select('*').eq('status_publish', true).order('created_at', { ascending: false }),
      supabase.from('lms_enrollments').select('course_id, progress_percent, status').eq('user_id', session.user.id)
    ])

    if (coursesRes.data) setCourses(coursesRes.data)
    if (enrollRes.data) setEnrollments(enrollRes.data)
    setIsLoading(false)
  }

  const handleEnroll = async (courseId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.from('lms_enrollments').insert({
      user_id: session.user.id,
      course_id: courseId,
      status: 'enrolled',
      progress_percent: 0
    })
    fetchCourses()
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
            <div className="flex items-center gap-2 text-notion-gray font-medium text-xs uppercase tracking-widest mb-3">
              <GraduationCap className="w-4 h-4 opacity-70" />
              <span>Digital Learning Center</span>
            </div>
            <h1 className="text-4xl font-serif font-semibold text-notion-text mb-4 tracking-tight">Katalog Kursus</h1>
            <p className="text-notion-gray text-lg max-w-2xl leading-relaxed">Tingkatkan keahlian rekam medis Anda dengan materi pilihan kami.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-notion-gray" />
              <Input 
                placeholder="Cari kursus..." 
                className="pl-9 bg-white border-[#EFEFEF] rounded-sm focus-visible:ring-0 focus-visible:border-notion-gray shadow-none h-9 text-[15px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-sm border-[#EFEFEF] h-9 px-3 hover:bg-stone-50 shadow-none">
              <Filter className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="border border-[#EFEFEF] bg-stone-50 p-20 text-center rounded-md">
          <div className="flex flex-col items-center max-w-xs mx-auto">
            <BookOpen className="h-10 w-10 text-notion-gray opacity-30 mb-4" />
            <h3 className="text-[15px] font-semibold text-notion-text mb-2">Belum ada kursus</h3>
            <p className="text-sm text-notion-gray leading-relaxed">Maaf, saat ini tidak ada kursus yang tersedia atau sesuai dengan pencarian Anda.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="group border border-[#EFEFEF] hover:shadow-sm hover:border-notion-gray/30 transition-all duration-300 rounded-md overflow-hidden bg-white flex flex-col h-full">
              <div className="aspect-video relative overflow-hidden bg-stone-100 border-b border-[#EFEFEF]">
                <img 
                  src={course.image_url || `https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800`} 
                  alt={course.judul}
                  className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-notion-text border border-[#EFEFEF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-sm">
                    {course.kategori || 'Medis'}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-notion-orange mb-3">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-notion-gray text-[11px] font-medium ml-1">(4.9)</span>
                </div>
                <h3 className="text-[15px] font-semibold text-notion-text line-clamp-2 mb-2 group-hover:text-notion-blue transition-colors leading-tight">
                  {course.judul}
                </h3>
                <p className="text-sm text-notion-gray line-clamp-2 mb-6 leading-relaxed flex-1">
                  {course.deskripsi || 'Pelajari standar kompetensi terbaru dalam manajemen informasi kesehatan dan rekam medis elektronik.'}
                </p>
                
                <div className="flex items-center gap-4 py-4 border-t border-[#EFEFEF] mb-4">
                  <div className="flex items-center gap-1.5 text-notion-gray">
                    <Clock className="w-4 h-4 opacity-70" />
                    <span className="text-xs font-medium">8 Jam</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-notion-gray">
                    <PlayCircle className="w-4 h-4 opacity-70" />
                    <span className="text-xs font-medium">12 Video</span>
                  </div>
                </div>

                {isEnrolled(course.id) ? (
                  <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-notion-gray">
                      <span>Proses Belajar</span>
                      <span className="text-notion-blue">{getProgress(course.id)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EFEFEF] rounded-sm overflow-hidden mb-3">
                      <div 
                        className="h-full bg-notion-blue transition-all duration-1000" 
                        style={{ width: `${getProgress(course.id)}%` }}
                      ></div>
                    </div>
                    <Button className="w-full bg-notion-bg text-notion-text border border-[#EFEFEF] hover:bg-stone-50 shadow-none rounded-sm h-9 font-medium">
                      Lanjutkan Belajar
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-notion-blue text-white hover:bg-notion-blue/90 shadow-none rounded-sm h-9 font-medium mt-auto" onClick={() => handleEnroll(course.id)}>
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