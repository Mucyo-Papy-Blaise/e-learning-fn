'use client'
import { useEffect, useState } from 'react'
import { createQuiz, createQuizQuestion } from '@/app/lib/api'
import type { Quiz } from '@/lib/types/assessments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { toast } from 'react-toastify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosInstance from '@/lib/axios'

type NewQuestion = {
  question: string
  options: string[]
  correct_answer: string
  points: number
}

export default function NewQuizPage() {
  const [courses, setCourses] = useState<Array<{ _id: string; title: string }>>([])
  const [modules, setModules] = useState<Array<{ _id: string; title: string }>>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingModules, setLoadingModules] = useState(false)
  const [form, setForm] = useState<{
    module_id: string
    title: string
    description: string
    pass_percentage: string
    max_attempts: string
    time_limit: string
  }>({
    module_id: '',
    title: '',
    description: '',
    pass_percentage: '70',
    max_attempts: '1',
    time_limit: '15',
  })
  const [questions, setQuestions] = useState<NewQuestion[]>([])
  const [saving, setSaving] = useState(false)

  const addQuestion = () =>
    setQuestions((qs) => [
      ...qs,
      { question: '', options: ['', '', '', ''], correct_answer: '', points: 1 },
    ])

  const updateQuestion = (idx: number, next: Partial<NewQuestion>) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...next } : q)))
  }

  const updateOption = (idx: number, optIdx: number, val: string) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === idx ? { ...q, options: q.options.map((o, j) => (j === optIdx ? val : o)) } : q
      )
    )
  }

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true)
      try {
        const r = await axiosInstance.get('/api/instructor/courses')
        const list = r.data?.courses || r.data || []
        setCourses(list)
      } catch (e) {
        toast.error('Failed to load courses')
        setCourses([])
      } finally {
        setLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  const handleCourseChange = async (courseId: string) => {
    setForm((f) => ({ ...f, module_id: '' }))
    setLoadingModules(true)
    try {
      const r = await axiosInstance.get(`/api/courses/${courseId}/modules`)
      setModules(r.data || [])
    } catch (e) {
      toast.error('Failed to load modules')
      setModules([])
    } finally {
      setLoadingModules(false)
    }
  }

  const handleCreate = async () => {
    setSaving(true)
    const payload = {
      module_id: form.module_id,
      title: form.title,
      description: form.description,
      pass_percentage: Number(form.pass_percentage),
      max_attempts: Number(form.max_attempts),
      time_limit: Number(form.time_limit),
    } as Omit<Quiz, '_id'>

    const res = await createQuiz(payload)
    if (res.ok) {
      const quizId = res.data._id
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        await createQuizQuestion(quizId, {
          quiz_id: quizId,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points,
        } as any)
      }
      setSaving(false)
      toast.success('Quiz created')
    } else {
      setSaving(false)
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
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold">Create Quiz</h1>

        {/* Quiz Details Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {/* Course */}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select onValueChange={handleCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingCourses ? 'Loading courses...' : 'Select a course'} />
                </SelectTrigger>
                <SelectContent>
                  {loadingCourses
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="h-8 bg-gray-200 animate-pulse rounded my-1 mx-2" />
                      ))
                    : courses.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.title}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            {/* Module */}
            <div className="space-y-2">
              <Label>Module</Label>
              <Select
                value={form.module_id}
                onValueChange={(v) => setForm({ ...form, module_id: v })}
                disabled={!form.module_id && !modules.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingModules ? 'Loading modules...' : 'Select a module'} />
                </SelectTrigger>
                <SelectContent>
                  {loadingModules
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="h-8 bg-gray-200 animate-pulse rounded my-1 mx-2" />
                      ))
                    : modules.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.title}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Pass % */}
            <div>
              <Label>Pass %</Label>
              <Input
                type="number"
                value={form.pass_percentage}
                onChange={(e) => setForm({ ...form, pass_percentage: e.target.value })}
              />
            </div>

            {/* Max attempts */}
            <div>
              <Label>Max attempts</Label>
              <Input
                type="number"
                value={form.max_attempts}
                onChange={(e) => setForm({ ...form, max_attempts: e.target.value })}
              />
            </div>

            {/* Time limit */}
            <div>
              <Label>Time limit (min)</Label>
              <Input
                type="number"
                value={form.time_limit}
                onChange={(e) => setForm({ ...form, time_limit: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <Button variant="secondary" onClick={addQuestion}>
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <Card key={idx} className="bg-white">
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label>Question</Label>
                  <Textarea value={q.question} onChange={(e) => updateQuestion(idx, { question: e.target.value })} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {q.options.map((o, i) => (
                    <div key={i}>
                      <Label>Option {i + 1}</Label>
                      <Input value={o} onChange={(e) => updateOption(idx, i, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Correct answer</Label>
                    <Input value={q.correct_answer} onChange={(e) => updateQuestion(idx, { correct_answer: e.target.value })} />
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input type="number" value={q.points} onChange={(e) => updateQuestion(idx, { points: Number(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? 'Saving...' : 'Create Quiz'}
          </Button>
        </div>
      </div>
    </div>
  )
}
