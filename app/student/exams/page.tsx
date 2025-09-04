'use client'
import { useEffect, useState } from 'react'
import { listExams } from '@/app/lib/api'
import type { Exam } from '@/lib/types/assessments'
import ExamCard from '@/components/assessments/ExamCard'

export default function StudentExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    listExams().then(res => {
      if (!mounted) return
      if (res.ok) setExams(res.data.exams)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Exams</h1>
        {loading ? (
          <div className="text-muted-foreground">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-muted-foreground">No exams available.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map(e => (
              <ExamCard key={e._id} exam={e} href={`/student/exams/${e._id}`} cta="Attempt" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

