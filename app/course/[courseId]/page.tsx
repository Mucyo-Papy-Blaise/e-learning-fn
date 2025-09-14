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
      
      // Check if user is logged in
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to enroll in courses')
        return
      }
      
      // Call the enrollment API
      await enrollInCourse(courseId)
      setEnrolled(true)
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
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
            <Button>Back to Home</Button>
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
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-gray-600">
                  by {course.instructor_id?.user_id?.name || 'Instructor'} • {course.institution?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
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
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                  {course.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  {course.difficulty_level}
                </Badge>
              </div>
            </div>

            {/* Course Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What you{"'"}ll learn</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.prerequisites && course.prerequisites.length > 0 ? (
                    course.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{prereq}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-gray-600">
                      No specific prerequisites required for this course.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instructor</h3>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {course.instructor_id?.user_id?.name?.charAt(0) || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {course.instructor_id?.user_id?.name || 'Instructor'}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {course.instructor_id?.profession_name || 'Course Instructor'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.instructor_id?.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.totalStudent}+ students</span>
                      </div>
                    </div>
                    {course.instructor_id?.expertise && course.instructor_id.expertise.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {course.instructor_id.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-gray-600 line-through">
                      ${Math.round(course.price * 1.2)}
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                </Button>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Duration</span>
                    <span className="font-medium">
                      {course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Level</span>
                    <span className="font-medium capitalize">{course.difficulty_level}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Students</span>
                    <span className="font-medium">{course.totalStudent}+</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.instructor_id?.rating || 4.5}</span>
                    </div>
                  </div>

                  {course.start_date && (
                    <div className="flex items-center justify-between">
                      <span>Start Date</span>
                      <span className="font-medium">
                        {new Date(course.start_date).toLocaleDateString()}
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

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">What{"'"}s included</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Mobile and desktop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Exercises and quizzes</span>
                    </div>
                    {course.is_certified && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
