'use client'
import { useEffect, useState } from 'react'
import { getQuizzes } from '@/app/lib/api'
import type { Quiz } from '@/lib/types/assessments'
import QuizCard from '@/components/assessments/QuizCard'

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getQuizzes().then(res => {
      if (!mounted) return
      if (res.ok) setQuizzes(res.data)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        {loading ? (
          <div className="text-muted-foreground">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-muted-foreground">No quizzes available.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map(q => (
              <QuizCard key={q._id} quiz={q} href={`/student/quizzes/${q._id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

