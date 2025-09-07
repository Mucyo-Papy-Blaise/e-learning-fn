"use client";
import { Bell, CalendarDays, CheckCircle, Circle, Clock, BookOpen, FileText, X, PlayCircle, Award, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { fetchCourseById } from "@/lib/api/courses"
import { fetchCourseProgress, fetchCourseAnnouncements, fetchStudentCalendar } from "@/lib/api/student"

type Announcement = { id: string; title: string; content?: string; created_at?: string }

export default function CourseHomePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [courseTitle, setCourseTitle] = useState<string>("")
  const [instructorName, setInstructorName] = useState<string>("")
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const [completedLessons, setCompletedLessons] = useState<number>(0)
  const [totalLessons, setTotalLessons] = useState<number>(0)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [calendarItems, setCalendarItems] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [course, progress, anns, calendar] = await Promise.all([
          fetchCourseById(courseId),
          fetchCourseProgress(courseId).catch(() => null),
          fetchCourseAnnouncements(courseId).catch(() => []),
          fetchStudentCalendar().catch(() => []),
        ])
        setCourseTitle(course?.title || "")
        // Backend Course type exposes instructor_id; instructor name is not guaranteed in this response
        setInstructorName("")
        if (progress) {
          setProgressPercent(progress.progress_percentage ?? 0)
          setCompletedLessons(progress.completedLessons ?? 0)
          setTotalLessons(progress.totalLessons ?? 0)
        }
        const normalizedAnns = (Array.isArray(anns) ? anns : []).map((a: any) => ({
          id: a._id || a.id,
          title: a.title,
          content: a.content,
          created_at: a.created_at || a.publish_at || a.createdAt,
        }))
        setAnnouncements(normalizedAnns)
        const merged = Array.isArray(calendar) ? calendar : []
        const filtered = merged
          .filter((c: any) => {
            const cid = c.courseId || c.course_id?._id || c.course_id || c.course?._id || c.course
            return String(cid) === String(courseId)
          })
          .map((c: any) => ({
            ...c,
            due: c.dueDate || c.due_date || c.date,
          }))
        setCalendarItems(filtered)
      } catch (e) {
        // keep UI minimal if fails
      }
    }
    load()
  }, [courseId])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gray-900 text-white'
      case 'medium': return 'bg-gray-600 text-white'
      case 'low': return 'bg-gray-400 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            {courseTitle}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Progress: {progressPercent}%</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="max-w-7xl mx-auto w-full p-6">
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 mb-4">
                    You{'\''}re making great progress in {courseTitle}. Ready to continue?
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {instructorName && <span>Instructor: {instructorName}</span>}
                    {totalLessons > 0 && (
                      <>
                        <span>•</span>
                        <span>{completedLessons} of {totalLessons} lessons completed</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="lg:w-80">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Course Progress</span>
                      <span className="text-lg font-bold text-blue-600">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full justify-center"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                </div>
                <div className="space-y-4">
                  {calendarItems.map((deadline: any) => (
                    <div
                      key={deadline.id || deadline._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg mt-1">
                            {deadline.type === 'quiz' ? (
                              <PlayCircle className="h-4 w-4 text-gray-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{deadline.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <span>{deadline.type === 'announcement' ? 'Date' : 'Due'}: {new Date(deadline.due || deadline.dueDate || deadline.due_date || deadline.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Announcements</h3>
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg mt-1">
                        <Bell className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {a.title}
                        </h4>
                        {a.created_at && <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}