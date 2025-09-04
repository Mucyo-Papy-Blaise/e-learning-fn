'use client'
import { Fragment } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type SimpleQuestion = {
  id: string
  type: 'multiple_choice' | 'written'
  question: string
  options?: string[]
}

type Props = {
  questions: SimpleQuestion[]
  value: Record<string, string>
  onChange: (next: Record<string, string>) => void
  disabled?: boolean
}

export default function QuestionForm({ questions, value, onChange, disabled }: Props) {
  const setAnswer = (qid: string, ans: string) => {
    const next = { ...value, [qid]: ans }
    onChange(next)
  }
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-lg border bg-white p-4">
          <div className="font-medium mb-3">{idx + 1}. {q.question}</div>
          {q.type === 'multiple_choice' ? (
            <RadioGroup
              value={value[q.id] ?? ''}
              onValueChange={(v) => setAnswer(q.id, v)}
              className="space-y-2"
              disabled={disabled}
            >
              {q.options?.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem id={`${q.id}-${i}`} value={opt} />
                  <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              value={value[q.id] ?? ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              disabled={disabled}
              placeholder="Type your answer here..."
              className="min-h-24"
            />
          )}
        </div>
      ))}
    </div>
  )
}

