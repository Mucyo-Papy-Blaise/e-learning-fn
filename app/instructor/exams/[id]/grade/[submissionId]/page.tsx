'use client'
import { useEffect, useState } from 'react'
import { getExamById, getExamQuestions, manualGradeSubmission } from '@/app/lib/api'
import type { Exam, ExamQuestion, ExamSubmission } from '@/lib/types/assessments'
import GradingForm from '@/components/assessments/GradingForm'
import { useParams, useRouter } from 'next/navigation'

export default function GradeSubmissionPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params?.id as string
  const submissionId = params?.submissionId as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [submission, setSubmission] = useState<ExamSubmission | null>(null)

  useEffect(() => {
    let mounted = true
    if (!examId) return
    getExamById(examId).then(r => { if (mounted && r.ok) setExam(r.data) })
    getExamQuestions(examId, true).then(r => { if (mounted && r.ok) setQuestions(r.data) })
    // Fetch a single submission is not specified; assume passed via state or use a cached list in previous page.
    // For simplicity, redirect back if submission is not available via history state.
    const historyState = history.state as any
    if (historyState?.submission) setSubmission(historyState.submission)
    return () => { mounted = false }
  }, [examId])

  const handleSubmit = async (payload: Array<{ questionId: string; pointsAwarded: number; feedback?: string }>) => {
    const res = await manualGradeSubmission(submissionId, payload as any)
    if (res.ok) {
      alert('Saved')
      router.push(`/instructor/exams/${examId}/submissions`)
    } else {
      alert(res.message)
    }
  }

  if (!submission) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-muted-foreground">Submission not loaded. Go back to submissions list.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Grade Submission</h1>
        <GradingForm questions={questions} submission={submission} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

