"use client"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StudentResultsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/student')
  }, [router])
  return null
}
