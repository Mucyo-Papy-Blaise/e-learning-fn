'use client'
import { useEffect, useState } from 'react'
import { listSubmissionsForCourse, getExamById } from '@/app/lib/api'
import type { Exam, ExamSubmission } from '@/lib/types/assessments'
import { useParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'

export default function ExamSubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [subs, setSubs] = useState<ExamSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!id) return
    getExamById(id).then(r => { if (mounted && r.ok) setExam(r.data) })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    let mounted = true
    if (!exam) return
    listSubmissionsForCourse(exam.course).then(r => { if (mounted) { if (r.ok) setSubs(r.data); setLoading(false) } })
    return () => { mounted = false }
  }, [exam])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor">Instructor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/instructor/exams/${id}/submissions`}>Exams</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Submissions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Submissions - {exam?.title}</h1>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Auto Score</TableHead>
                  <TableHead>Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.filter(s => s.examId === id).map(s => (
                  <TableRow key={s._id}>
                    <TableCell className="font-medium">{s.studentId}</TableCell>
                    <TableCell>{(s.totalScore != null ? s.totalScore : (s.autoScore ?? 0) + (s.manualScore ?? 0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

