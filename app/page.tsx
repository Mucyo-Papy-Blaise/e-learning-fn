"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  BookOpen,
  Star,
  Clock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Code,
  Palette,
  Calculator,
  Menu,
  Stethoscope,
  Atom,
  Database,
  Shield,
  Globe,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import HeroSection from "@/components/heroSection"

export default function ELearningLanding() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 shadow-lg">
        <div className="container flex h-20 items-center justify-between px-6 md:px-8 lg:px-32">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse shadow-lg">
                <div className="h-full w-full rounded-full bg-white/30 animate-ping"></div>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                EduVerse
              </span>
              <div className="text-xs text-gray-500 font-medium">Learn • Grow • Excel</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="#services"
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 group"
            >
              Services
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="#categories"
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 group"
            >
              Categories
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="#courses"
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 group"
            >
              Courses
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              href="#about"
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 group"
            >
              About
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-4"></div>

            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
               <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-50 rounded-lg">
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>
      </header>    

      <HeroSection />
      {/* Course Categories - Coursera Style */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="container px-6 md:px-8 lg:px-32">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Browse by{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Choose from hundreds of courses in the most popular topics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Business",
                icon: Briefcase,
                description: "Leadership, Finance, Marketing",
                courses: "2,450+ courses",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                name: "Computer Science",
                icon: Code,
                description: "Programming, Web Development",
                courses: "1,890+ courses",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
              },
              {
                name: "Data Science",
                icon: Database,
                description: "Machine Learning, Analytics",
                courses: "1,560+ courses",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                name: "Arts & Humanities",
                icon: Palette,
                description: "History, Philosophy, Literature",
                courses: "1,230+ courses",
                color: "from-pink-500 to-pink-600",
                bgColor: "bg-pink-50",
              },
              {
                name: "Health",
                icon: Stethoscope,
                description: "Medicine, Psychology, Nutrition",
                courses: "980+ courses",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50",
              },
              {
                name: "Math & Logic",
                icon: Calculator,
                description: "Statistics, Calculus, Logic",
                courses: "890+ courses",
                color: "from-orange-500 to-orange-600",
                bgColor: "bg-orange-50",
              },
              {
                name: "Physical Science",
                icon: Atom,
                description: "Physics, Chemistry, Biology",
                courses: "750+ courses",
                color: "from-teal-500 to-teal-600",
                bgColor: "bg-teal-50",
              },
              {
                name: "Social Sciences",
                icon: Users,
                description: "Economics, Psychology, Law",
                courses: "670+ courses",
                color: "from-indigo-500 to-indigo-600",
                bgColor: "bg-indigo-50",
              },
            ].map((category, index) => (
              <Card
                key={category.name}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-8 w-8 text-gray-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{category.courses}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="bg-transparent hover:bg-blue-50 border-blue-200 text-blue-600 px-8 py-3 text-lg font-medium"
            >
              Explore All Subjects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Combined Courses and Institutions Section */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="container px-6 md:px-8 lg:px-32">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Trending Courses - 3/4 width */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Trending{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Courses
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg">Most popular courses this month</p>
                </div>
                <Button variant="outline" className="hidden md:flex bg-transparent hover:bg-blue-50 border-blue-200">
                  View All Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Complete Web Development Bootcamp",
                    university: "Harvard University",
                    category: "Computer Science",
                    rating: 4.9,
                    students: "125K+",
                    duration: "16 weeks",
                    price: "Free",
                    trending: true,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    title: "Digital Marketing Mastery",
                    university: "Stanford University",
                    category: "Business",
                    rating: 4.8,
                    students: "89K+",
                    duration: "12 weeks",
                    price: "$149",
                    trending: true,
                    color: "from-green-500 to-green-600",
                  },
                  {
                    title: "Machine Learning Fundamentals",
                    university: "MIT",
                    category: "Data Science",
                    rating: 4.9,
                    students: "156K+",
                    duration: "20 weeks",
                    price: "$299",
                    trending: true,
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    title: "UX/UI Design Principles",
                    university: "Google",
                    category: "Design",
                    rating: 4.7,
                    students: "67K+",
                    duration: "8 weeks",
                    price: "$99",
                    trending: false,
                    color: "from-pink-500 to-pink-600",
                  },
                ].map((course, index) => (
                  <Card
                    key={course.title}
                    className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 bg-white border-0 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <div className={`h-48 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">{course.category}</Badge>
                        </div>
                        {course.trending && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
                              🔥 Trending
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-white/20 text-white backdrop-blur-sm">
                                {course.university.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{course.university}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>

                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200">
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* World-Class Institutions - 1/4 width - Vertical Scrolling */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    World-Class{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Institutions
                    </span>
                  </h3>
                  <p className="text-gray-600 text-sm">Top universities and companies</p>
                </div>

                <div className="relative h-96 overflow-hidden bg-white rounded-2xl shadow-lg">
                  <div className="flex flex-col animate-scroll-vertical space-y-4 p-4">
                    {[
                      { name: "Harvard University", logo: "H", color: "bg-red-500" },
                      { name: "Stanford University", logo: "S", color: "bg-green-500" },
                      { name: "MIT", logo: "M", color: "bg-blue-500" },
                      { name: "Oxford University", logo: "O", color: "bg-purple-500" },
                      { name: "Cambridge", logo: "C", color: "bg-indigo-500" },
                      { name: "Yale University", logo: "Y", color: "bg-blue-600" },
                      { name: "Princeton", logo: "P", color: "bg-orange-500" },
                      { name: "Google", logo: "G", color: "bg-red-600" },
                      { name: "Microsoft", logo: "MS", color: "bg-blue-600" },
                      { name: "IBM", logo: "IBM", color: "bg-gray-700" },
                      { name: "Meta", logo: "F", color: "bg-blue-500" },
                      { name: "Apple", logo: "A", color: "bg-gray-800" },
                      { name: "Amazon", logo: "Am", color: "bg-orange-600" },
                      { name: "Netflix", logo: "N", color: "bg-red-600" },
                      { name: "Tesla", logo: "T", color: "bg-red-500" },
                      // Duplicate for seamless loop
                      { name: "Harvard University", logo: "H", color: "bg-red-500" },
                      { name: "Stanford University", logo: "S", color: "bg-green-500" },
                      { name: "MIT", logo: "M", color: "bg-blue-500" },
                      { name: "Oxford University", logo: "O", color: "bg-purple-500" },
                      { name: "Cambridge", logo: "C", color: "bg-indigo-500" },
                    ].map((uni, index) => (
                      <div key={`${uni.name}-${index}`} className="flex-shrink-0">
                        <div className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all duration-200 flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${uni.color} rounded-lg flex items-center justify-center shadow-sm`}
                          >
                            <span className="text-white font-bold text-xs">{uni.logo}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{uni.name}</h4>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container px-6 md:px-8 lg:px-32 relative">
          <div className="text-center space-y-8 text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold">
              Start Your Learning
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Adventure Today
              </span>
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join millions of learners worldwide and unlock your potential with courses from the world{"'"}s best
              institutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Browse Courses
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-200"
              >
                For Institutions
                <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container px-6 md:px-8 lg:px-32 py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EduVerse
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting learners with world-class education from leading institutions worldwide.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">For Students</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Browse Courses
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Universities
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Certificates
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">For Institutions</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Partner Program
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Course Creation
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Analytics
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EduVerse. All rights reserved. Empowering education worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
