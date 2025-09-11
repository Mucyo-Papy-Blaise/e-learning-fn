"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Clock, Users, Star } from "lucide-react"
import { fetchCourses } from "@/lib/api/courses"

export default function LandingTrending() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        const all = await fetchCourses("all")
        const sorted = [...(all as any[])].sort((a, b) => (b?.students || 0) - (a?.students || 0))
        setCourses(sorted.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container px-6 md:px-8 lg:px-32">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Trending <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Courses</span>
                </h2>
                <p className="text-gray-600 text-lg">Most popular courses this month</p>
              </div>
              <Button variant="outline" className="hidden md:flex bg-transparent hover:bg-blue-50 border-blue-200">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {(loading ? Array.from({ length: 4 }) : courses).map((course: any, index: number) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-white border-0 overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">{course?.category || 'General'}</Badge>
                      </div>
                      {!loading && index < 3 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">🔥 Trending</Badge>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-white/20 text-white backdrop-blur-sm">{(course?.title || 'C').charAt(0)}</AvatarFallback></Avatar>
                          <span className="text-sm font-medium">{course?.instructor?.name || 'Instructor'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">{course?.title || 'Course'}</h3>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{course?.duration_weeks ? `${course.duration_weeks} weeks` : '—'}</span></div>
                        <div className="flex items-center space-x-1"><Users className="h-4 w-4" /><span>{course?.students || 0}</span></div>
                      </div>
                      <div className="flex items-center space-x-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{(course as any)?.rating || '4.8'}</span></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{typeof course?.price === 'number' ? `$${course.price}` : (course?.price || 'Free')}</span>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">Enroll Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Placeholder for right column content (institutions) - keep original layout responsibility in page */}
        </div>
      </div>
    </section>
  )
}

