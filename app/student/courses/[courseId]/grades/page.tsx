"use client"

import { GraduationCap, Eye, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock grades data
const gradesData = [
  {
    id: "term-paper-summative",
    title: "Term Paper_Module Summative",
    score: "18/20",
    percentage: "90%",
    status: "Graded",
    dueDate: "Jul 31",
    submittedDate: "Jul 30",
  },
  {
    id: "create-your-first-podcast",
    title: "Create Your First Podcast_Formative Assignment",
    score: "16/20",
    percentage: "80%",
    status: "Graded",
    dueDate: "Jun 29",
    submittedDate: "Jun 28",
  },
  {
    id: "essay-outline",
    title: "Essay Outline_Formative Assignment",
    score: "Incomplete",
    percentage: "0%",
    status: "Not Submitted",
    dueDate: "Jun 18",
    submittedDate: "-",
  },
  {
    id: "persuasive-mission-presentation",
    title: "Persuasive Mission Presentation_Formative Assignment",
    score: "Pending",
    percentage: "Pending",
    status: "Submitted",
    dueDate: "Jul 11",
    submittedDate: "Jul 10",
  },
  {
    id: "reflection-activity",
    title: "Reflection Activity",
    score: "15/15",
    percentage: "100%",
    status: "Graded",
    dueDate: "Jul 8",
    submittedDate: "Jul 7",
  },
]

export default function CourseGradesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params

  const calculateOverallGrade = () => {
    const gradedAssignments = gradesData.filter(grade => grade.status === "Graded" && grade.score !== "Incomplete")
    if (gradedAssignments.length === 0) return "N/A"
    
    const totalPoints = gradedAssignments.reduce((sum, grade) => {
      const [score] = grade.score.split('/')
      return sum + parseInt(score)
    }, 0)
    
    const maxPoints = gradedAssignments.reduce((sum, grade) => {
      const [, max] = grade.score.split('/')
      return sum + parseInt(max)
    }, 0)
    
    return `${totalPoints}/${maxPoints} (${Math.round((totalPoints / maxPoints) * 100)}%)`
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-sm font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
            Communicating_for_Impact
          </Link>{" "}
          <span className="text-gray-400">›</span> Grades
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </Button>
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <Eye className="h-4 w-4 mr-2" />
            View All Grades
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        {/* Overall Grade Summary */}
        <div className="rounded-md border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Grade Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Overall Grade</p>
              <p className="text-2xl font-bold text-blue-600">{calculateOverallGrade()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {gradesData.filter(g => g.status === "Graded").length}/{gradesData.length}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {gradesData.filter(g => g.status === "Submitted" || g.status === "Not Submitted").length}
              </p>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Assignment Grades</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradesData.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        grade.score === "Incomplete" ? "text-red-600" : 
                        grade.score === "Pending" ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {grade.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${
                        grade.percentage === "0%" ? "text-red-600" : 
                        grade.percentage === "Pending" ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {grade.percentage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        grade.status === "Graded" ? "bg-green-100 text-green-800" :
                        grade.status === "Submitted" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {grade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.submittedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
} 