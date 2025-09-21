'use client'
import { useEffect, useState } from 'react'
import { deleteExam, getExamById, getExamQuestions, updateExam, createExamQuestion, updateExamQuestion, deleteExamQuestion } from '@/app/lib/api'
import type { Exam, ExamQuestion } from '@/lib/types/assessments'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function InstructorExamDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    Promise.all([getExamById(id), getExamQuestions(id, true)]).then(([e, qs]) => {
      if (!mounted) return
      if (e.ok) setExam(e.data)
      if (qs.ok) setQuestions(qs.data)
    })
    return () => { mounted = false }
  }, [id])

  const handleSave = async () => {
    if (!exam) return
    setSaving(true)
    const res = await updateExam(exam._id, {
      title: exam.title,
      description: exam.description,
      instructions: exam.instructions,
      startDate: exam.startDate,
      endDate: exam.endDate,
      duration: exam.duration,
      passingScore: exam.passingScore,
      totalPoints: exam.totalPoints,
    } as any)
    setSaving(false)
    if (res.ok) toast.success('Exam updated'); else toast.error(res.message)
  }

  const addMCQ = async () => {
    if (!id) return
    // MCQ-only: backend expects no type field, supports multi-correct via correct_answers
    const defaultOptions = ['Option 1', 'Option 2']
    const res = await createExamQuestion(id, { question: 'New multiple choice question', options: defaultOptions, correct_answers: [defaultOptions[0]], points: 1, order: questions.length + 1 })
    if (res.ok) setQuestions(qs => [...qs, res.data]); else toast.error(res.message)
  }

  const saveQuestion = async (q: ExamQuestion) => {
    // Validate MCQ
    if (q.type === 'multiple_choice') {
      const opts = (q as any).options || []
      const answers: string[] = (q as any).correct_answers || []
      if (!Array.isArray(opts) || opts.length < 2) {
        toast.error('Provide at least 2 options')
        return
      }
      if (!Array.isArray(answers) || answers.length < 1) {
        toast.error('Provide at least one correct answer')
        return
      }
      if (!answers.every(a => opts.includes(a))) {
        toast.error('All correct answers must be among the options')
        return
      }
      const payload: any = {
        question: q.question,
        options: opts,
        correct_answers: answers,
        points: q.points,
        order: q.order,
      }
      const res = await updateExamQuestion(q._id, payload)
      if (res.ok) toast.success('Question saved'); else toast.error(res.message)
      return
    }
    // For non-MCQ, hide in UI; but in case present, do nothing
    toast.error('Only multiple choice questions are supported')
  }

  const removeQuestion = async (qid: string) => {
    const res = await deleteExamQuestion(qid)
    if (res.ok) setQuestions(qs => qs.filter(x => x._id !== qid)); else toast.error(res.message)
  }

  const handleDelete = async () => {
    if (!id) return
    const res = await deleteExam(id)
    if (res.ok) {
      toast.success('Exam deleted')
      window.location.href = '/instructor/exams'
    } else {
      toast.error(res.message)
    }
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
              <BreadcrumbLink href="/instructor/exams">Exams</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{exam?.title ?? 'Exam'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Exam Details</h1>

        {exam && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Exam</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={exam.title} onChange={(e) => setExam({ ...exam, title: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={exam.description} onChange={(e) => setExam({ ...exam, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Instructions</Label>
                <Textarea value={exam.instructions} onChange={(e) => setExam({ ...exam, instructions: e.target.value })} />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={exam.duration ?? 0} onChange={(e) => setExam({ ...exam, duration: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Passing score</Label>
                <Input type="number" value={exam.passingScore ?? 0} onChange={(e) => setExam({ ...exam, passingScore: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Total points</Label>
                <Input type="number" value={exam.totalPoints ?? 0} onChange={(e) => setExam({ ...exam, totalPoints: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2 flex justify-between gap-2">
                <Button variant="outline" onClick={() => window.location.href = `/instructor/exams/${id}/submissions`}>View Submissions</Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={addMCQ}>Add MCQ</Button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.filter(q => q.type === 'multiple_choice').map((q) => (
            <Card key={q._id} className="bg-white">
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label>Question</Label>
                  <Textarea value={q.question} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, question: e.target.value } : x))} />
                </div>
                {q.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {(q as any).options?.map((o: string, i: number) => (
                        <div key={i} className="space-y-1">
                          <Label>Option {i + 1}</Label>
                          <div className="flex gap-2">
                            <Input value={o} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, options: (x as any).options.map((opt: string, j: number) => j === i ? e.target.value : opt) } : x))} />
                            <Button variant="outline" onClick={() => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, options: (x as any).options.filter((_: string, j: number) => j !== i) } as any : x))}>Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" onClick={() => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, options: [ ...(x as any).options ?? [], `Option ${(x as any).options?.length ? (x as any).options.length + 1 : 1}` ] } as any : x))}>Add Option</Button>
                    <div className="md:col-span-2">
                      <Label>Correct answer</Label>
                      <select className="w-full px-3 py-2 border rounded" value={(q as any).correct_answer || ''} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, correct_answer: e.target.value } as any : x))}>
                        <option value="" disabled>Select correct answer</option>
                        {(q as any).options?.map((o: string, i: number) => (
                          <option key={i} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Points</Label>
                    <Input type="number" value={q.points} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, points: Number(e.target.value) } : x))} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="destructive" onClick={() => removeQuestion(q._id)}>Remove</Button>
                  <Button onClick={() => saveQuestion(q)}>Save</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

