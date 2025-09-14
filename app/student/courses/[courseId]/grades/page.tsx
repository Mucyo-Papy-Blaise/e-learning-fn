"use client"

import { GraduationCap, Eye, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getQuizAttempts, listExams, getOwnExamSubmission, getQuizById, getQuizQuestions } from "@/app/lib/api"

interface GradeRow {
  _id: string
  title?: string
  score?: number
  max_points?: number
  status?: string
  due_date?: string
  submitted_at?: string
  passed?: boolean
  type?: 'quiz' | 'exam'
}

export default function CourseGradesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const [gradesData, setGradesData] = useState<GradeRow[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [quizAttemptsRes, examsRes] = await Promise.all([
          getQuizAttempts(),
          listExams(),
        ])

        const out: GradeRow[] = []

        if (quizAttemptsRes.ok) {
          const enriched = await Promise.all(
            quizAttemptsRes.data.map(async (a: any) => {
              const quizId = typeof a.quiz_id === 'object'
                ? String(a.quiz_id._id ?? a.quiz_id)
                : a.quiz_id
              const [q, qs] = await Promise.all([
                getQuizById(quizId as any),
                getQuizQuestions(quizId as any),
              ])

              let title: string
              if (q.ok && (q.data as any)?.title) {
                title = (q.data as any).title
              } else if (typeof a.quiz_id === 'object') {
                title = a.quiz_id.title ?? String(a.quiz_id._id ?? a.quiz_id)
              } else {
                title = String(a.quiz_id)
              }

              const max = qs.ok
                ? qs.data.reduce((acc: number, q: any) => acc + (q.points || 0), 0)
                : 100
              const score = typeof a.score === 'number' ? a.score : 0

              return {
                _id: a._id,
                type: 'quiz',
                title,
                score,
                max_points: max,
                status: 'Graded',
                due_date: undefined,
                submitted_at: a.completed_at || a.started_at,
                passed: max
                  ? (score / max) * 100 >= (q.ok ? (q.data as any).pass_percentage : 50)
                  : score >= 50,
              } as GradeRow
            })
          )
          out.push(...(enriched.filter(Boolean) as GradeRow[]))
        }

        if (examsRes.ok) {
          const exams = examsRes.data.exams
          await Promise.all(
            exams.map(async (e: any) => {
              const s = await getOwnExamSubmission(e._id)
              if (s.ok && s.data) {
                const total = Number(
                  s.data.totalScore ?? (Number(s.data.autoScore || 0) + Number(s.data.manualScore || 0))
                )
                const max = Number(e.totalPoints ?? 100)
                out.push({
                  _id: s.data._id,
                  type: 'exam',
                  title: e.title,
                  score: total,
                  max_points: max,
                  status: 'Graded',
                  due_date: undefined,
                  submitted_at: undefined,
                  passed: e.passingScore != null ? total >= e.passingScore : total >= 0.5 * max,
                })
              }
            })
          )
        }

        if (mounted) {
          setGradesData(out)
        }
      } catch {
        if (mounted) setGradesData([])
      }
    }
    load()
    return () => { mounted = false }
  }, [courseId])

  const calculateOverallGrade = () => {
    const gradedAssignments = gradesData.filter(grade => grade.status === "Graded" && typeof grade.score === 'number' && typeof grade.max_points === 'number')
    if (gradedAssignments.length === 0) return "N/A"
    const totalPoints = gradedAssignments.reduce((sum, grade) => {
      return sum + (grade.score as number)
    }, 0)
    const maxPoints = gradedAssignments.reduce((sum, grade) => {
      return sum + (grade.max_points as number)
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
                    Outcome
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
                  <tr key={grade._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.title || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={grade.passed ? "text-green-600" : "text-red-600"}>
                        {grade.passed === undefined ? '' : grade.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-green-600">
                        {typeof grade.score === 'number' && typeof grade.max_points === 'number' ? `${grade.score}/${grade.max_points}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-green-600">
                        {typeof grade.score === 'number' && typeof grade.max_points === 'number' ? `${Math.round((grade.score / grade.max_points) * 100)}%` : ''}
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
                      {grade.due_date ? new Date(grade.due_date).toLocaleDateString() : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.submitted_at ? new Date(grade.submitted_at).toLocaleDateString() : ''}
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