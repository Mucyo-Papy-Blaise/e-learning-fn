"use client"

import { Book, Calendar, Clock, Users, FileText, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchCourseById } from "@/lib/api/courses"

interface SyllabusData {
  courseInfo: {
    title: string
    code?: string
    credits?: string
    term?: string
    instructor?: string
    email?: string
    officeHours?: string
    officeLocation?: string
  }
  description?: string
  objectives?: string[]
  schedule?: { week: string; topic: string; readings?: string; assignments?: string }[]
  grading?: Record<string, { percentage: number; description: string }>
  policies?: string[]
}

const defaultSyllabus: SyllabusData = {
  courseInfo: { title: "" },
}

export default function CourseSyllabusPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [syllabusData, setSyllabusData] = useState<SyllabusData>(defaultSyllabus)

  useEffect(() => {
    const load = async () => {
      try {
        const course = await fetchCourseById(courseId)
        setSyllabusData({
          courseInfo: {
            title: course?.title || '',
            instructor: course?.instructor_id || '',
          },
          description: course?.description || '',
        })
      } catch {
        setSyllabusData(defaultSyllabus)
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
          <span className="text-gray-400">›</span> Syllabus
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <FileText className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        {/* Course Information */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Course Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Course Title:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Course Code:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.code}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Credits:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.credits}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Term:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.term}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Instructor:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.instructor}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Office Hours:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.officeHours}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Office Location:</span>
                <p className="text-sm text-gray-900">{syllabusData.courseInfo.officeLocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{syllabusData.description}</p>
        </div>

        {/* Learning Objectives */}
        {/* <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
          <ul className="space-y-2">
            {syllabusData.objectives?.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold text-sm">•</span>
                <span className="text-sm text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Course Schedule */}
        {/* <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Week</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Topic</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syllabusData.schedule?.map((week, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{week.week}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{week.topic}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{week.readings}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{week.assignments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Grading Policy */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grading Policy</h3>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(syllabusData.grading).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs text-gray-600">{value.description}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">{value.percentage}%</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Course Policies */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Policies</h3>
          {/* <ul className="space-y-2">
            {syllabusData?.policies.map((policy, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600 font-bold text-sm">•</span>
                <span className="text-sm text-gray-700">{policy}</span>
              </li>
            ))}
          </ul> */}
        </div>
      </main>
    </div>
  )
} 