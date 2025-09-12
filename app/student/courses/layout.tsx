"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { coursesList, courseNavigationItems } from "@/lib/data";
import Link from "next/link";
import {
  X,
  Home,
  Megaphone,
  ClipboardList,
  MessageSquare,
  GraduationCap,
  Users,
  FileText,
  File,
  Book,
  Calendar,
  Folder,
  Link as LinkIcon,
  MessageCircle,
  Clock,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const courseId = pathname.split("/")[3];

  const isCourseListPage = pathname === "/student/courses";
  const isSpecificCoursePage =
    courseId && pathname.startsWith(`/student/courses/${courseId}`);

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Course-Specific Sidebar - Only show when a specific course is selected */}
      {isSpecificCoursePage && (
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <h2 className="text-xs font-semibold text-gray-900">
              Communicating_for_Impact
            </h2>
            <button className="text-gray-600 hover:text-gray-900">
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          <div className="p-4">
            <p className="text-xs font-bold text-gray-600 mb-4">
              2025 May Term
            </p>

            <nav className="space-y-1">
              <Link
                href={`/student/courses/${courseId}/home`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/home`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href={`/student/courses/${courseId}/announcements`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(
                    `/student/courses/${courseId}/announcements`
                  ) && "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Megaphone className="h-4 w-4" />
                Announcements
              </Link>

              <Link
                href={`/student/courses/${courseId}/modules`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/modules`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Folder className="h-4 w-4" />
                Modules
              </Link>
              
              <Link
                href={`/student/courses/${courseId}/pages`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/pages`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <FileText className="h-4 w-4" />
                Pages
              </Link>

              <Link
                href={`/student/courses/${courseId}/assignments`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(
                    `/student/courses/${courseId}/assignments`
                  ) && "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                Assignments
              </Link>

              <Link
                href={`/student/courses/${courseId}/grades`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/grades`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <GraduationCap className="h-4 w-4" />
                Grades
              </Link>

              {/* <Link
                href={`/student/courses/${courseId}/people`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/people`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Users className="h-4 w-4" />
                People
              </Link> */}

              <Link
                href={`/student/courses/${courseId}/files`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/files`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <File className="h-4 w-4" />
                Files
              </Link>

              <Link
                href={`/student/courses/${courseId}/syllabus`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/syllabus`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Book className="h-4 w-4" />
                Syllabus
              </Link>

              <Link
                href={`/student/courses/${courseId}/quizzes`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/quizzes`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <ClipboardList className="h-4 w-4" />
                Quizzes
              </Link>

              <Link
                href={`/student/courses/${courseId}/collaborations`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(
                    `/student/courses/${courseId}/collaborations`
                  ) && "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <Users className="h-4 w-4" />
                Group Works
              </Link>

              {/* <Link
                href={`/student/courses/${courseId}/chat`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/chat`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Link> */}

              <Link
                href={`/student/courses/${courseId}/help`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
                  pathname.includes(`/student/courses/${courseId}/help`) &&
                    "bg-blue-50 text-blue-700 border border-blue-200"
                )}
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </Link>
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col bg-white">
        {/* Global action bar for all /student/courses pages */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            <div className="text-sm font-medium text-gray-700">
              {isSpecificCoursePage ? "Course Workspace" : "My Courses"}
            </div>
            <Link
              href="/student/courses/catalog"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
