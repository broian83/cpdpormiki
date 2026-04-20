// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
            <GraduationCap className="w-5 h-5" />
            <span>Pusat Pembelajaran Digital</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Katalog Kursus</h2>
          <p className="text-slate-500 mt-2 text-lg">Tingkatkan keahlian rekam medis Anda dengan materi pilihan.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari kursus..." 
              className="pl-10 bg-white border-slate-200 rounded-xl focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="border-none shadow-md bg-white p-20 text-center rounded-3xl">
          <div className="flex flex-col items-center max-w-xs mx-auto">
            <BookOpen className="h-16 w-16 text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-900">Belum ada kursus</h3>
            <p className="text-slate-500 mt-2">Maaf, saat ini tidak ada kursus yang tersedia atau sesuai dengan pencarian Anda.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <Card key={course.id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden bg-white">
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img 
                  src={course.image_url || `https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800`} 
                  alt={course.judul}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur text-slate-900 border-none shadow-sm hover:bg-white px-3 py-1 text-xs font-bold uppercase tracking-tight">
                    {course.kategori || 'Medis'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-400 text-xs font-medium ml-1">(4.9)</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {course.judul}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-6">
                  {course.deskripsi || 'Pelajari standar kompetensi terbaru dalam manajemen informasi kesehatan dan rekam medis elektronik.'}
                </p>
                
                <div className="flex items-center justify-between py-4 border-t border-slate-100 mb-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">8 Jam</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <PlayCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">12 Video</span>
                  </div>
                </div>

                {isEnrolled(course.id) ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tighter text-slate-400">
                      <span>Proses Belajar</span>
                      <span className="text-primary">{getProgress(course.id)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${getProgress(course.id)}%` }}
                      ></div>
                    </div>
                    <Button className="w-full bg-slate-900 border-none rounded-xl h-12 font-bold shadow-lg shadow-slate-100">
                      Lanjutkan Belajar
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-primary border-none rounded-xl h-12 font-bold shadow-lg shadow-primary/20" onClick={() => handleEnroll(course.id)}>
                    Daftar Sekarang
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Featured Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="z-10 flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black mb-4">Butuh Sertifikat Kompetensi Khusus?</h2>
          <p className="text-slate-400 max-w-lg mb-8 leading-relaxed">
            Ikuti program pelatihan intensif kami dan dapatkan sertifikat yang diakui secara nasional untuk menunjang karier Anda.
          </p>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold px-8 h-12">
            Lihat Program Spesialisasi
          </Button>
        </div>
        <div className="z-10 hidden lg:block">
           <div className="bg-gradient-to-br from-teal-400 to-indigo-500 p-8 rounded-3xl shadow-2xl rotate-3">
              <GraduationCap className="w-24 h-24 text-white" />
           </div>
        </div>
      </div>
    </div>
  )
}