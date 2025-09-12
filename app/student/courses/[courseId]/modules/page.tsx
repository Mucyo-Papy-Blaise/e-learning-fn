"use client"

import { courseToDoItems, recentFeedback } from "@/lib/data"
import {
  Bell,
  CalendarDays,
  CheckCircle,
  Circle,
  CircleDot,
  Eye,
  ChevronDown,
  ChevronRight,
  FileText,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchModulesByCourseId } from "@/lib/api/courses"

export default function CourseModulesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({})
  const [courseModules, setCourseModules] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const mods = await fetchModulesByCourseId(courseId)
        setCourseModules(mods || [])
      } catch {
        setCourseModules([])
      }
    }
    load()
  }, [courseId])

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {}
    for (const m of courseModules) {
      allOpen[m.id] = true
    }
    setOpenModules(allOpen)
  }

  const collapseAll = () => {
    setOpenModules({})
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-sm font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
            Communicating_for_Impact
          </Link>{" "}
          <span className="text-gray-400">›</span> Modules
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300" onClick={collapseAll}>
            Collapse All
          </Button>
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            Export Course Content
          </Button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
            <Eye className="h-5 w-5" />
            <span className="sr-only">View Course Stream</span>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
            <CalendarDays className="h-5 w-5" />
            <span className="sr-only">View Calendar</span>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="sr-only">View Course Notifications</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          {courseModules.map((module, index) => (
            <div key={module.id} className="rounded-md border border-gray-200 bg-white shadow-sm">
              <div 
                className="flex w-full items-center justify-between p-4 text-left font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-2">
                  {openModules[module.id] ? (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  )}
                  <span>{module.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {module.prerequisites && <span className="text-xs">Prerequisites: {module.prerequisites}</span>}
                  {module.id === "course-evaluation" && (
                    <Button variant="outline" className="h-7 text-xs bg-transparent border-gray-300">
                      Complete One Item
                    </Button>
                  )}
                </div>
              </div>
              
              {openModules[module.id] && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2">
                    {(module.items || module.lessons || []).map((item: any, itemIndex: number) => (
                      <div 
                        key={itemIndex} 
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-50"
                      >
                        {item.type === "page" && <FileText className="h-4 w-4 text-gray-500" />}
                        {item.type === "assignment" && <ClipboardList className="h-4 w-4 text-gray-500" />}
                        <Link
                          href={`/student/courses/${courseId}/pages/${item.url || item._id}`}
                          className="text-sm text-blue-600 hover:underline flex-1"
                        >
                          {item.title}
                        </Link>
                        {item.dueDate && (
                          <span className="ml-auto text-xs text-gray-500">
                            {item.dueDate} {item.points}
                          </span>
                        )}
                        {item.status && <span className="ml-auto text-xs text-gray-500">{item.status}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right sidebar for "To Do" and "Recent Feedback" */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-gray-700">To Do</h3>
            <div className="space-y-3">
              {courseToDoItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CircleDot className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{item.title}</span>
                    <span className="text-xs text-gray-500">
                      {item.points} points • {item.dueDate}
                    </span>
                    <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                      {item.courseGroups.map((group, gIndex) => (
                        <span key={gIndex} className="rounded-full bg-gray-100 px-2 py-0.5">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-gray-700">Recent Feedback</h3>
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="flex flex-col">
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                    {feedback.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {feedback.status === "Incomplete" ? (
                      <Circle className="h-3 w-3 text-gray-400" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    <span>{feedback.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{feedback.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
