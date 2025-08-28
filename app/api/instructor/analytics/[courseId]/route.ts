import { NextResponse } from 'next/server'
import { computeCourseAnalytics } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const analytics = computeCourseAnalytics(courseId)
  return NextResponse.json(analytics)
}

