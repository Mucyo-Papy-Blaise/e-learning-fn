import { NextResponse } from 'next/server'
import { officeHours, OfficeHourSlot, users } from '@/lib/instructorData'

export async function POST(req: Request) {
  const body = await req.json()
  const { courseId, startISO, endISO, location, notes } = body as {
    courseId?: string
    startISO: string
    endISO: string
    location: string
    notes?: string
  }
  if (!startISO || !endISO || !location) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const instructorId = users.find(u => u.role === 'instructor')?._id || 'u1'
  const slot: OfficeHourSlot = {
    id: `oh_${Date.now()}`,
    instructorId,
    courseId,
    startISO,
    endISO,
    location,
    notes,
  }
  officeHours.push(slot)
  return NextResponse.json(slot, { status: 201 })
}

