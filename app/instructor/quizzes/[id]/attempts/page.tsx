'use client'
import { useEffect, useMemo, useState } from 'react'
import { getQuizById, getQuizAttempts, getQuizQuestions } from '@/app/lib/api'
import type { Quiz, QuizAttempt, QuizQuestion } from '@/lib/types/assessments'
import { useParams } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function InstructorQuizAttemptsPage() {
  const params = useParams()
  const id = params?.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!id) return
    async function load() {
      const [qRes, qsRes, atRes] = await Promise.all([
        getQuizById(id),
        getQuizQuestions(id),
        getQuizAttempts(id),
      ])
      if (!mounted) return
      if (qRes.ok) setQuiz(qRes.data)
      if (qsRes.ok) setQuestions(qsRes.data)
      if (atRes.ok) setAttempts(atRes.data)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [id])

  const maxScore = useMemo(() => questions.reduce((acc, q) => acc + (q.points || 0), 0), [questions])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor">Instructor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor/quizzes">Quizzes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Attempts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">{quiz?.title ?? 'Quiz'} - Attempts</h1>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percent</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map(a => {
                  const score = typeof a.score === 'number' ? a.score : 0
                  const percent = maxScore ? Math.round((score / maxScore) * 100) : 0
                  return (
                    <TableRow key={a._id}>
                      <TableCell className="font-medium">{a.user_id}</TableCell>
                      <TableCell>{score} / {maxScore || '-'}</TableCell>
                      <TableCell>{percent}%</TableCell>
                      <TableCell>{a.started_at ? new Date(a.started_at).toLocaleString() : '-'}</TableCell>
                      <TableCell>{a.completed_at ? new Date(a.completed_at).toLocaleString() : '-'}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

