import { NextResponse } from 'next/server'
import { courses, courseMeta } from '@/lib/instructorData'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 415 })
  }
  const form = await req.formData()
  const title = String(form.get('title') || '')
  const description = String(form.get('description') || '')
  const category = String(form.get('category') || '')
  const tags = form.getAll('tags[]').map(v => String(v))
  const requirements = form.getAll('requirements[]').map(v => String(v))
  const learningOutcomes = form.getAll('learning_outcomes[]').map(v => String(v))
  const thumbnail = form.get('thumbnail') as File | null

  if (!title || !description || !category) {
    return NextResponse.json({ error: 'title, description, category are required' }, { status: 400 })
  }

  const id = `c_${Date.now()}`
  courses.push({
    _id: id,
    instructor_id: 'u1',
    title,
    description,
    price: 0,
    thumbnail: thumbnail ? `/uploads/${id}/${thumbnail.name}` : '',
    difficulty_level: 'beginner',
    students: 0,
    prerequisites: [],
    start_date: new Date(),
    end_date: new Date(),
    is_certified: false,
    duration_weeks: 0,
  })
  courseMeta[id] = { category, tags, requirements, learningOutcomes }

  return NextResponse.json({
    id,
    title,
    description,
    category,
    tags,
    requirements,
    learning_outcomes: learningOutcomes,
    thumbnail: thumbnail ? { name: thumbnail.name, size: thumbnail.size, type: thumbnail.type } : null,
  }, { status: 201 })
}

