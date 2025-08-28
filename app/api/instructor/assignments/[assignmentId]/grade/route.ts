import { NextResponse } from 'next/server'
import { submissions, pushNotification } from '@/lib/instructorData'

export async function POST(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const { assignmentId } = params
  const body = await req.json()
  const { submissionId, gradePercent, feedback } = body as {
    submissionId: string
    gradePercent: number
    feedback?: string
  }
  if (!submissionId || typeof gradePercent !== 'number') {
    return NextResponse.json({ error: 'submissionId and gradePercent are required' }, { status: 400 })
  }
  const sub = submissions.find(s => s.id === submissionId && s.assignmentId === assignmentId)
  if (!sub) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }
  sub.gradePercent = gradePercent
  sub.feedback = feedback
  sub.status = 'graded'
  // Notify student
  pushNotification({
    id: `not_${Date.now()}_${sub.studentId}`,
    recipientId: sub.studentId,
    type: 'grade',
    title: 'Assignment graded',
    message: `Your submission ${sub.id} was graded: ${gradePercent}%`,
    createdAtISO: new Date().toISOString(),
    read: false,
    meta: { assignmentId },
  })
  return NextResponse.json({ success: true, submission: sub })
}

