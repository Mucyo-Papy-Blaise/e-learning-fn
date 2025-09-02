"use client"

import { Megaphone, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import CourseAnnouncements from "@/components/student/course-anouncement"

export default function CourseAnnouncementsPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-sm font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
            Communicating_for_Impact
          </Link>{" "}
          <span className="text-gray-400">›</span> Announcements
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <Megaphone className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <CourseAnnouncements courseId={courseId} />
      </main>
    </div>
  )
}