// @ts-nocheck
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ✅ Make sure this path is correct for your project
import { getMyStudentProfile } from "@/lib/api/student"

function getTitleFromPath(pathname: string): string {
  if (!pathname || pathname === "/student") return "Dashboard"
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/")
  const afterStudent = parts.slice(1)
  if (afterStudent.length === 0) return "Dashboard"
  if (afterStudent[0] === "courses") {
    if (afterStudent.length === 1) return "My Courses"
    return "Course"
  }
  return afterStudent[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function StudentTopNav() {
  const pathname = usePathname()
  const title = getTitleFromPath(pathname)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyStudentProfile()

        // Adjust field depending on API
        let url = res?.student?.profile_image || res?.student?.avatarUrl || null

        // If backend sends relative path, prepend API URL
        if (url && url.startsWith("/")) {
          url = `${process.env.NEXT_PUBLIC_API_URL}${url}`
        }

        setAvatarUrl(url)
      } catch (error) {
        console.error("Failed to load student profile:", error)
      }
    }
    load()
  }, [])

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center gap-1 px-2 sm:h-14 sm:gap-3 sm:px-3">
        {/* Left section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="hidden text-sm font-medium text-gray-800 sm:inline lg:text-base">
            {title}
          </span>
        </div>

        {/* Center section - Mobile search */}
        <div className="flex-1 mx-2 sm:hidden">
          <div className="flex items-center gap-2 rounded-md border bg-white px-2 py-1">
            <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input
              className="h-6 border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop search box */}
          <div className="hidden sm:flex min-w-[200px] lg:min-w-[240px] items-center gap-2 rounded-md border bg-white px-2">
            <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Input
              className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
              placeholder="Search courses..."
            />
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center rounded-full outline-none ring-0 focus-visible:ring-2 focus-visible:ring-blue-300 transition-all duration-200 hover:scale-105">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src={avatarUrl || undefined} alt="Profile" />
                  <AvatarFallback className="text-xs sm:text-sm">ST</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/student/account">Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/student/calendar">Calendar</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
