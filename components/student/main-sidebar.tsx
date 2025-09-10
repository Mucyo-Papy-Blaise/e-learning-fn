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
  SidebarCollapseTrigger, // ✅ new import
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
        className="bg-slate-700 text-white border-r border-blue-800"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-600 px-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-red-500 text-base font-bold">CDY</span>
            {state === "expanded" && (
              <span className="text-white text-sm font-semibold">
                <span className="sr-only">CDY</span>
              </span>
            )}
          </Link>

          {/* Collapse/Expand trigger */}
          <SidebarCollapseTrigger />
        </div>

        <SidebarContent className="flex-1 py-2">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Account">
                  <Link href="/student/account" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="h-5 w-5 rounded-full object-cover" />
                    ) : (
                      <User2 className="h-5 w-5" />
                    )}
                    {state === "expanded" && <span>Account</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/student"} 
                  tooltip="Dashboard"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-white",
                    pathname === "/student" ? "bg-blue-700" : "hover:bg-blue-800"
                  )}
                >
                  <Link href="/student">
                    <LayoutDashboard className="h-5 w-5" />
                    {state === "expanded" && <span>Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname.startsWith("/student/courses")} 
                  tooltip="Courses"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-white",
                    pathname.startsWith("/student/courses") ? "bg-blue-700" : "hover:bg-blue-800"
                  )}
                >
                  <Link href="/student/courses">
                    <BookOpen className="h-5 w-5" />
                    {state === "expanded" && <span>Courses</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Groups">
                  <Link href="/student/groups" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    <Users className="h-5 w-5" />
                    {state === "expanded" && <span>Groups</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Calendar">
                  <Link href="/student/calendar" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    <Calendar className="h-5 w-5" />
                    {state === "expanded" && <span>Calendar</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inbox">
                  <Link href="/student/inbox" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    <Inbox className="h-5 w-5" />
                    {state === "expanded" && <span>Inbox</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="History">
                  <Link href="/student/history" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    <History className="h-5 w-5" />
                    {state === "expanded" && (
                      <div className="flex items-center gap-2">
                        <span>History</span>
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">10</span>
                      </div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <Link href="/student/help" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800">
                    <LifeBuoy className="h-5 w-5" />
                    {state === "expanded" && <span>Help</span>}
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
