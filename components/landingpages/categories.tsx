"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { fetchCategories, type Category } from "@/lib/api/public"

type CategoryStat = { name: string; count: number }

export default function LandingCategories() {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchCategories()
        const stats = (response?.data || []).map((c: Category) => ({
          name: c.name,
          count: c.courseCount ?? 0,
        })) as CategoryStat[]
        stats.sort((a, b) => b.count - a.count)
        setCategories(stats.slice(0, 8))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container px-6 md:px-8 lg:px-32">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Browse by{" "}
            <span className="text-[var(--coursera-blue)]">Category</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-base md:text-lg">
            Choose from hundreds of courses in the most popular topics
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 bg-white rounded-lg shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="h-3 w-1/4 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="bg-white border-0 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5  border-b border-t border-gray-400 "
              >
                <CardContent className="p-4 space-y-2">

                  {/* Title */}
                  <h3 className="font-medium text-gray-900 text-base">
                    {category.name}
                  </h3>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {category.count} courses
                    </span>
                    <Link
                      href={`/category/${encodeURIComponent(category.name)}`}
                      className="text-[11px] font-medium brand-link flex items-center gap-1"
                    >
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* <div className="text-center mt-12">
          <Button
            variant="outline"
            className="bg-transparent hover:bg-blue-50 border-blue-200 text-blue-700 px-8 py-3 text-lg font-medium"
          >
            Explore All Subjects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </section>
  )
}
