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
  Circle
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

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-stone-50">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-notion-gray"></div>
    </div>
  )

  if (!course) return <div className="p-20 text-center">Kursus tidak ditemukan.</div>

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden text-notion-text">
       {/* Content Area */}
       <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Nav */}
          <div className="h-16 border-b border-[#EFEFEF] flex items-center px-6 justify-between bg-white shrink-0">
             <div className="flex items-center gap-4">
                <Link href="/lms" className="p-1.5 hover:bg-stone-50 rounded-md transition-colors border border-transparent hover:border-[#EFEFEF]">
                   <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="h-4 w-[1px] bg-[#EFEFEF]"></div>
                <h2 className="font-serif font-bold text-lg leading-tight truncate max-w-md">{course.judul}</h2>
             </div>
          </div>

          {/* Player / Content Display */}
          <div className="flex-1 overflow-y-auto bg-stone-50/50 p-6 md:p-10">
             {activeModule ? (
                <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                   {/* Content Container */}
                   <div className="bg-white border border-[#EFEFEF] rounded-md overflow-hidden shadow-sm">
                      {activeModule.tipe_konten === 'video' ? (
                         <div className="aspect-video bg-notion-text flex items-center justify-center relative">
                            {activeModule.konten_url ? (
                               <iframe 
                                 className="w-full h-full" 
                                 src={activeModule.konten_url.replace('watch?v=', 'embed/')}
                                 title={activeModule.judul_modul}
                                 allowFullScreen
                               ></iframe>
                            ) : (
                               <div className="text-white/20 text-center">
                                  <Video className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                  <p>Video content is missing.</p>
                               </div>
                            )}
                         </div>
                      ) : (
                         <div className="p-10 md:p-16 space-y-6">
                            <div className="flex items-center gap-3 text-notion-blue mb-4">
                               <FileText className="w-6 h-6" />
                               <span className="font-bold tracking-widest text-xs">Materi Bacaan</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">{activeModule.judul_modul}</h1>
                            <div className="prose prose-notion max-w-none">
                               <p className="text-notion-gray text-lg leading-relaxed">
                                  Silakan klik link di bawah ini untuk mengunduh atau membaca materi lengkap modul ini.
                               </p>
                               {activeModule.konten_url && (
                                  <a 
                                    href={activeModule.konten_url} 
                                    target="_blank" 
                                    className="inline-flex items-center gap-2 text-notion-blue hover:underline font-bold mt-4"
                                  >
                                     <FileText className="w-5 h-5" />
                                     Buka Dokumen Materi
                                  </a>
                               )}
                            </div>
                         </div>
                      )}
                      
                      <div className="p-6 border-t border-[#EFEFEF] flex justify-between items-center bg-white">
                         <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-notion-gray uppercase tracking-widest">
                               Modul {activeModule.urutan} dari {modules.length}
                            </span>
                         </div>
                         <div className="flex items-center gap-3">
                            {!activeModule.is_completed && (
                               <Button 
                                 onClick={() => handleMarkComplete(activeModule.id)}
                                 className="bg-notion-text text-white hover:bg-[#201F1C] rounded-sm h-10 px-6 font-bold text-xs tracking-widest uppercase"
                               >
                                  Tandai Selesai
                               </Button>
                            )}
                            {activeModule.is_completed && (
                               <div className="flex items-center gap-2 text-notion-green font-bold text-xs tracking-widest uppercase px-4 py-2 bg-notion-green_bg rounded-sm">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Sudah Selesai
                               </div>
                            )}
                         </div>
                      </div>
                   </div>

                   {/* Description / Metadata */}
                   <div className="space-y-4">
                      <h3 className="text-xl font-serif font-bold">Tentang Modul Ini</h3>
                      <p className="text-notion-gray leading-relaxed">
                         Petunjuk: Pastikan Anda menonton video atau membaca materi hingga tuntas sebelum menandai modul sebagai selesai. Kemajuan Anda akan terekam secara otomatis dalam basis data sistem.
                      </p>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-notion-gray opacity-30">
                   <Play className="w-12 h-12 mb-4" />
                   <p>Pilih modul di sebelah kanan untuk mulai belajar.</p>
                </div>
             )}
          </div>
       </div>

       {/* Sidebar / Modules List */}
       <div className="w-full lg:w-96 border-l border-[#EFEFEF] flex flex-col bg-stone-50 shrink-0">
          <div className="p-6 border-b border-[#EFEFEF] bg-white">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-lg">Daftar Modul</h3>
                <span className="text-[10px] font-bold text-notion-blue bg-notion-blue_bg px-2 py-0.5 rounded-sm">
                   {Math.round((modules.filter(m => m.is_completed).length / modules.length) * 100 || 0)}% Progres
                </span>
             </div>
             <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-notion-blue transition-all duration-700" 
                  style={{ width: `${(modules.filter(m => m.is_completed).length / modules.length) * 100}%` }}
                ></div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
             {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m)}
                  className={`w-full text-left p-4 rounded-md transition-all border flex items-start gap-4 ${activeModule?.id === m.id ? 'bg-white border-notion-gray/20 shadow-sm' : 'border-transparent hover:bg-stone-100 hover:border-[#EFEFEF]'}`}
                >
                   <div className="mt-0.5">
                      {m.is_completed ? (
                         <CheckCircle2 className="w-5 h-5 text-notion-green" />
                      ) : activeModule?.id === m.id ? (
                         <Circle className="w-5 h-5 text-notion-blue" />
                      ) : (
                         <Circle className="w-5 h-5 text-notion-gray/30" />
                      )}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-bold text-notion-gray/50 uppercase tracking-widest">Modul {m.urutan}</span>
                         {m.tipe_konten === 'video' ? <Video className="w-3 h-3 opacity-30" /> : <FileText className="w-3 h-3 opacity-30" />}
                      </div>
                      <p className={`text-sm font-bold leading-snug ${activeModule?.id === m.id ? 'text-notion-blue' : 'text-notion-text'}`}>
                         {m.judul_modul}
                      </p>
                   </div>
                </button>
             ))}
          </div>
       </div>
    </div>
  )
}
