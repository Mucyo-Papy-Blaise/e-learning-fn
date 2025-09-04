'use client'
import { useEffect, useMemo, useState } from 'react'
import { getExamById, getExamQuestions, submitExam } from '@/app/lib/api'
import type { Exam, ExamQuestion } from '@/lib/types/assessments'
import QuestionForm from '@/components/assessments/QuestionForm'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { toast } from 'react-toastify'

export default function ExamAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    Promise.all([getExamById(id), getExamQuestions(id)]).then(([e, qs]) => {
      if (!mounted) return
      if (e.ok) setExam(e.data)
      if (qs.ok) setQuestions(qs.data)
    })
    return () => { mounted = false }
  }, [id])

  const simpleQuestions = useMemo(() => questions.map(q => ({
    id: q._id,
    type: q.type,
    question: q.question,
    options: q.type === 'multiple_choice' ? (q as any).options : undefined,
  })), [questions])

  const handleSubmit = async () => {
    if (!id || !exam) return
    setSubmitting(true)
    const res = await submitExam(id, { courseId: exam.course, answers })
    setSubmitting(false)
    if (res.ok) {
      toast.success('Exam submitted')
      router.push('/student/results')
    } else {
      toast.error(res.message)
    }
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
              <BreadcrumbLink href="/student/exams">Exams</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{exam?.title ?? 'Exam'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">{exam?.title ?? 'Exam'}</h1>
        <p className="text-muted-foreground">{exam?.instructions}</p>
        <QuestionForm questions={simpleQuestions as any} value={answers} onChange={setAnswers} />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </div>
      </div>
    </div>
  )
}

