'use client'
import { useEffect, useMemo, useState } from 'react'
import { getQuizAttempts, listExams, getOwnExamSubmission } from '@/app/lib/api'
import ResultsTable, { ResultRow } from '@/components/assessments/ResultsTable'

export default function StudentResultsPage() {
  const [rows, setRows] = useState<ResultRow[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const [quizAttemptsRes, examsRes] = await Promise.all([
        getQuizAttempts(),
        listExams(),
      ])

      const out: ResultRow[] = []

      if (quizAttemptsRes.ok) {
        for (const a of quizAttemptsRes.data) {
          const score = typeof a.score === 'number' ? a.score : 0
          out.push({
            id: a._id,
            type: 'quiz',
            title: a.quiz_id,
            score: score,
            maxScore: 100,
            percentage: score,
            passed: score >= 50,
            date: a.completed_at || a.started_at,
          })
        }
      }

      if (examsRes.ok) {
        const exams = examsRes.data.exams
        // For each exam, try to fetch own submission
        await Promise.all(exams.map(async (e) => {
          const s = await getOwnExamSubmission(e._id)
          if (s.ok && s.data) {
            const total = Number(s.data.totalScore ?? (Number(s.data.autoScore || 0) + Number(s.data.manualScore || 0)))
            const max = Number(e.totalPoints ?? 100)
            out.push({
              id: s.data._id,
              type: 'exam',
              title: e.title,
              score: total,
              maxScore: max,
              percentage: max ? (total / max) * 100 : 0,
              passed: e.passingScore != null ? total >= e.passingScore : total >= (0.5 * max),
              date: undefined,
            })
          }
        }))
      }

      if (mounted) setRows(out)
    }
    load()
    return () => { mounted = false }
  }, [])

  const sorted = useMemo(() => rows.slice().sort((a,b) => (new Date(b.date || 0).getTime()) - (new Date(a.date || 0).getTime())), [rows])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">My Results</h1>
        <ResultsTable rows={sorted} />
      </div>
    </div>
  )
}

