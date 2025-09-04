'use client'
import { useEffect, useState } from 'react'
import { listSubmissionsForCourse, getExamById } from '@/app/lib/api'
import type { Exam, ExamSubmission } from '@/lib/types/assessments'
import { useParams, useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ExamSubmissionsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [subs, setSubs] = useState<ExamSubmission[]>([])

  useEffect(() => {
    let mounted = true
    if (!id) return
    getExamById(id).then(r => { if (mounted && r.ok) setExam(r.data) })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    let mounted = true
    if (!exam) return
    listSubmissionsForCourse(exam.course).then(r => { if (mounted && r.ok) setSubs(r.data) })
    return () => { mounted = false }
  }, [exam])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Submissions - {exam?.title}</h1>
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Auto Score</TableHead>
                <TableHead>Manual Score</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.filter(s => s.examId === id).map(s => (
                <TableRow key={s._id}>
                  <TableCell className="font-medium">{s.studentId}</TableCell>
                  <TableCell>{s.autoScore ?? 0}</TableCell>
                  <TableCell>{s.manualScore ?? 0}</TableCell>
                  <TableCell>{(s.autoScore ?? 0) + (s.manualScore ?? 0)}</TableCell>
                  <TableCell>
                    <button className="text-primary underline" onClick={() => router.push(`/instructor/exams/${id}/grade/${s._id}`)}>Grade</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

