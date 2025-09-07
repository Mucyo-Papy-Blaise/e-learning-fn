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
  const eventDates = useMemo(() => {
    const keys = Array.from(itemsByDay.keys())
    return keys.map(k => new Date(k))
  }, [itemsByDay])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Calendar</CardTitle>
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
                <div className="text-sm text-gray-500">No events</div>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((it, idx) => (
                    <div key={it.id || idx} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{it.title}</div>
                          <div className="text-xs text-gray-600">
                            {typeof it.course === 'object' ? it.course?.title : it.course || ''}
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
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
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background-color: #2563eb; /* blue-600 */
        }
      `}</style>
    </div>
  )
}

