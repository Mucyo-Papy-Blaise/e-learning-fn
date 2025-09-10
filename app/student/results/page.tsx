'use client'
import { useEffect, useMemo, useState } from 'react'
import { getQuizAttempts, listExams, getOwnExamSubmission, getQuizById, getQuizQuestions } from '@/app/lib/api'
import ResultsTable, { ResultRow } from '@/components/assessments/ResultsTable'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudentResultsPage() {
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const [quizAttemptsRes, examsRes] = await Promise.all([
        getQuizAttempts(),
        listExams(),
      ])

      const out: ResultRow[] = []

      if (quizAttemptsRes.ok) {
        // enrich with quiz title and max points from questions
        const enriched = await Promise.all(
          quizAttemptsRes.data.map(async (a) => {
            const quizId = typeof a.quiz_id === 'object'
            // @ts-expect-error error
              ? String(a.quiz_id._id ?? a.quiz_id)
              : a.quiz_id
            const [q, qs] = await Promise.all([
              getQuizById(quizId),
              getQuizQuestions(quizId),
            ])

            // Always make title a string
            let title: string
            if (q.ok && q.data?.title) {
              title = q.data.title
            } else if (typeof a.quiz_id === 'object') {
              // handles case where quiz_id might be populated object
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
                ? (score / max) * 100 >= (q.ok ? q.data.pass_percentage : 50)
                : score >= 50,
              date: a.completed_at || a.started_at,
            } as ResultRow
          })
        )
        out.push(...enriched)
      }

      if (examsRes.ok) {
        const exams = examsRes.data.exams
        // For each exam, try to fetch own submission
        await Promise.all(
          exams.map(async (e) => {
            const s = await getOwnExamSubmission(e._id)
            if (s.ok && s.data) {
              const total = Number(
                s.data.totalScore ??
                  (Number(s.data.autoScore || 0) +
                    Number(s.data.manualScore || 0))
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
                  e.passingScore != null
                    ? total >= e.passingScore
                    : total >= 0.5 * max,
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
    return () => {
      mounted = false
    }
  }, [])

  const sorted = useMemo(
    () =>
      rows
        .slice()
        .sort(
          (a, b) =>
            new Date(b.date || 0).getTime() -
            new Date(a.date || 0).getTime()
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
              <BreadcrumbPage>Results</BreadcrumbPage>
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
