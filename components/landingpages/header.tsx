"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap, Menu } from "lucide-react"

export default function LandingHeader() {
  return (
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
  )
}

