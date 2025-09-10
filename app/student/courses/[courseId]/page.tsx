'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CourseIndexRedirect() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string

  useEffect(() => {
    if (courseId) router.replace(`/student/courses/${courseId}/home`)
  }, [courseId, router])

  return null
}

