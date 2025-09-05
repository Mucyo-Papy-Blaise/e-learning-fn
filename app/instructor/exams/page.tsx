'use client'
import { useEffect, useState } from 'react'
import { listExams } from '@/app/lib/api'
import type { Exam } from '@/lib/types/assessments'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function InstructorExamsListPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await listExams()
      if (!mounted) return
      if (res.ok) setExams(res.data.exams)
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
              <BreadcrumbPage>Exams</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">All Exams</h1>
          <Button asChild>
            <Link href="/instructor/exams/new">New Exam</Link>
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
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Passing</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((e: any) => {
                  const courseText = typeof e.course === 'object' && e.course !== null
                    ? (e.course.title ?? e.course._id ?? '')
                    : String(e.course ?? '')
                  return (
                    <TableRow key={e._id}>
                      <TableCell className="font-medium">{e.title}</TableCell>
                      <TableCell className="max-w-[360px] truncate" title={e.description}>{e.description}</TableCell>
                      <TableCell>{courseText}</TableCell>
                      <TableCell>{e.duration ?? '-'} min</TableCell>
                      <TableCell>{e.passingScore ?? '-'}</TableCell>
                      <TableCell>{e.totalPoints ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/instructor/exams/${e._id}`} className="text-primary underline">View/Edit</Link>
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

 
