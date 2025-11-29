"use client"

import { useEffect, useState } from "react"
import { BookOpen, Clock, Users, ArrowRight, Grid3x3, List, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { fetchCategories, fetchCoursesByCategory, type Category, type Course } from "@/lib/api/public"

type CategoryWithCourses = {
  name: string
  count: number
  courses: Course[]
}

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCourses[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    loadCategoriesWithCourses()
  }, [])

  const loadCategoriesWithCourses = async () => {
    try {
      setLoading(true)
      const response = await fetchCategories()
      const categoriesData = response?.data || []

      // Fetch courses for each category
      const categoriesWithCourses = await Promise.all(
        categoriesData.map(async (cat: Category) => {
          try {
            const coursesResponse = await fetchCoursesByCategory(cat.name, 6, 1, "totalStudent")
            return {
              name: cat.name,
              count: cat.courseCount || 0,
              courses: coursesResponse.data || []
            }
          } catch (error) {
            console.error(`Error loading courses for ${cat.name}:`, error)
            return {
              name: cat.name,
              count: cat.courseCount || 0,
              courses: []
            }
          }
        })
      )

      setCategories(categoriesWithCourses.filter(cat => cat.count > 0))
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => {
    if (selectedCategory !== "all" && cat.name !== selectedCategory) return false
    if (searchQuery && !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatPrice = (price: number) => {
    if (price === 0) return "Free"
    return `${price.toLocaleString()} RWF`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/image.png')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Explore All Categories
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover courses across all subjects and advance your skills with expert-led content
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="bg-white rounded-lg shadow-sm">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <div key={category.name} className="category-section">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-blue-600">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 capitalize mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {category.count} {category.count === 1 ? 'course' : 'courses'} available
                    </p>
                  </div>
                  <Link 
                    href={`/category/${encodeURIComponent(category.name)}`}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View All
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>

                {/* Courses Grid/List */}
                {category.courses.length > 0 ? (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }>
                    {category.courses.map((course) => (
                      <Link 
                        key={course._id} 
                        href={`/course/${course._id}`}
                        className="block group"
                      >
                        {viewMode === "grid" ? (
                          // Grid View
                          <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="relative h-24 overflow-hidden bg-gray-100">
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <BookOpen className="h-16 w-16 text-white" />
                                </div>
                              )}
                              {course.difficulty_level && (
                                <div className="absolute top-3 right-3">
                                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full capitalize">
                                    {course.difficulty_level}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-5">
                              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {course.title}
                              </h3>
                              
                              <p className="text-sm text-gray-600 mb-4">
                                {typeof course.institution === 'object' ? course.institution?.name : 'Institution'}
                              </p>

                              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{course.duration_weeks || 4} weeks</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{course.totalStudent || 0}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="text-xl font-bold text-blue-600">
                                  {formatPrice(course.price || 0)}
                                </div>
                                <span className="text-blue-600 font-medium flex items-center">
                                  View Details
                                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // List View
                          <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex">
                            <div className="relative w-64 flex-shrink-0 overflow-hidden bg-gray-100">
                              {course.thumbnail ? (
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <BookOpen className="h-12 w-12 text-white" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900 text-xl group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                  </h3>
                                  {course.difficulty_level && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full capitalize ml-4">
                                      {course.difficulty_level}
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 mb-4">
                                  {typeof course.institution === 'object' ? course.institution?.name : 'Institution'}
                                </p>

                                <p className="text-gray-700 line-clamp-2 mb-4">
                                  {course.description || 'Enhance your skills with this comprehensive course.'}
                                </p>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{course.duration_weeks || 4} weeks</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4" />
                                    <span>{course.totalStudent || 0} students</span>
                                  </div>
                                </div>

                                <div className="text-2xl font-bold text-blue-600">
                                  {formatPrice(course.price || 0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No courses available in this category yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}