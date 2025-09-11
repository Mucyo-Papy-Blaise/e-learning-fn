"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { fetchCourses } from "@/lib/api/courses"

type CategoryStat = { name: string; count: number }

export default function LandingCategories() {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        const courses = await fetchCourses("all")
        const map = new Map<string, number>()
        for (const c of courses as any[]) {
          const key = (c.category || "General").toString()
          map.set(key, (map.get(key) || 0) + 1)
        }
        const stats = Array.from(map.entries()).map(([name, count]) => ({ name, count }))
        stats.sort((a, b) => b.count - a.count)
        setCategories(stats.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container px-6 md:px-8 lg:px-32">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">Choose from hundreds of courses in the most popular topics</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 bg-white">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-4" />
                  <div className="h-5 w-2/3 bg-gray-100 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white hover:bg-gray-50 transform hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-blue-700 font-semibold text-lg">{category.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{category.count} courses</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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

