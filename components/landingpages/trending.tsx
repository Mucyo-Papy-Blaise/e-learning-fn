"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Clock, Users, Star } from "lucide-react"
import { fetchCourses } from "@/lib/api/courses"
import { getPublicInstitutions } from "@/lib/api/institution"
import {  enrollInCourse } from "@/lib/api/public"
import { useAuth } from "@/lib/hooks/use-auth"

export default function LandingTrending() {
  const [courses, setCourses] = useState<any[]>([])
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingInst, setLoadingInst] = useState<boolean>(true)
  const {isAuthenticated, openAuthModal } = useAuth()

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const all = await fetchCourses("all")
        const normalized = (all as any[]).map((c) => ({
          ...c,
          students: (c as any).students ?? (c as any).totalStudent ?? 0,
          instructorName: (c as any)?.instructor_id?.user_id?.name || (c as any)?.instructor?.name || 'Instructor',
        }))
        const sorted = [...normalized].sort((a, b) => (b?.students || 0) - (a?.students || 0))
        setCourses(sorted.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }
    const loadInstitutions = async () => {
      try {
        const list = await getPublicInstitutions()
        const normalized = Array.isArray(list) ? list.map((i: any) => ({
          _id: i?._id || i?.id,
          name: i?.name,
          logo: i?.logo,
        })) : []
        setInstitutions(normalized.slice(0, 20))
      } finally {
        setLoadingInst(false)
      }
    }
    loadCourses()
    loadInstitutions()
  }, [])

  
  const handleEnroll = async (courseId: string) => {
  if (!isAuthenticated) {
    openAuthModal()
    return
  }

  try {
    await enrollInCourse(courseId)
  } catch (error) {
    console.error("Error enrolling:", error)
  }
}

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container px-6 md:px-8 lg:px-32">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                  Trending <span className="text-[var(--coursera-blue)]">Courses</span>
                </h2>
                <p className="text-gray-600 text-base md:text-lg">Most popular courses this month</p>
              </div>
              <Button variant="outline" className="hidden md:flex bg-transparent hover:bg-[var(--coursera-blue-contrast)] border-blue-200 text-[var(--coursera-blue)]">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(loading ? Array.from({ length: 4 }) : courses).map((course: any, index: number) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 bg-white border-0 overflow-hidden rounded-lg" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative">
                    <div className={`h-36 relative overflow-hidden`}>
                      {course?.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600" />
                      )}
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-gray-900 backdrop-blur-sm shadow-sm">{course?.category || 'General'}</Badge>
                      </div>
                      {!loading && index < 3 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow">🔥 Trending</Badge>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-white/25 text-white backdrop-blur-sm">{(course?.title || 'C').charAt(0)}</AvatarFallback></Avatar>
                          <span className="text-sm font-medium">{course?.instructorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-base md:text-lg group-hover:text-[var(--coursera-blue)] transition-colors line-clamp-2">{course?.title || 'Course'}</h3>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{course?.duration_weeks ? `${course.duration_weeks} weeks` : '—'}</span></div>
                        <div className="flex items-center space-x-1"><Users className="h-4 w-4" /><span>{course?.students || 0}</span></div>
                      </div>
                      <div className="flex items-center space-x-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{(course as any)?.rating || '4.8'}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">{typeof course?.price === 'number' ? `${Number(course?.price).toLocaleString()} RWF` : (`${Number(course?.price).toLocaleString()} RWF` || 'Free')}</span>
                      <Button 
                        onClick={() => handleEnroll(course._id)}
                      size="sm" 
                      className="transform hover:scale-105 transition-all duration-200 rounded-md brand-btn-primary">
                        Enroll Now
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Institutions sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  World-Class <span className="text-[var(--coursera-blue)]">Institutions</span>
                </h3>
                <p className="text-gray-600 text-sm">Top universities and companies</p>
              </div>
              <div className="relative h-96 overflow-hidden bg-white rounded-2xl shadow-lg">
                <div className="flex flex-col animate-scroll-vertical space-y-4 p-4">
                  {(loadingInst ? Array.from({ length: 10 }) : institutions).map((ins: any, index: number) => (
                    <div key={index} className="flex-shrink-0">
                      <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-200 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                          {ins?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ins.logo} alt={ins.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-blue-700 font-bold text-xs">{(ins?.name || 'IN').substring(0,2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{ins?.name || 'Institution'}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

