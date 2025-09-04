'use client'
import { useEffect, useMemo, useState } from 'react'
import { getQuizById, getQuizQuestions, startQuizAttempt, submitQuizAttempt } from '@/app/lib/api'
import type { Quiz, QuizAttempt, QuizQuestion } from '@/lib/types/assessments'
import QuestionForm from '@/components/assessments/QuestionForm'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'

export default function QuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    Promise.all([getQuizById(id), getQuizQuestions(id)]).then(([q, qs]) => {
      if (!mounted) return
      if (q.ok) setQuiz(q.data)
      if (qs.ok) setQuestions(qs.data)
    })
    return () => { mounted = false }
  }, [id])

  const simpleQuestions = useMemo(() => questions.map(q => ({
    id: q._id,
    type: 'multiple_choice' as const,
    question: q.question,
    options: q.options,
  })), [questions])

  const handleStart = async () => {
    if (!id) return
    const res = await startQuizAttempt(id)
    if (res.ok) setAttempt(res.data)
  }

  const handleSubmit = async () => {
    if (!attempt) return
    setSubmitting(true)
    const res = await submitQuizAttempt(attempt._id, answers)
    setSubmitting(false)
    if (res.ok) {
      router.push('/student/results')
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">{quiz?.title ?? 'Quiz'}</h1>
        {!attempt ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Time limit: {quiz?.time_limit} min. Max attempts: {quiz?.max_attempts}.</p>
            <Button onClick={handleStart}>Start Attempt</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <QuestionForm questions={simpleQuestions} value={answers} onChange={setAnswers} />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

