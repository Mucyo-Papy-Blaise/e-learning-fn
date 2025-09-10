"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Star,
  Clock,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Search,
  Filter,
  SortAsc,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchCoursesByCategory, enrollInCourse, Course } from "@/lib/api/public"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const params = useParams()
  const categoryName = params.categoryName as string
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('totalStudent')
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [totalCourses, setTotalCourses] = useState(0)

  useEffect(() => {
    loadCourses()
  }, [categoryName, sortBy, page])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const response = await fetchCoursesByCategory(categoryName, 12, page, sortBy)
      setCourses(response.data)
      setHasNext(response.pagination.hasNext)
      setHasPrev(response.pagination.hasPrev)
      setTotalCourses(response.pagination.totalCourses)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCourseColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600", 
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-orange-500 to-orange-600",
      "from-teal-500 to-teal-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600"
    ];
    return colors[index % colors.length];
  }

  const handleEnroll = async (courseId: string) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to enroll in courses')
        return
      }
      
      // Call the enrollment API
      await enrollInCourse(courseId)
    } catch (error) {
      console.error('Error enrolling:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {categoryName} Courses
                </h1>
                <p className="text-gray-600">
                  {totalCourses} courses available
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="totalStudent">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Courses Grid */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">There are no courses available in this category yet.</p>
            <Link href="/">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <Card
                  key={course._id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white border-0 overflow-hidden"
                >
                  <div className="relative">
                    {course.thumbnail ? (
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                            {course.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-white/20 text-white backdrop-blur-sm">
                                {course.institution?.name?.charAt(0) || 'I'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {course.institution?.name || 'Institution'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`h-48 bg-gradient-to-br ${getCourseColor(index)} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                            {course.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-white/20 text-white backdrop-blur-sm">
                                {course.institution?.name?.charAt(0) || 'I'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {course.institution?.name || 'Institution'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{course.totalStudent}+</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.instructor_id?.rating || 4.5}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                      <div className="flex space-x-2">
                        <Link href={`/course/${course._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleEnroll(course._id)}
                        >
                          Enroll
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {(hasNext || hasPrev) && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrev}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(totalCourses / 12)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
