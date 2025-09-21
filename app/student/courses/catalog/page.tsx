"use client"

import { useState, useEffect } from "react"
import { BookOpen, Search, Users, Clock, Star, ArrowRight } from "lucide-react"
import { fetchCourses } from "@/lib/api/courses"
import { enrollInCourse } from "@/lib/api/courses"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "react-toastify"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Course {
  _id: string
  title: string
  description: string
  price: number
  difficulty_level: string
  duration_weeks: number
  thumbnail?: string
  instructor_id?: string
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      // Use the public courses endpoint for the catalog
      const availableCourses = await fetchCourses("all")
      setCourses(availableCourses)
    } catch (error) {
      console.error("Failed to load courses:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    
    try {
      setEnrolling(courseId)
      await enrollInCourse(courseId)
      toast.success("Successfully enrolled in course!")

    } catch (error) {
      console.error("Failed to enroll:", error)
      toast.error("Failed to enroll in course")
    } finally {
      setEnrolling(null)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.difficulty_level.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto w-full p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Course Catalog</h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="max-w-7xl mx-auto w-full p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Available Courses</h2>
              <p className="text-gray-600 mb-4">
                Discover courses from our instructors and start your learning journey today.
              </p>
            </div>
          </div>

          {/* Search and Course List */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Courses ({filteredCourses.length})
              </h3>
              
              {/* Search Bar */}
              <div className="relative max-w-sm w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Course Thumbnail */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    
                    {/* Course Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{course.difficulty_level}</span>
                      </div>
                    </div>
                    
                    {/* Price and Enroll Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-blue-600">
                        ${course.price}
                      </span>
                      <button
                        onClick={() => handleEnroll(course._id)}
                        disabled={enrolling === course._id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {enrolling === course._id ? (
                          "Enrolling..."
                        ) : (
                          <>
                            Enroll Now
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? `No courses match "${searchQuery}". Try adjusting your search.` : "No courses are currently available."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log in required</DialogTitle>
            <DialogDescription>
              You need an account to enroll in courses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href="/login" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Log in</Link>
            <Link href="/register" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Create account</Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 