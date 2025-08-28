import { NextResponse } from 'next/server'
import { computeDashboardSummary, users } from '@/lib/instructorData'

export async function GET() {
  // In a real app, derive instructorId from auth token/session
  const instructor = users.find(u => u.role === 'instructor')
  const instructorId = instructor?._id || 'u1'
  const summary = computeDashboardSummary(instructorId)
  return NextResponse.json({ instructorId, summary })
}

