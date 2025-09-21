"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarCollapseTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { User2, LayoutDashboard, BookOpen, Users, Calendar, Inbox, History, LifeBuoy } from "lucide-react"
import { useEffect, useState } from "react"
import { getMyStudentProfile } from "@/lib/api/student"

export function MainSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyStudentProfile()
        const url = res?.student?.profile_image || null
        setAvatarUrl(url)
      } catch {}
    }
    load()
  }, [])

  return (
    <TooltipProvider>
      <Sidebar
        side="left"
        collapsible="icon"
        className="bg-slate-700 text-white border-r border-blue-800 hidden lg:block"
      >
        <div className="flex h-14 sm:h-16 items-center justify-between border-b border-slate-600 px-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-red-500 text-sm sm:text-base font-bold">CDY</span>
            {state === "expanded" && (
              <span className="text-white text-xs sm:text-sm font-semibold">
                <span className="sr-only">CDY</span>
              </span>
            )}
          </Link>

          {/* Collapse/Expand trigger */}
          <SidebarCollapseTrigger className="h-8 w-8 sm:h-9 sm:w-9" />
        </div>

        <SidebarContent className="flex-1 py-1 sm:py-2">
          <SidebarGroup>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Account">
                  <Link href="/student/account" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="h-4 w-4 sm:h-5 sm:w-5 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <User2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    )}
                    {state === "expanded" && <span className="text-sm sm:text-base">Account</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/student"} 
                  tooltip="Dashboard"
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white transition-colors duration-200",
                    pathname === "/student" ? "bg-blue-700" : "hover:bg-blue-800"
                  )}
                >
                  <Link href="/student">
                    <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname.startsWith("/student/courses")} 
                  tooltip="Courses"
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white transition-colors duration-200",
                    pathname.startsWith("/student/courses") ? "bg-blue-700" : "hover:bg-blue-800"
                  )}
                >
                  <Link href="/student/courses">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Courses</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Groups">
                  <Link href="/student/groups" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Groups</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendar">
                  <Link href="/student/calendar" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Calendar</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inbox">
                  <Link href="/student/inbox" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    <Inbox className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Inbox</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History">
                  <Link href="/student/history" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base">History</span>
                        <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">10</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <Link href="/student/help" className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-white hover:bg-blue-800 transition-colors duration-200">
                    <LifeBuoy className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {state === "expanded" && <span className="text-sm sm:text-base">Help</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  )
}
