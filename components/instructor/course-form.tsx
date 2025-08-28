"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCourses } from "@/lib/hooks/use-courses";
import {
  BookOpen,
  Upload,
  DollarSign,
  Clock,
  Award,
  FileText,
  Loader,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import TiptapEditor from "../ui/TipTap.Editor";
import { Controller } from "react-hook-form";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
  duration_weeks: z.string().min(1, "Duration is required"),
  is_certified: z.boolean().default(false),
  thumbnail: z.any().default(null),
});

export const CourseForm = () => {
  const [step, setStep] = useState<number>(1)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      difficulty_level: "beginner",
      duration_weeks: "",
      is_certified: false,
      thumbnail: null,
    },
  });

  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)
  const [modulesAdded, setModulesAdded] = useState<Array<{ _id: string; title: string }>>([])
  const [lessonsAdded, setLessonsAdded] = useState<Array<{ _id: string; title: string; module_id: string }>>([])
  const [isBusy, setIsBusy] = useState<boolean>(false)

  // Step 2 - Module local form state
  const [moduleTitle, setModuleTitle] = useState<string>("")
  const [moduleDescription, setModuleDescription] = useState<string>("")
  const [moduleOrder, setModuleOrder] = useState<number>(0)

  // Step 3 - Lesson local form state
  const [lessonModuleId, setLessonModuleId] = useState<string>("")
  const [lessonTitle, setLessonTitle] = useState<string>("")
  const [lessonContent, setLessonContent] = useState<string>("")
  const [lessonOrder, setLessonOrder] = useState<number>(0)
  const [lessonVideo, setLessonVideo] = useState<File | null>(null)

  const { createCourse } = useCourses();
  const [create, setIsCreating] = useState(false);

  async function handleContinue() {
    if (step === 1) {
      const values = form.getValues()
      setIsBusy(true)
      try {
        const fd = new FormData()
        fd.append('title', values.title)
        fd.append('description', values.description)
        fd.append('price', values.price)
        fd.append('difficulty_level', values.difficulty_level)
        fd.append('duration_weeks', values.duration_weeks)
        fd.append('is_certified', String(values.is_certified))
        if (values.thumbnail && values.thumbnail[0]) fd.append('thumbnail', values.thumbnail[0])
        const created = await (await import('@/lib/api/courses')).createCourse(fd)
        const id = created.id || created._id
        setCreatedCourseId(id)
        setStep(2)
      } catch (e) {
        console.error(e)
      } finally {
        setIsBusy(false)
      }
      return
    }
    setStep((s) => Math.min(4, s + 1))
  }

  async function addModule() {
    if (!createdCourseId) { setStep(1); return }
    setIsBusy(true)
    try {
      const api = await import('@/lib/api/courses')
      const module = await api.createModule(createdCourseId, moduleTitle, moduleDescription, moduleOrder || 0)
      setModulesAdded((prev) => [...prev, { _id: module._id, title: module.title }])
      setLessonModuleId((id) => id || module._id)
      setModuleTitle(""); setModuleDescription(""); setModuleOrder(0)
    } catch (e) { console.error(e) } finally { setIsBusy(false) }
  }

  async function addLesson() {
    if (!lessonModuleId) return
    setIsBusy(true)
    try {
      const api = await import('@/lib/api/courses')
      const lessonResp = await api.createLesson(lessonModuleId, lessonTitle, lessonContent, 'text', 0, lessonVideo)
      const lesson = lessonResp.lesson || lessonResp
      setLessonsAdded((prev) => [...prev, { _id: lesson._id, title: lesson.title, module_id: lesson.module_id }])
      setLessonTitle(""); setLessonContent(""); setLessonOrder(0); setLessonVideo(null)
    } catch (e) { console.error(e) } finally { setIsBusy(false) }
  }

  return (
    <div className="min-h-screen bg-[color:var(--brand-light)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[color:var(--brand-navy)]">Create a Course</h1>
          <p className="text-sm text-gray-600">Step {step} of 4</p>
        </div>
        <Card className="bg-white border border-gray-200">
          <div className="p-6">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course title</label>
                    <input {...form.register("title")} className="w-full h-11 px-3 border border-gray-300 rounded-md" placeholder="e.g. Fullstack Development" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Controller control={form.control} name="description" render={({ field }) => (
                      <TiptapEditor name={field.name} content={field.value} onChange={field.onChange} placeholder="What will learners achieve?" className="bg-white border border-gray-300 rounded-md" />
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Price</label>
                      <input type="number" {...form.register("price")} className="w-full h-11 px-3 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Difficulty</label>
                      <select {...form.register("difficulty_level")} className="w-full h-11 px-3 border border-gray-300 rounded-md bg-white">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration (weeks)</label>
                      <input type="number" {...form.register("duration_weeks")} className="w-full h-11 px-3 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thumbnail</label>
                    <input type="file" accept="image/*" {...form.register("thumbnail")} className="w-full" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-gray-900">Add Modules</h2>
                    <button type="button" onClick={() => setStep(3)} className="text-sm text-gray-600 underline">Skip for now</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="Title" className="h-11 px-3 border border-gray-300 rounded-md" />
                    <input value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} placeholder="Description" className="h-11 px-3 border border-gray-300 rounded-md" />
                    <input type="number" value={moduleOrder} onChange={(e) => setModuleOrder(Number(e.target.value))} placeholder="Order" className="h-11 px-3 border border-gray-300 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={!createdCourseId || isBusy || !moduleTitle} onClick={addModule} className="px-4 h-10 rounded-md text-sm text-white disabled:opacity-50" style={{ backgroundColor: 'var(--brand-blue)' }}>Add module</button>
                    <span className="text-xs text-gray-500">{modulesAdded.length} module(s) added</span>
                  </div>
                  {modulesAdded.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {modulesAdded.map(m => (<li key={m._id}>{m.title}</li>))}
                    </ul>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-gray-900">Add Lessons</h2>
                    <button type="button" onClick={() => setStep(4)} className="text-sm text-gray-600 underline">Skip for now</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select value={lessonModuleId} onChange={(e) => setLessonModuleId(e.target.value)} className="h-11 px-3 border border-gray-300 rounded-md bg-white">
                      <option value="">Select module</option>
                      {modulesAdded.map(m => (
                        <option key={m._id} value={m._id}>{m.title}</option>
                      ))}
                    </select>
                    <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Lesson title" className="h-11 px-3 border border-gray-300 rounded-md" />
                    <input value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} placeholder="Content" className="h-11 px-3 border border-gray-300 rounded-md md:col-span-2" />
                    <div className="grid grid-cols-2 gap-3 md:col-span-2">
                      <input type="number" value={lessonOrder} onChange={(e) => setLessonOrder(Number(e.target.value))} placeholder="Order" className="h-11 px-3 border border-gray-300 rounded-md" />
                      <input type="file" accept="video/*" onChange={(e) => setLessonVideo(e.target.files?.[0] || null)} className="h-11" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={!lessonModuleId || !lessonTitle || isBusy} onClick={addLesson} className="px-4 h-10 rounded-md text-sm text-white disabled:opacity-50" style={{ backgroundColor: 'var(--brand-blue)' }}>Add lesson</button>
                    <span className="text-xs text-gray-500">{lessonsAdded.length} lesson(s) added</span>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Finally, create assignments to assess learners.</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button type="button" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-4 h-10 border border-gray-300 rounded-md text-sm disabled:opacity-50">Back</button>
                {step < 4 ? (
                  <button type="button" onClick={handleContinue} className="px-4 h-10 rounded-md text-sm text-white disabled:opacity-50" disabled={isBusy} style={{ backgroundColor: 'var(--brand-blue)' }}>{step === 1 ? (isBusy ? 'Creating…' : 'Create course') : 'Continue'}</button>
                ) : (
                  <button type="button" onClick={() => setStep(1)} className="px-4 h-10 rounded-md text-sm text-white" style={{ backgroundColor: 'var(--brand-blue)' }}>
                    Finish
                  </button>
                )}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};
