import { NextResponse } from 'next/server'
import { rubrics } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const { assignmentId } = params
  const rubric = rubrics[assignmentId] || []
  return NextResponse.json({ assignmentId, rubric })
}

