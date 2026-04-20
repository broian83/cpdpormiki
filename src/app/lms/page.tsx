// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Course {
  id: string
  judul: string
  kategori: string | null
  deskripsi: string | null
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

  useEffect(() => { fetchCourses() }, [])

  const fetchCourses = async () => {
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

  if (isLoading) return <div className="p-8 text-center">Memuat...</div>

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Keputusan LMS</h2>
        <p className="text-slate-600">Belajar dan kembangkan kompetensi</p>
      </div>

      {courses.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500">Belum ada kursus tersedia</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader><CardTitle>{course.judul}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">{course.deskripsi || 'Tidak ada deskripsi'}</p>
                {isEnrolled(course.id) ? (
                  <div>
                    <p className="text-sm mb-2">Progress: {getProgress(course.id)}%</p>
                    <Button className="w-full">Lanjutkan</Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => handleEnroll(course.id)}>Daftar</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}