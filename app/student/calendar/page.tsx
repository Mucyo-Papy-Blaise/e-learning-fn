'use client'
import { useEffect, useMemo, useState } from 'react'
import { Calendar as UiCalendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchStudentCalendar } from '@/lib/api/student'

type CalendarItem = {
  id?: string
  title?: string
  type?: 'assignment' | 'quiz' | 'task' | 'announcement'
  date?: string
  due_date?: string
  dueDate?: string
  course?: { _id?: string; title?: string } | string
}

export default function StudentCalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStudentCalendar()
        setItems(Array.isArray(data) ? data : [])
      } catch {
        setItems([])
      }
    }
    load()
  }, [])

  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>()
    for (const it of items) {
      const d = it.dueDate || it.due_date || it.date
      if (!d) continue
      const key = new Date(d).toDateString()
      const list = map.get(key) || []
      list.push(it)
      map.set(key, list)
    }
    return map
  }, [items])

  const selectedKey = selectedDate ? selectedDate.toDateString() : ''
  const dayItems = itemsByDay.get(selectedKey) || []
  const eventDates = useMemo<Date[]>(() => {
    const keys = Array.from(itemsByDay.keys())
    return keys.map((k: string) => new Date(k))
  }, [itemsByDay])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="mt-1 text-sm text-blue-100">Stay on top of assignments, quizzes, and announcements.</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Month view</CardTitle>
            </CardHeader>
            <CardContent>
              <UiCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{ hasEvent: 'has-event' }}
              />
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Events on {selectedDate?.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {dayItems.length === 0 ? (
                <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">No events</div>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((it: CalendarItem, idx: number) => (
                    <div key={it.id || idx} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{it.title}</div>
                          <div className="text-xs text-blue-700">
                            {typeof it.course === 'object' ? it.course?.title : it.course || ''}
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {it.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx>{`
        :global(.has-event) {
          position: relative;
        }
        :global(.has-event)::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: #2563eb; /* blue-600 */
        }
      `}</style>
    </div>
  )
}

