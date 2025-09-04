'use client'
import { useEffect, useState } from 'react'
import { getQuizzes, getQuizQuestions } from '@/app/lib/api'
import type { Quiz } from '@/lib/types/assessments'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function InstructorQuizzesListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await getQuizzes()
      if (!mounted) return
      if (res.ok) {
        setQuizzes(res.data)
        // Fetch question counts per quiz
        const entries = await Promise.all(res.data.map(async (q) => {
          const qr = await getQuizQuestions(q._id)
          return [q._id, qr.ok ? qr.data.length : 0] as const
        }))
        setCounts(Object.fromEntries(entries))
      } else {
        toast.error(res.message)
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/instructor">Instructor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Quizzes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Quizzes</h1>
          <Button asChild>
            <Link href="/instructor/quizzes/new">New Quiz</Link>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead>Pass %</TableHead>
                  <TableHead>Max Attempts</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((q: any) => {
                  const moduleId = typeof q.module_id === 'string' ? q.module_id : q.module_id?._id
                  const moduleTitle = typeof q.module_id === 'object' && q.module_id?.title ? q.module_id.title : moduleId
                  return (
                    <TableRow key={q._id}>
                      <TableCell className="font-medium">{q.title}</TableCell>
                      <TableCell className="max-w-[360px] truncate" title={q.description}>{q.description}</TableCell>
                      <TableCell>{moduleTitle}</TableCell>
                      <TableCell>{q.time_limit} min</TableCell>
                      <TableCell>{q.pass_percentage}%</TableCell>
                      <TableCell>{q.max_attempts}</TableCell>
                      <TableCell>{counts[q._id] ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/instructor/quizzes/${q._id}`} className="text-primary underline">View/Edit</Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

