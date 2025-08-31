import { pageContentData } from "@/lib/data"
import { ArrowLeft, ArrowRight, BookMarked, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { fetchModulesByCourseId } from "@/lib/api/courses"

export default function CoursePageContent({
  params,
}: {
  params: { courseId: string; pageId: string }
}) {
  const { courseId, pageId } = params
  const [page, setPage] = useState<any | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const modules = await fetchModulesByCourseId(courseId)
        const allItems = (modules || []).flatMap((m: any) => (m.items || m.lessons || []))
        const found = allItems.find((it: any) => (it.url || it._id) === pageId)
        if (found) setPage(found)
        else setPage(pageContentData[pageId as keyof typeof pageContentData] || null)
      } catch {
        setPage(pageContentData[pageId as keyof typeof pageContentData] || null)
      }
    }
    load()
  }, [courseId, pageId])

  if (!page) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
              Communicating_for_Impact
            </Link>{" "}
            <span className="text-gray-400">{">"}</span>{" "}
            <Link href={`/student/courses/${courseId}/pages`} className="text-blue-600 hover:underline">
              Pages
            </Link>{" "}
            <span className="text-gray-400">{">"}</span> Page Not Found
          </h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-6 text-center text-gray-500">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
            <Link 
              href={`/student/courses/${courseId}/modules`}
              className="text-blue-600 hover:underline"
            >
              ← Back to Modules
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/home`} className="text-blue-600 hover:underline">
            Communicating_for_Impact
          </Link>{" "}
          <span className="text-gray-400">›</span>{" "}
          <Link href={`/student/courses/${courseId}/modules`} className="text-blue-600 hover:underline">
            Modules
          </Link>{" "}
          <span className="text-gray-400">›</span> {page.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="h-8 text-sm bg-transparent border-gray-300">
            <BookMarked className="mr-2 h-4 w-4" />
            Immersive Reader
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Link href={`/student/courses/${courseId}/modules`} className="text-sm text-blue-600 hover:underline">
            ← Back to Modules
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-100">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-8 shadow-sm flex-1">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">{page.title}</h2>
          
          {/* Main Content Image */}
          <div className="mb-8">
            <Image
              src="/ai.png"
              width={600}
              height={400}
              alt={page.title}
              className="w-full rounded-md object-cover shadow-md"
            />
          </div>
          
          {/* Page Content */}
          <div
            className="prose max-w-none text-gray-700 leading-relaxed text-[15px]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          
          {/* Additional Learning Resources */}
          <div className="mt-8 p-6 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Objectives</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Understand the fundamental principles of {page.title.toLowerCase()}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Apply the concepts learned in practical scenarios</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Develop critical thinking skills related to this topic</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {page.previousPage ? (
            <Button
              asChild
              variant="outline"
              className="h-9 px-4 py-2 text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-800 bg-transparent"
            >
              <Link href={`/student/courses/${courseId}/pages/${page.previousPage.url}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous: {page.previousPage.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {page.nextPage ? (
            <Button
              asChild
              variant="outline"
              className="h-9 px-4 py-2 text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-800 bg-transparent"
            >
              <Link href={`/student/courses/${courseId}/pages/${page.nextPage.url}`}>
                Next: {page.nextPage.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}
