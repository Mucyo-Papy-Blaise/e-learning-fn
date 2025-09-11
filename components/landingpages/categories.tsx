"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Code, Database, Palette, Stethoscope, Calculator, Atom, Users } from "lucide-react"

const categories = [
  { name: "Business", icon: Briefcase, description: "Leadership, Finance, Marketing", courses: "2,450+ courses", bgColor: "bg-blue-50" },
  { name: "Computer Science", icon: Code, description: "Programming, Web Development", courses: "1,890+ courses", bgColor: "bg-green-50" },
  { name: "Data Science", icon: Database, description: "Machine Learning, Analytics", courses: "1,560+ courses", bgColor: "bg-purple-50" },
  { name: "Arts & Humanities", icon: Palette, description: "History, Philosophy, Literature", courses: "1,230+ courses", bgColor: "bg-pink-50" },
  { name: "Health", icon: Stethoscope, description: "Medicine, Psychology, Nutrition", courses: "980+ courses", bgColor: "bg-red-50" },
  { name: "Math & Logic", icon: Calculator, description: "Statistics, Calculus, Logic", courses: "890+ courses", bgColor: "bg-orange-50" },
  { name: "Physical Science", icon: Atom, description: "Physics, Chemistry, Biology", courses: "750+ courses", bgColor: "bg-teal-50" },
  { name: "Social Sciences", icon: Users, description: "Economics, Psychology, Law", courses: "670+ courses", bgColor: "bg-indigo-50" },
]

export default function LandingCategories() {
  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container px-6 md:px-8 lg:px-32">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">Choose from hundreds of courses in the most popular topics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
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
          <Button variant="outline" className="bg-transparent hover:bg-blue-50 border-blue-200 text-blue-600 px-8 py-3 text-lg font-medium">
            Explore All Subjects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}

