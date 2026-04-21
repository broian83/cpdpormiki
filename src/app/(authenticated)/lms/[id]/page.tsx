// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Video, 
  ArrowRight,
  ArrowLeft,
  Circle,
  LogOut,
  Youtube,
  ExternalLink,
  BookOpen,
  FileBadge2
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Module {
  id: string
  judul_modul: string
  urutan: number
  tipe_konten: 'video' | 'pdf' | 'text'
  konten_url: string
  is_completed?: boolean
}

interface Course {
  id: string
  judul: string
  deskripsi: string
}

export default function CoursePlayerPage() {
  const { id: courseId } = useParams()
  const supabase = createClient()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch course info
      const { data: courseData } = await supabase
        .from('lms_courses')
        .select('*')
        .eq('id', courseId)
        .single()
      
      setCourse(courseData)

      // Fetch modules and user progress
      const { data: modulesData } = await supabase
        .from('lms_modules')
        .select(`
          *,
          progress:lms_user_modules(is_completed)
        `)
        .eq('course_id', courseId)
        .order('urutan', { ascending: true })

      if (modulesData) {
        const mappedModules = modulesData.map(m => ({
          ...m,
          is_completed: m.progress?.[0]?.is_completed || false
        }))
        setModules(mappedModules)
        if (mappedModules.length > 0) setActiveModule(mappedModules[0])
      }

    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkComplete = async (moduleId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('lms_user_modules')
        .upsert({
          user_id: session.user.id,
          module_id: moduleId,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      // Update local state
      setModules(prev => prev.map(m => m.id === moduleId ? { ...m, is_completed: true } : m))
      
      // Update progress percent in lms_enrollments
      const completedCount = modules.filter(m => m.is_completed || m.id === moduleId).length
      const totalCount = modules.length
      const percent = Math.round((completedCount / totalCount) * 100)
      
      await supabase
        .from('lms_enrollments')
        .update({ progress_percent: percent })
        .eq('user_id', session.user.id)
        .eq('course_id', courseId)

    } catch (error) {
      console.error('Error marking module complete:', error)
    }
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
    }
    return url;
  }

  const activeIndex = activeModule ? modules.findIndex(m => m.id === activeModule.id) : -1
  const hasNext = activeIndex !== -1 && activeIndex < modules.length - 1
  const hasPrev = activeIndex > 0

  const handlePrev = () => {
      if (hasPrev) setActiveModule(modules[activeIndex - 1])
  }
  const handleNext = () => {
      if (hasNext) setActiveModule(modules[activeIndex + 1])
  }

  const handleMarkCompleteCurrent = async () => {
      if (!activeModule) return;
      setIsSubmitting(true);
      await handleMarkComplete(activeModule.id);
      setIsSubmitting(false);
  }

  const getFileInfo = (url: string) => {
    if (!url) return { name: 'Dokumen_Materi.pdf', ext: 'PDF' };
    let name = url.split('/').pop()?.split('?')[0] || 'Dokumen_Materi.pdf';
    try { name = decodeURIComponent(name) } catch(e){}
    return { name, ext: name.split('.').pop()?.toUpperCase() || 'PDF' }
  }

  const DefaultDesc = "Dokumen ini merupakan panduan dan referensi teknis yang mempermudah pemahaman praktik profesi. Silakan baca, pelajari, dan manfaatkan informasi di dalamnya. Jangan lupa tandai modul ini agar progres Anda tersimpan sistem."

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-stone-50">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-notion-gray"></div>
    </div>
  )

  if (!course) return <div className="p-20 text-center">Kursus tidak ditemukan.</div>

  const progressPercent = Math.round((modules.filter(m => m.is_completed).length / (modules.length || 1)) * 100)

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 pb-28 md:pb-8 text-notion-text relative">
       {/* Top Nav - Header Kursus */}
       <div className="sticky top-0 min-h-[64px] py-2 md:py-0 md:h-16 border-b border-stone-200 flex items-center px-3 sm:px-6 md:px-8 justify-between bg-white/95 backdrop-blur-md shadow-sm z-30">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
             <Link href="/lms" className="p-1.5 sm:p-2 hover:bg-stone-50 rounded-md transition-colors border border-transparent hover:border-stone-200 text-notion-text shrink-0 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
             </Link>
             <div className="h-5 w-[1px] bg-stone-200 shrink-0 hidden sm:block mx-1"></div>
             
             <div className="flex flex-col flex-1 min-w-0 justify-center">
                <h2 className="font-serif font-black text-xs sm:text-sm md:text-base leading-tight truncate">{course.judul}</h2>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 overflow-x-auto no-scrollbar pb-0.5">
                   <span className="text-[8px] sm:text-[9px] text-notion-gray font-bold uppercase tracking-widest leading-none whitespace-nowrap shrink-0">
                      Mode Berkala
                   </span>
                   
                   {/* Mini Progress Indicator for Mobile/Tablet */}
                   <div className="w-1 h-1 bg-stone-300 rounded-full shrink-0 lg:hidden"></div>
                   <div className="flex items-center gap-1.5 shrink-0 lg:hidden">
                       <div className="w-10 sm:w-16 h-1 bg-stone-200 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                       </div>
                       <span className="text-[8px] sm:text-[9px] font-black text-emerald-700 tracking-widest">{progressPercent}%</span>
                   </div>

                   {progressPercent === 100 && (
                      <>
                         <div className="w-1 h-1 bg-stone-300 rounded-full shrink-0"></div>
                         <span className="text-[8px] sm:text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap shrink-0">
                            Lulus Sempurna
                         </span>
                      </>
                   )}
                </div>
             </div>
          </div>

          {/* Large Progress Indicator for Desktop */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 ml-4 pl-6 border-l border-stone-200 h-8">
             <div className="w-24 xl:w-32 h-1.5 bg-stone-100 border border-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
             </div>
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">{progressPercent}%</span>
          </div>
       </div>

       {/* Centered Area */}
       <div className="w-full flex-1 max-w-4xl mx-auto px-4 py-6 md:p-8 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 mb-20 md:mb-0">
          {activeModule ? (
             <>
                {/* 1. Judul & Metadata Modul Posisi */}
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" />
                      Modul {activeModule.urutan} dari {modules.length}
                   </span>
                   <h1 className="text-2xl md:text-3xl font-serif font-black leading-tight text-notion-text">
                      {activeModule.judul_modul}
                   </h1>
                </div>

                {/* 2. Card Container Pembelajaran */}
                <div className="flex flex-col w-full relative z-20">
                   
                   {/* Area Konten Pembelajaran Tipe Video */}
                   {activeModule.tipe_konten === 'video' ? (
                      <div className="aspect-video bg-stone-900 border border-stone-200 rounded-xl relative group overflow-hidden shadow-sm mb-6">
                         {activeModule.konten_url ? (
                            <>
                               <iframe 
                                 className="absolute inset-0 w-full h-full z-10" 
                                 src={getEmbedUrl(activeModule.konten_url)}
                                 title={activeModule.judul_modul}
                                 allowFullScreen
                               />
                               {/* Fallback button darurat iframe */}
                               <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <a 
                                    href={activeModule.konten_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase hover:bg-black/90 transition shadow-lg border border-white/10"
                                  >
                                     <Play className="w-3 h-3" />
                                     Buka Murni di YouTube
                                  </a>
                               </div>
                            </>
                         ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                               <Video className="w-10 h-10 md:w-12 md:h-12 mb-3" />
                               <p className="text-[10px] font-bold tracking-widest uppercase">Video tidak tersedia</p>
                            </div>
                         )}
                      </div>
                   ) : (
                      <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6 md:p-10 mb-6">
                         <div className="flex items-center gap-2 text-notion-blue mb-6">
                            <FileBadge2 className="w-4 h-4" />
                            <span className="font-bold tracking-widest text-[10px] uppercase">Dokumen Bacaan Spesifik</span>
                         </div>
                         
                         {/* Card Penampil Dokumen Rapi */}
                         <div className="border border-stone-200 bg-blue-50/30 rounded-lg flex flex-col sm:flex-row sm:items-center p-1 shadow-sm relative overflow-hidden group">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-notion-blue" />
                              <div className="flex items-center p-3 sm:p-4 min-w-0 flex-1">
                                  <div className="p-2 sm:p-3 bg-blue-100 rounded-md text-notion-blue mr-3 sm:mr-4 shrink-0 transition-transform group-hover:scale-105">
                                       <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-2">
                                      <h4 className="font-bold text-xs sm:text-sm text-stone-800 truncate mb-1" title={getFileInfo(activeModule.konten_url).name}>
                                           {getFileInfo(activeModule.konten_url).name}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9px] uppercase tracking-widest text-stone-500 font-bold overflow-hidden">
                                          <span>{getFileInfo(activeModule.konten_url).ext}</span>
                                          <span className="w-1 h-1 bg-stone-300 rounded-full shrink-0" />
                                          <span className="hidden sm:inline">1 MB</span>
                                          <span className="w-1 h-1 bg-stone-300 rounded-full shrink-0 hidden sm:inline" />
                                          <span>≈ 10 Mnt Baca</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="p-3 sm:p-4 sm:pr-4 pt-0 sm:pt-4 border-t sm:border-t-0 border-stone-200 flex justify-end shrink-0">
                                  {activeModule.konten_url ? (
                                      <a 
                                        href={activeModule.konten_url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="bg-notion-text hover:bg-stone-800 text-white px-5 py-2.5 rounded-md font-bold text-[10px] tracking-widest uppercase transition flex items-center gap-2"
                                      >
                                           <ExternalLink className="w-3 h-3" />
                                           Akses File
                                      </a>
                                  ) : (
                                      <Button variant="ghost" disabled className="text-[10px] uppercase tracking-widest">
                                         Berkas Menunggu
                                      </Button>
                                  )}
                              </div>
                         </div>
                      </div>
                   )}
                   
                   {/* 3. Deskripsi Materi & Refleksi */}
                   <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6 md:p-8 space-y-4">
                      {activeModule.tipe_konten === 'video' ? (
                         <h3 className="font-serif font-black text-lg">Suplemen & Catatan</h3>
                      ) : (
                         <h3 className="font-serif font-black text-lg">Catatan Teks / Konteks Dokumen</h3>
                      )}
                      <div className="prose prose-notion text-sm md:text-base leading-relaxed text-stone-600 max-w-none">
                         {activeModule.deskripsi || DefaultDesc}
                      </div>
                   </div>
                </div>

             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-notion-gray opacity-40 mt-20">
                <Play className="w-12 h-12 mb-4 animate-pulse" />
                <p className="font-bold tracking-widest text-xs uppercase animate-pulse">Menyiapkan Bahan Ajar...</p>
             </div>
          )}
       </div>

       {/* 4. Action Buttons Mobile Sticky & Desktop Static Footer */}
       {activeModule && (
       <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 md:bg-transparent md:border-none md:static md:w-full md:max-w-4xl md:mx-auto md:pb-10 md:px-8 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-none transition-all">
           <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 md:bg-white md:p-4 md:border md:border-stone-200 md:rounded-xl md:shadow-sm">
                
                {/* Tertiary - Sebelumnya */}
                <div className="w-[85px] sm:w-[130px] shrink-0">
                    {hasPrev ? (
                       <Button 
                         variant="ghost" 
                         onClick={handlePrev} 
                         className="w-full h-10 md:h-11 px-0 sm:px-4 font-bold text-[9px] sm:text-[10px] tracking-widest uppercase text-stone-500 hover:text-notion-blue"
                         disabled={isSubmitting}
                       >
                           <ArrowLeft className="w-3.5 h-3.5 mr-1 sm:mr-2" />
                           <span className="hidden sm:inline">Sebelumnya</span>
                           <span className="sm:hidden">Balik</span>
                       </Button>
                    ) : ( <div /> )}
                </div>

                <div className="flex gap-2 sm:gap-3 flex-1 justify-end min-w-0 overflow-hidden">
                   {/* Secondary - Tandai Selesai */}
                   {!activeModule.is_completed ? (
                      <Button 
                        variant="outline" 
                        onClick={handleMarkCompleteCurrent} 
                        isLoading={isSubmitting} 
                        className="flex-1 sm:flex-none h-10 md:h-11 px-2 sm:px-4 md:px-6 border-stone-300 bg-white text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-widest uppercase truncate"
                      >
                         <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                         <span className="truncate">Tuntas Baca</span>
                      </Button>
                   ) : (
                      <div className="hidden sm:flex shrink-0 h-10 md:h-11 items-center justify-center px-4 md:px-6 bg-emerald-50 text-emerald-700 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase border border-emerald-200 rounded-md">
                         <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                         Status Selesai
                      </div>
                   )}
                   
                   {/* Primary - Selanjutnya */}
                   {hasNext ? (
                      <Button 
                        variant="default" 
                        onClick={handleNext} 
                        className="flex-1 sm:flex-none h-10 md:h-11 px-3 sm:px-6 md:px-8 bg-notion-blue hover:bg-blue-700 text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm truncate shrink-0"
                      >
                         <span className="truncate">Selanjutnya</span>
                         <ArrowRight className="w-3.5 h-3.5 ml-1 sm:ml-2 shrink-0" />
                      </Button>
                   ) : (
                      <Link href="/lms" className="flex-1 sm:flex-none block shrink-0">
                         <Button 
                           variant="default" 
                           className="w-full h-10 md:h-11 bg-emerald-600 hover:bg-emerald-700 px-3 sm:px-6 md:px-8 text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-widest uppercase shadow-sm border-transparent truncate"
                         >
                            <span className="truncate">Akhiri Sesi</span>
                            <LogOut className="w-3.5 h-3.5 ml-1.5 shrink-0" />
                         </Button>
                      </Link>
                   )}
                </div>
           </div>
       </div>
       )}
    </div>
  )
}
