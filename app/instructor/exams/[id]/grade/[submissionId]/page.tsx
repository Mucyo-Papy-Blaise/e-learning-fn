'use client'
import { useEffect, useState } from 'react'
import { getExamById, getExamQuestions, manualGradeSubmission, listSubmissionsForCourse } from '@/app/lib/api'
import type { Exam, ExamQuestion, ExamSubmission } from '@/lib/types/assessments'
import GradingForm from '@/components/assessments/GradingForm'
import { useParams, useRouter } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { toast } from 'react-toastify'

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
    getExamById(examId).then(async (r) => {
      if (mounted && r.ok) {
        setExam(r.data)
        // Load questions with answers for grading view
        const qs = await getExamQuestions(examId, true)
        if (qs.ok) setQuestions(qs.data)
        // Load submissions for the course and pick by submissionId
        const subs = await listSubmissionsForCourse(r.data.course)
        if (subs.ok) {
          const found = subs.data.find(s => s._id === submissionId)
          if (found) setSubmission(found)
        }
      }
    })
    return () => { mounted = false }
  }, [examId])

  const handleSubmit = async (payload: Array<{ questionId: string; pointsAwarded: number; feedback?: string }>) => {
    const res = await manualGradeSubmission(submissionId, payload as any)
    if (res.ok) {
      toast.success('Grades saved')
      router.push(`/instructor/exams/${examId}/submissions`)
    } else {
      toast.error(res.message)
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor">Instructor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/instructor/exams/${examId}/submissions`}>Submissions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Grade</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Grade Submission</h1>
        <GradingForm questions={questions} submission={submission} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

