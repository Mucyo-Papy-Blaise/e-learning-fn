'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { getQuizzes } from '@/app/lib/api'
import { fetchCourseById, fetchModulesByCourseId } from '@/lib/api/courses'
import type { Course, Module } from '@/lib/types/course'
import type { Quiz } from '@/lib/types/assessments'
import QuizCard from '@/components/assessments/QuizCard'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles } from 'lucide-react'

export default function CourseQuizzesPage() {
  const params = useParams()
  const courseId = params?.courseId as string
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!courseId) return
      try {
        const [c, ms] = await Promise.all([
          fetchCourseById(courseId),
          fetchModulesByCourseId(courseId),
        ])
        if (!mounted) return
        setCourse(c as any)
        setModules(ms as any)
        // Gather quizzes across all modules
        const all: Quiz[] = []
        await Promise.all((ms as Module[]).map(async (m: Module) => {
          const res = await getQuizzes({ module_id: m._id })
          if (res.ok) all.push(...res.data)
        }))
        if (!mounted) return
        setQuizzes(all)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [courseId])

  const moduleNameById = useMemo(() => Object.fromEntries(modules.map((m: Module) => [m._id, m.title])), [modules])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student">Student</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/student/courses/${courseId}/home`}>{course?.title ?? 'Course'}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Quizzes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow">
          <div className="flex items-start justify-between p-6">
            <div>
              <h1 className="text-2xl font-semibold">Quizzes</h1>
              <p className="mt-1 text-sm opacity-90">Assess your understanding of {course?.title ?? 'this course'} with curated quizzes.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-blue-100">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">{quizzes.length} total</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-blue-800">No quizzes available for this course.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((q: any) => {
              const moduleId = typeof q.module_id === 'string' ? q.module_id : q.module_id?._id
              const moduleTitle = typeof q.module_id === 'object' && q.module_id?.title ? q.module_id.title : moduleNameById[moduleId] || moduleId
              return (
                <div key={q._id} className="space-y-2">
                  <QuizCard quiz={q} href={`/student/quizzes/${q._id}?courseId=${courseId}`} />
                  <div className="text-xs text-blue-700">Module: {moduleTitle}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

