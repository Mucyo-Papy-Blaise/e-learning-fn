import { NextResponse } from 'next/server'
import { computeCourseAnalytics, getCourseStudentsWithProgress } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const analytics = computeCourseAnalytics(courseId)
  const students = getCourseStudentsWithProgress(courseId)
  return NextResponse.json({ analytics, students })
}

