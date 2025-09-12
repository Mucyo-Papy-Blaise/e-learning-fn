"use client"

import { useEffect, useState } from "react"
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
            Browse by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Choose from hundreds of courses in the most popular topics
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border bg-gray-100 rounded-lg">
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-5 w-2/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="bg-gray-100 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <CardContent className="p-6 space-y-3">

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {category.name}
                  </h3>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.count} courses
                    </span>
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View All Courses
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
  )
}
