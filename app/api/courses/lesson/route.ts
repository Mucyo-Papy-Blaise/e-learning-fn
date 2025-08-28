import { NextResponse } from 'next/server'
import { lessons } from '@/lib/instructorData'
import type { Lesson } from '@/lib/types/course'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 415 })
  }
  const form = await req.formData()
  const module_id = String(form.get('module_id') || '')
  const title = String(form.get('title') || '')
  const content = String(form.get('content') || '')
  const order = Number(form.get('order') || 0)
  const video = form.get('video') as File | null
  if (!module_id || !title) {
    return NextResponse.json({ error: 'module_id and title are required' }, { status: 400 })
  }
  const id = `l_${Date.now()}`
  const lesson: Lesson = {
    _id: id,
    module_id,
    title,
    content,
    content_type: video ? 'video' : 'text',
    video_url: video ? `/uploads/${id}/${video.name}` : undefined,
    duration_minutes: 0,
    order_index: order,
    is_free_preview: false,
  }
  lessons.push(lesson)
  return NextResponse.json({ lesson, video: video ? { name: video.name, type: video.type, size: video.size } : null }, { status: 201 })
}

