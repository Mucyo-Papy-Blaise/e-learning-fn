"use client"

import { Megaphone, Calendar, User, Pin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock announcements data
const announcementsData = [
  {
    id: "1",
    title: "Welcome to Communicating for Impact!",
    content: "Welcome everyone to our course! I'm excited to work with all of you this term. Please make sure to review the syllabus and complete the introductory assignment by the end of the week.",
    author: "Dr. Sarah Johnson",
    date: "May 20, 2025",
    isPinned: true,
    isRead: true,
  },
  {
    id: "2",
    title: "Important: Assignment Due Date Extended",
    content: "Due to technical difficulties, I'm extending the deadline for the Essay Outline assignment until Friday, June 20th at 11:59 PM. Please take advantage of this extra time to submit your best work.",
    author: "Dr. Sarah Johnson",
    date: "June 15, 2025",
    isPinned: true,
    isRead: false,
  },
  {
    id: "3",
    title: "Podcast Assignment Guidelines Updated",
    content: "I've updated the guidelines for the podcast creation assignment. Please check the assignment page for the latest requirements and submission instructions.",
    author: "Dr. Sarah Johnson",
    date: "June 25, 2025",
    isPinned: false,
    isRead: false,
  },
  {
    id: "4",
    title: "Office Hours This Week",
    content: "I'll be holding additional office hours this week on Wednesday from 3-5 PM to help with any questions about the upcoming term paper. Feel free to drop by or schedule an appointment.",
    author: "Dr. Sarah Johnson",
    date: "July 25, 2025",
    isPinned: false,
    isRead: true,
  },
  {
    id: "5",
    title: "Course Evaluation Reminder",
    content: "Don't forget to complete the course evaluation! Your feedback is valuable and helps improve the course for future students. The evaluation closes on July 30th.",
    author: "Dr. Sarah Johnson",
    date: "July 28, 2025",
    isPinned: false,
    isRead: false,
  },
]

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
        {/* Regular Announcements */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {announcementsData.map((announcement) => (
              <div key={announcement.id} className={`px-6 py-4 hover:bg-gray-50 ${!announcement.isRead ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                      {!announcement.isRead && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {announcement.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {announcement.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {announcementsData.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements</h3>
            <p className="text-sm text-gray-500">There are no announcements for this course yet.</p>
          </div>
        )}
      </main>
    </div>
  )
} 