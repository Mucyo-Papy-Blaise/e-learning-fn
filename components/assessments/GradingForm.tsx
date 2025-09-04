'use client'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import QuestionForm, { SimpleQuestion } from './QuestionForm'
import type { ExamQuestion, ExamSubmission, UUID } from '@/lib/types/assessments'

type Props = {
  questions: ExamQuestion[]
  submission: ExamSubmission
  onSubmit: (payload: Array<{ questionId: UUID; pointsAwarded: number; feedback?: string }>) => Promise<void>
}

export default function GradingForm({ questions, submission, onSubmit }: Props) {
  const writtenQuestions = useMemo(() => questions.filter(q => q.type === 'written'), [questions])
  const [points, setPoints] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const payload = writtenQuestions.map(q => ({
      questionId: q._id,
      pointsAwarded: Number(points[q._id] ?? 0),
      feedback: feedback[q._id] || undefined,
    }))
    await onSubmit(payload)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {writtenQuestions.map((q, idx) => (
        <div key={q._id} className="rounded-lg border bg-white p-4 space-y-3">
          <div className="font-medium">{idx + 1}. {q.question}</div>
          <div>
            <Label className="text-sm text-muted-foreground">Student answer</Label>
            <div className="mt-1 whitespace-pre-wrap bg-muted/30 rounded p-3 text-sm">{submission.answers[q._id] || '(no answer)'}</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Points (/{q.points})</Label>
              <Input
                type="number"
                min={0}
                max={q.points}
                step="1"
                value={points[q._id] ?? ''}
                onChange={(e) => setPoints({ ...points, [q._id]: e.target.value })}
              />
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea
                placeholder="Optional feedback"
                value={feedback[q._id] ?? ''}
                onChange={(e) => setFeedback({ ...feedback, [q._id]: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Grades'}
        </Button>
      </div>
    </div>
  )
}

