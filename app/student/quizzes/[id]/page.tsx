'use client'
import { useEffect, useMemo, useState } from 'react'
import { getQuizById, getQuizQuestions, startQuizAttempt, submitQuizAttempt } from '@/app/lib/api'
import type { Quiz, QuizAttempt, QuizQuestion } from '@/lib/types/assessments'
import QuestionForm from '@/components/assessments/QuestionForm'
import { Button } from '@/components/ui/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { toast } from 'react-toastify'

export default function QuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [confirmGuard, setConfirmGuard] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    if (!id) return
    Promise.all([getQuizById(id), getQuizQuestions(id)]).then(([q, qs]) => {
      if (!mounted) return
      if (q.ok) setQuiz(q.data)
      if (qs.ok) setQuestions(qs.data)
      const raw = localStorage.getItem(`quizAttempt:${id}`)
      if (raw) {
        try {
          const saved = JSON.parse(raw) as { attemptId?: string; answers?: Record<string,string>; endTime?: number }
          if (saved.answers) setAnswers(saved.answers)
          if (saved.endTime && saved.endTime > Date.now()) {
            setTimeLeft(Math.max(0, Math.floor((saved.endTime - Date.now())/1000)))
          }
          if (saved.attemptId) {
            setAttempt({ _id: saved.attemptId, quiz_id: id, user_id: '', answers: saved.answers || {} } as any)
            setConfirmGuard(true)
          }
        } catch {}
      }
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
    if (res.ok) {
      setAttempt(res.data)
      toast.success('Attempt started')
      if (quiz?.time_limit) setTimeLeft(quiz.time_limit * 60)
      const endTime = quiz?.time_limit ? Date.now() + quiz.time_limit * 60 * 1000 : undefined
      localStorage.setItem(`quizAttempt:${id}`, JSON.stringify({ attemptId: res.data._id, answers: {}, endTime }))
      setConfirmGuard(true)
      history.pushState(null, '', window.location.href)
      const onPop = (e: PopStateEvent) => {
        if (confirmGuard) {
          const ok = confirm('You have an ongoing quiz. Are you sure you want to leave? Your progress may be lost.')
          if (!ok) {
            history.pushState(null, '', window.location.href)
          }
        }
      }
      window.addEventListener('popstate', onPop)
      const onBefore = (e: BeforeUnloadEvent) => {
        if (confirmGuard) {
          e.preventDefault();
          e.returnValue = ''
        }
      }
      window.addEventListener('beforeunload', onBefore)
    } else {
      toast.error(res.message)
    }
  }

  const handleSubmit = async () => {
    if (!attempt) return
    setSubmitting(true)
    const res = await submitQuizAttempt(attempt._id, answers)
    setSubmitting(false)
    if (res.ok) {
      toast.success('Quiz submitted')
      const courseId = searchParams?.get('courseId')
      router.push(courseId ? `/student/courses/${courseId}/grades` : '/student/courses')
      localStorage.removeItem(`quizAttempt:${id}`)
      setConfirmGuard(false)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => {
    if (timeLeft == null) return
    if (timeLeft <= 0) {
      // Auto submit when time is up
      handleSubmit()
      return
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  // Periodic autosave while attempting
  useEffect(() => {
    if (!attempt) return
    if (autoSaveTimer) clearInterval(autoSaveTimer)
    const interval = setInterval(() => {
      const raw = localStorage.getItem(`quizAttempt:${id}`)
      let payload: any = { answers }
      if (raw) {
        try { const prev = JSON.parse(raw); payload = { ...prev, answers } } catch {}
      }
      localStorage.setItem(`quizAttempt:${id}`, JSON.stringify(payload))
    }, 15000)
    setAutoSaveTimer(interval)
    return () => clearInterval(interval)
  }, [attempt, answers, id])

  const handleSaveDraft = () => {
    const raw = localStorage.getItem(`quizAttempt:${id}`)
    let payload: any = { answers }
    if (raw) {
      try { const prev = JSON.parse(raw); payload = { ...prev, answers } } catch {}
    }
    localStorage.setItem(`quizAttempt:${id}`, JSON.stringify(payload))
    toast.success('Draft saved')
  }

  const onAnswersChange = (next: Record<string, string>) => {
    setAnswers(next)
    const raw = localStorage.getItem(`quizAttempt:${id}`)
    let payload: any = { answers: next }
    if (raw) {
      try { const prev = JSON.parse(raw); payload = { ...prev, answers: next } } catch {}
    }
    localStorage.setItem(`quizAttempt:${id}`, JSON.stringify(payload))
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/student">Student</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/student/quizzes">Quizzes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{quiz?.title ?? 'Quiz'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">{quiz?.title ?? 'Quiz'}</h1>
        {!attempt ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">Time limit: {quiz?.time_limit} min. Max attempts: {quiz?.max_attempts}.</p>
            <Button onClick={handleStart}>Start Attempt</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {timeLeft != null && (
              <div className="text-right text-sm">Time left: <span className={timeLeft < 60 ? 'text-red-600 font-medium' : 'font-medium'}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2,'0')}</span></div>
            )}
            <QuestionForm questions={simpleQuestions} value={answers} onChange={onAnswersChange} />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleSaveDraft} disabled={submitting}>
                Save Draft
              </Button>
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

