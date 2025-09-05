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
  const [modulesAdded, setModulesAdded] = useState<Array<{ _id: string; title: string ; description: string}>>([])
  const [lessonsAdded, setLessonsAdded] = useState<Array<{ _id: string; title: string; module_id: string }>>([])
  const [isBusy, setIsBusy] = useState<boolean>(false)

  // Step 2 - Module local form state
  const [moduleTitle, setModuleTitle] = useState<string>("")
  const [moduleDescription, setModuleDescription] = useState<string>("")
  // duration in hours per backend: duration_hours
  const [moduleDurationHours, setModuleDurationHours] = useState<number>(1)

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
      // Create module with required duration_hours field
      const module = await api.createModule(createdCourseId, moduleTitle, moduleDescription, moduleDurationHours || 1)
      setModulesAdded((prev) => [...prev, { _id: module._id, title: module.title, description: module.description }])
      setLessonModuleId((id) => id || module._id)
      setModuleTitle(""); setModuleDescription(""); setModuleDurationHours(1)
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
  <div className="space-y-6">
    {/* Header Section */}
    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Add Course Modules</h2>
        <p className="text-sm text-gray-600 mt-1">Build your course structure by adding modules</p>
      </div>
      <button 
        type="button" 
        onClick={() => setStep(3)} 
        className="text-sm text-blue-600 hover:text-blue-700 underline font-medium"
      >
        Skip for now
      </button>
    </div>

    {/* Module Input Form */}
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Module Details</h3>
      
      <div className="space-y-4">
        {/* Module Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Module Title
          </label>
          <input 
            value={moduleTitle} 
            onChange={(e) => setModuleTitle(e.target.value)} 
            placeholder="Enter module title" 
            className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Module Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea 
            value={moduleDescription} 
            onChange={(e) => setModuleDescription(e.target.value)} 
            placeholder="Describe what this module covers..." 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Module Duration (Hours) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (hours)
          </label>
          <input 
            type="number" 
            value={moduleDurationHours} 
            onChange={(e) => setModuleDurationHours(Number(e.target.value))} 
            placeholder="1" 
            min="1"
            className="w-32 h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Add Module Button */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <button 
          type="button" 
          disabled={!createdCourseId || isBusy || !moduleTitle} 
          onClick={addModule} 
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-200" 
          style={{ backgroundColor: 'var(--brand-blue)' }}
        >
          {isBusy ? 'Adding...' : 'Add Module'}
        </button>
        <span className="text-sm text-gray-500 font-medium">
          {modulesAdded.length} {modulesAdded.length === 1 ? 'module' : 'modules'} added
        </span>
      </div>
    </div>

    {/* Added Modules List */}
    {modulesAdded.length > 0 && (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Added Modules</h3>
        <div className="space-y-3">
          {modulesAdded.map((module, index) => (
            <div key={module._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{module.title}</h4>
                {module.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{module.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
                      <TiptapEditor
                        name="lesson-content"
                        content={lessonContent}
                        onChange={setLessonContent}
                        placeholder="Enter lesson content"
                        className="bg-white border border-gray-300 rounded-md"
                      />
                    </div>
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
