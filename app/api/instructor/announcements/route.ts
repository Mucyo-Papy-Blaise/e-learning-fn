import { NextResponse } from 'next/server'
import { announcements, Announcement, users, enrollments, pushNotification } from '@/lib/instructorData'

export async function POST(req: Request) {
  const body = await req.json()
  const { courseId, title, message } = body as { courseId: string; title: string; message: string }
  if (!courseId || !title || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const newAnnouncement: Announcement = {
    id: `ann_${Date.now()}`,
    courseId,
    title,
    message,
    createdAtISO: new Date().toISOString(),
  }
  announcements.unshift(newAnnouncement)
  // Notify all enrolled students in the course
  const studentIds = new Set(enrollments.filter(e => e.course_id === courseId).map(e => e.user_id))
  for (const studentId of Array.from(studentIds)) {
    pushNotification({
      id: `not_${Date.now()}_${studentId}`,
      recipientId: studentId,
      type: 'announcement',
      title,
      message,
      createdAtISO: new Date().toISOString(),
      read: false,
      meta: { courseId },
    })
  }
  return NextResponse.json(newAnnouncement, { status: 201 })
}

