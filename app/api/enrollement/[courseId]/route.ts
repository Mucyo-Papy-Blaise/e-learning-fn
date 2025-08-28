import { NextResponse } from 'next/server'
import { enrollments } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params
  const data = enrollments.find(e => e.course_id === courseId)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

