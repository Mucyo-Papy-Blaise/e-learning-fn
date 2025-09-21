'use client'
import { Fragment } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export type SimpleQuestion = {
  id: string
  type: 'multiple_choice'
  question: string
  options?: string[]
}

type Props = {
  questions: SimpleQuestion[]
  value: Record<string, string[]>
  onChange: (next: Record<string, string[]>) => void
  disabled?: boolean
}

export default function QuestionForm({ questions, value, onChange, disabled }: Props) {
  const toggleAnswer = (qid: string, opt: string) => {
    const current = value[qid] ?? []
    const exists = current.includes(opt)
    const nextForQ = exists ? current.filter(o => o !== opt) : [...current, opt]
    const next = { ...value, [qid]: nextForQ }
    onChange(next)
  }
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-lg border bg-white p-4">
          <div className="font-medium mb-3">{idx + 1}. {q.question}</div>
          <div className="space-y-2">
            {q.options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox id={`${q.id}-${i}`} checked={(value[q.id] ?? []).includes(opt)} onCheckedChange={() => toggleAnswer(q.id, opt)} disabled={disabled} />
                <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

