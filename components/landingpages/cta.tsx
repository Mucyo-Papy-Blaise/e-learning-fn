"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Building2 } from "lucide-react"

export default function LandingCta() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container px-6 md:px-8 lg:px-32 relative">
        <div className="text-center space-y-8 text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold">
            Start Your Learning
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Adventure Today</span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Join millions of learners worldwide and unlock your potential with courses from the world's best institutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200">
              Browse Courses
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              For Institutions
              <Building2 className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

