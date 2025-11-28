"use client"

import {
  Users,
  Star,
  ArrowLeft,
  BookOpen,
  Award,
  CheckCircle,
  Play,
  Share2,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchCourseById, enrollInCourse, Course } from "@/lib/api/public"
import { useParams } from "next/navigation"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = await fetchCourseById(courseId)
      setCourse(courseData)
    } catch (error) {
      console.error('Error loading course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to enroll in courses')
        return
      }
      
      await enrollInCourse(courseId)
      setEnrolled(true)
      alert('Successfully enrolled in the course!')
    } catch (error) {
      console.error('Error enrolling:', error)
      alert('Failed to enroll. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free'
    return `${price.toLocaleString()} RWF`
  }

  const getInstitutionName = () => {
    if (!course?.institution) return 'Institution'
    if (typeof course.institution === 'string') return 'Institution'
    return course.institution.name || 'Institution'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-600 mb-4">The course you{"'"}re looking for doesn{"'"}t exist.</p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center space-x-96">
              <Link  href={`/category`}>
                <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.title}
                </h1>
                {/* <p className="text-gray-600 text-sm mt-1">
                  {getInstitutionName()}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Thumbnail */}
            <div className="relative mb-6">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-white" />
                </div>
              )}
              {course.category && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 backdrop-blur-sm rounded text-sm font-medium capitalize">
                    {course.category}
                  </span>
                </div>
              )}
              {course.difficulty_level && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded text-sm font-medium capitalize">
                    {course.difficulty_level}
                  </span>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                <div className="text-gray-700 leading-relaxed">
                  {course.description || 'No description available for this course.'}
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h3>
                  <div className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg sticky top-24">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(course.price || 0)}
                  </div>
                </div>

                <button 
                  className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleEnroll}
                  disabled={enrolled || enrolling}
                >
                  {enrolling ? (
                    'Enrolling...'
                  ) : enrolled ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enrolled
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Enroll Now
                    </>
                  )}
                </button>

                <div className="space-y-4 text-sm text-gray-600">
                  {course.duration_weeks && (
                    <div className="flex items-center justify-between">
                      <span>Duration</span>
                      <span className="font-medium text-gray-900">
                        {course.duration_weeks} weeks
                      </span>
                    </div>
                  )}
                  
                  {course.difficulty_level && (
                    <div className="flex items-center justify-between">
                      <span>Level</span>
                      <span className="font-medium text-gray-900 capitalize">{course.difficulty_level}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span>Students</span>
                    <span className="font-medium text-gray-900">{course.totalStudent || 0}</span>
                  </div>

                  {course.start_date && (
                    <div className="flex items-center justify-between">
                      <span>Start Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(course.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {course.end_date && (
                    <div className="flex items-center justify-between">
                      <span>End Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(course.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {course.is_certified && (
                    <div className="flex items-center justify-between">
                      <span>Certificate</span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">Included</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}