"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import HeroSection from "@/components/heroSection"
import LandingHeader from "@/components/landingpages/header"
import LandingCategories from "@/components/landingpages/categories"
import LandingTrending from "@/components/landingpages/trending"
import LandingCta from "@/components/landingpages/cta"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Category, fetchTrendingCourses, fetchCategories,Course } from "@/lib/api/public"

export default function ELearningLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [trendingData, categoriesData] = await Promise.all([
        fetchTrendingCourses(4, 1),
        fetchCategories()
      ])
      setTrendingCourses(trendingData.data)
      setCategories(categoriesData.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <HeroSection />

      <LandingCategories />

      <LandingTrending />

      <LandingCta />

      {/* Footer (kept inline) */}
      <footer className="bg-gray-900 text-white">
        <div className="container px-6 md:px-8 lg:px-32 py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-[var(--coursera-blue)] flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">EduVerse</span>
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
