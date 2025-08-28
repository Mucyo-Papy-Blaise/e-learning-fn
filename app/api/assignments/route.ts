import { NextResponse } from 'next/server'
import { assignments, assignmentAttachments } from '@/lib/instructorData'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 415 })
  }
  const form = await req.formData()
  const course_id = String(form.get('course_id') || '')
  const title = String(form.get('title') || '')
  const description = String(form.get('description') || '')
  const available_after = String(form.get('available_after') || '')
  const due_date = String(form.get('due_date') || '')
  const submission_type = String(form.get('submission_type') || '')
  const allowed_attempts = Number(form.get('allowed_attempts') || 1)
  const instructions = form.getAll('instructions[]').map(v => String(v))
  const attachments = form.getAll('attachments[]') as File[]

  if (!course_id || !title || !submission_type) {
    return NextResponse.json({ error: 'course_id, title, submission_type are required' }, { status: 400 })
  }

  const id = `a_${Date.now()}`
  assignments.push({
    id,
    title,
    dueDate: due_date,
    availableAfter: available_after,
    status: 'open',
    points: 100,
    submissionType: submission_type,
    attempts: 0,
    allowedAttempts: allowed_attempts,
    introduction: description,
    instructions: instructions.map((s, idx) => ({ step: `S${idx + 1}`, content: s })),
  })

  if (attachments && attachments.length) {
    assignmentAttachments[id] = attachments.map((f, idx) => ({ id: `${id}_att_${idx}`, name: f.name, size: f.size, type: f.type }))
  }

  return NextResponse.json({
    id,
    course_id,
    title,
    description,
    available_after,
    due_date,
    submission_type,
    allowed_attempts,
    instructions,
    attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
  }, { status: 201 })
}

