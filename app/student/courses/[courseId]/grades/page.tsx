"use client"

import { useEffect, useMemo, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ResultsTable, { ResultRow } from '@/components/assessments/ResultsTable'
import { Skeleton } from '@/components/ui/skeleton'
import { getQuizAttempts, listExams, getOwnExamSubmission, getQuizById, getQuizQuestions } from '@/app/lib/api'
import { fetchModulesByCourseId } from '@/lib/api/courses'

export default function CourseGradesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      // Fetch course modules to scope quiz attempts to this course
      const [modules, quizAttemptsRes, examsRes] = await Promise.all([
        fetchModulesByCourseId(courseId),
        getQuizAttempts(),
        listExams({ course: courseId as any }),
      ])

      const moduleIdSet = new Set<string>((modules as any[]).map((m) => m._id))

      const out: ResultRow[] = []

      if (quizAttemptsRes.ok) {
        // enrich with quiz title and max points from questions, scoped to course's modules
        const enriched = await Promise.all(
          quizAttemptsRes.data.map(async (a) => {
            const quizId = typeof a.quiz_id === 'object'
              // @ts-expect-error possible populated object
              ? String(a.quiz_id._id ?? a.quiz_id)
              : a.quiz_id

            const [q, qs] = await Promise.all([
              getQuizById(quizId as any),
              getQuizQuestions(quizId as any),
            ])

            // Skip if quiz's module is not part of this course
            const quizModuleId = q.ok ? (q.data as any)?.module_id : undefined
            const moduleIdStr = typeof quizModuleId === 'object' ? String((quizModuleId as any)?._id) : String(quizModuleId || '')
            if (!moduleIdStr || !moduleIdSet.has(moduleIdStr)) return null

            let title: string
            if (q.ok && (q.data as any)?.title) {
              title = (q.data as any).title
            } else if (typeof a.quiz_id === 'object') {
              // @ts-expect-error error
              title = a.quiz_id.title ?? String(a.quiz_id._id ?? a.quiz_id)
            } else {
              title = String(a.quiz_id)
            }

            const max = qs.ok
              ? qs.data.reduce((acc, q) => acc + (q.points || 0), 0)
              : 100
            const score = typeof a.score === 'number' ? a.score : 0

            return {
              id: a._id,
              type: 'quiz' as const,
              title,
              score,
              maxScore: max,
              percentage: max ? (score / max) * 100 : 0,
              passed: max
                ? (score / max) * 100 >= (q.ok ? (q.data as any).pass_percentage : 50)
                : score >= 50,
              date: (a as any).completed_at || (a as any).started_at,
            } as ResultRow
          })
        )
        out.push(...enriched.filter(Boolean) as ResultRow[])
      }

      if (examsRes.ok) {
        const exams = examsRes.data.exams
        await Promise.all(
          exams.map(async (e: any) => {
            const s = await getOwnExamSubmission(e._id)
            if (s.ok && s.data) {
              const total = Number(
                s.data.totalScore ??
                  (Number(s.data.autoScore || 0) + Number(s.data.manualScore || 0))
              )
              const max = Number(e.totalPoints ?? 100)
              out.push({
                id: s.data._id,
                type: 'exam',
                title: e.title,
                score: total,
                maxScore: max,
                percentage: max ? (total / max) * 100 : 0,
                passed:
                  e.passingScore != null ? total >= e.passingScore : total >= 0.5 * max,
                date: undefined,
              })
            }
          })
        )
      }

      if (mounted) {
        setRows(out)
        setLoading(false)
      }
    }
    setLoading(true)
    load()
    return () => {
      mounted = false
    }
  }, [courseId])

  const sorted = useMemo(
    () =>
      rows
        .slice()
        .sort(
          (a, b) =>
            new Date((b as any).date || 0).getTime() - new Date((a as any).date || 0).getTime()
        ),
    [rows]
  )

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student">Student</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Grades</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">My Results</h1>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <ResultsTable rows={sorted} />
        )}
      </div>
    </div>
  )
}