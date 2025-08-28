import { NextResponse } from 'next/server'
import { submissions, users } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const { assignmentId } = params
  const list = submissions
    .filter(s => s.assignmentId === assignmentId)
    .map(s => ({
      ...s,
      studentName: users.find(u => u._id === s.studentId)?.full_name || 'Unknown',
    }))
  return NextResponse.json({ assignmentId, submissions: list })
}

