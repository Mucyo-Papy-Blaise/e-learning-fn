import { NextResponse } from 'next/server'
import { enrollments, users } from '@/lib/instructorData'

export async function GET(
  _req: Request,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params
  const student = users.find(u => u._id === studentId)
  const progress = enrollments.filter(e => e.user_id === studentId)
  return NextResponse.json({ student: { id: studentId, name: student?.full_name }, progress })
}

