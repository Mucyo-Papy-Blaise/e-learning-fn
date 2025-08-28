import { NextResponse } from 'next/server'
import { getCourseStudentsWithProgress } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const students = getCourseStudentsWithProgress(courseId)
  return NextResponse.json({ courseId, students })
}

