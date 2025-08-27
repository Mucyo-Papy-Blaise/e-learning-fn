"use client"

import { coursesList } from "@/lib/data"
import { X, BookOpen, Calendar, Users, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredCourses = coursesList.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.cohort.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.term.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">My Courses</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="max-w-4xl mx-auto w-full p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Journey</h2>
              <p className="text-gray-600 mb-4">
                Access all your enrolled courses and continue your learning progress.
              </p>
              <Link 
                href="/student/courses" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse All Courses
              </Link>
            </div>
          </div>

          {/* Search and Course List */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Enrolled Courses ({filteredCourses.length})
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
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/student/courses/${course.id}/home`} className="block group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 mb-2 line-clamp-2">
                          {course.name}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.cohort}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{course.term}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Click to access course content</span>
                          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                            Continue Learning
                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Empty State (if no courses) */}
          {coursesList.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Start your learning journey by exploring available courses.</p>
              <Link 
                href="/student/courses" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded-lg mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Customize Your Course List</p>
                <p className="text-sm text-blue-700">
                  Visit the Browse All Courses section to star your favorite courses and customize this display.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}