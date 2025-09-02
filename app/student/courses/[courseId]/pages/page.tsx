"use client"

import { pageContentData } from "@/lib/data"
import { FileText, Clock, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchModulesByCourseId } from "@/lib/api/courses"

export default function CoursePagesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [allPages, setAllPages] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const modules = await fetchModulesByCourseId(courseId)
        const pages = (modules || []).flatMap((module: any) =>
          (module.items || module.lessons || []).map((item: any) => ({
            ...item,
            moduleTitle: module.title,
            url: String(item.url || item._id || "")
          }))
        )
        setAllPages(pages)
      } catch {
        setAllPages([])
      }
    }
    load()
  }, [courseId])

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
            Communicating_for_Impact
          </Link>{" "}
          <span className="text-gray-400">›</span> Pages
        </h1>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">All Pages</h2>
            <p className="text-sm text-gray-600 mt-1">Browse all learning content pages</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {allPages.map((page, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <Link
                        href={`/student/courses/${courseId}/pages/${page.url}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {page.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{page.moduleTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-300" />
                    <span className="text-xs text-gray-500">Not started</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 