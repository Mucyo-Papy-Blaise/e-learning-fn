'use client'
import { useEffect, useMemo, useState } from 'react'
import { deleteQuiz, getQuizById, getQuizQuestions, updateQuiz, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } from '@/app/lib/api'
import type { Quiz, QuizQuestion } from '@/lib/types/assessments'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export default function InstructorQuizDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    Promise.all([getQuizById(id), getQuizQuestions(id)]).then(([q, qs]) => {
      if (!mounted) return
      if (q.ok) setQuiz(q.data)
      if (qs.ok) setQuestions(qs.data)
    })
    return () => { mounted = false }
  }, [id])

  const handleQuizSave = async () => {
    if (!quiz) return
    setSaving(true)
    const res = await updateQuiz(quiz._id, {
      title: quiz.title,
      description: quiz.description,
      pass_percentage: quiz.pass_percentage,
      max_attempts: quiz.max_attempts,
      time_limit: quiz.time_limit,
      module_id: quiz.module_id,
    } as any)
    setSaving(false)
    if (res.ok) toast.success('Quiz updated'); else toast.error(res.message)
  }

  const addQuestion = async () => {
    if (!quiz) return
    const res = await createQuizQuestion(quiz._id, { quiz_id: quiz._id, question: 'New question', options: ['A','B','C','D'], correct_answer: 'A', points: 1 } as any)
    if (res.ok) setQuestions(qs => [...qs, res.data]); else toast.error(res.message)
  }

  const saveQuestion = async (q: QuizQuestion) => {
    const res = await updateQuizQuestion(q._id, { question: q.question, options: q.options, correct_answer: q.correct_answer, points: q.points } as any)
    if (res.ok) toast.success('Question saved'); else toast.error(res.message)
  }

  const removeQuestion = async (qid: string) => {
    const res = await deleteQuizQuestion(qid)
    if (res.ok) setQuestions(qs => qs.filter(x => x._id !== qid)); else toast.error(res.message)
  }

  const handleDelete = async () => {
    if (!quiz) return
    const res = await deleteQuiz(quiz._id)
    if (res.ok) {
      toast.success('Quiz deleted')
      window.location.href = '/instructor/quizzes'
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
              <BreadcrumbLink href="/instructor/quizzes">Quizzes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{quiz?.title ?? 'Quiz'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Quiz Details</h1>

        {quiz && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quiz</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
              </div>
              <div>
                <Label>Pass %</Label>
                <Input type="number" value={quiz.pass_percentage} onChange={(e) => setQuiz({ ...quiz, pass_percentage: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Max attempts</Label>
                <Input type="number" value={quiz.max_attempts} onChange={(e) => setQuiz({ ...quiz, max_attempts: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Time limit (min)</Label>
                <Input type="number" value={quiz.time_limit} onChange={(e) => setQuiz({ ...quiz, time_limit: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                <Button onClick={handleQuizSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = `/instructor/quizzes/${id}/attempts`}>View Attempts</Button>
            <Button variant="secondary" onClick={addQuestion}>Add Question</Button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q._id} className="bg-white">
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label>Question</Label>
                  <Textarea value={q.question} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, question: e.target.value } : x))} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {q.options.map((o, i) => (
                    <div key={i}>
                      <Label>Option {i + 1}</Label>
                      <Input value={o} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, options: x.options.map((opt, j) => j === i ? e.target.value : opt) } : x))} />
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Correct answer</Label>
                    <Input value={q.correct_answer || ''} onChange={(e) => setQuestions(prev => prev.map(x => x._id === q._id ? { ...x, correct_answer: e.target.value } : x))} />
                  </div>
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

