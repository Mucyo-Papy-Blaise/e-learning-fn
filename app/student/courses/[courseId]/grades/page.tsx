"use client"

import { useEffect, useMemo, useState } from "react"
import { getQuizAttempts, listExams, getOwnExamSubmission, getQuizById, getQuizQuestions } from "@/app/lib/api"
import ResultsTable, { ResultRow } from "@/components/assessments/ResultsTable"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function CourseGradesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const [quizAttemptsRes, examsRes] = await Promise.all([
        getQuizAttempts(),
        listExams({ course: courseId as any }),
      ])

      const out: ResultRow[] = []

      // Build a set of module IDs that belong to this course to filter quizzes
      let courseModuleIds = new Set<string>()
      try {
        const axios = (await import("@/lib/axios")).default
        const mres = await axios.get(`/api/courses/${courseId}/modules`)
        const mods = Array.isArray(mres.data) ? mres.data : (mres.data?.modules || [])
        for (const m of mods) {
          if (m && (m._id || m.id)) courseModuleIds.add(String(m._id || m.id))
        }
      } catch {
        courseModuleIds = new Set<string>()
      }

      if (quizAttemptsRes.ok) {
        const enriched = await Promise.all(
          quizAttemptsRes.data.map(async (a) => {
            const quizId = typeof a.quiz_id === 'object'
              ? String((a as any).quiz_id?._id ?? (a as any).quiz_id)
              : a.quiz_id

            const [q, qs] = await Promise.all([
              getQuizById(quizId),
              getQuizQuestions(quizId),
            ])

            // Filter by course: only include if quiz.module_id belongs to this course's modules if we have that info
            if (q.ok && courseModuleIds.size > 0) {
              const moduleId = (q.data as any).module_id
              const normalizedModuleId = typeof moduleId === 'object' ? String(moduleId?._id ?? moduleId) : String(moduleId)
              if (!courseModuleIds.has(normalizedModuleId)) return null
            }

            let title: string
            if (q.ok && q.data?.title) {
              title = q.data.title
            } else if (typeof (a as any).quiz_id === 'object') {
              title = (a as any).quiz_id.title ?? String((a as any).quiz_id?._id ?? (a as any).quiz_id)
            } else {
              title = String(a.quiz_id)
            }

            const max = qs.ok
              ? qs.data.reduce((acc, qq) => acc + ((qq as any).points || 0), 0)
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
              date: a.completed_at || a.started_at,
            } as ResultRow
          })
        )
        out.push(...enriched.filter(Boolean) as ResultRow[])
      }

      if (examsRes.ok) {
        const exams = examsRes.data.exams
        await Promise.all(
          exams.map(async (e) => {
            const s = await getOwnExamSubmission(e._id)
            if (s.ok && s.data) {
              const total = Number(
                s.data.totalScore ?? (Number(s.data.autoScore || 0) + Number(s.data.manualScore || 0))
              )
              const max = Number(e.totalPoints ?? 100)
              out.push({
                id: s.data._id,
                type: 'exam',
                title: e.title,
                score: total,
                maxScore: max,
                percentage: max ? (total / max) * 100 : 0,
                passed: e.passingScore != null ? total >= e.passingScore : total >= 0.5 * max,
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
    load()
    return () => { mounted = false }
  }, [courseId])

  const sorted = useMemo(
    () => rows.slice().sort((a: ResultRow, b: ResultRow) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()),
    [rows]
  )

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link href={`/student/courses/${courseId}/home`} className="text-sm text-blue-600 hover:underline">Back to Course</Link>
        </div>
        <h1 className="text-2xl font-semibold">My Grades</h1>
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