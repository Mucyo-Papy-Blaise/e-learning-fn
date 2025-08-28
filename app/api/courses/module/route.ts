import { NextResponse } from 'next/server'
import { modules } from '@/lib/instructorData'

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
  const order = Number(form.get('order') || 0)
  if (!course_id || !title) {
    return NextResponse.json({ error: 'course_id and title are required' }, { status: 400 })
  }
  const id = `m_${Date.now()}`
  const module = {
    _id: id,
    course_id,
    title,
    lessons: [],
    description,
    order_index: order,
    is_published: false,
    duration_hours: 0,
  }
  modules.push(module)
  return NextResponse.json({ module }, { status: 201 })
}

