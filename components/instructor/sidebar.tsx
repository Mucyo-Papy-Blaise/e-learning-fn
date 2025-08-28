"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  LayoutDashboard,
  Menu,
  X,
  Users,
  BarChart3,
  Settings,
  UserCheck,
  Award,
  Calendar,
  Bell,
  ChevronDown,
  Building2,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {useEducation} from '@/context/educationContext'
import { useAuth } from '@/lib/hooks/use-auth';

const navigation = [
  { name: "Dashboard", href: "/instructor", icon: LayoutDashboard, badge: null },
  {
    name: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
    badge: null,
    subItems: [
      { name: "All Courses", href: "/instructor/courses" },
      { name: "Create Course", href: "/instructor/courses/new" },
    ],
  },
  { name: "Assignments", href: "/instructor/assignments", icon: UserCheck, badge: null },
  { name: "Analytics", href: "/instructor/analytics", icon: BarChart3, badge: null },
  { name: "Announcements", href: "/instructor/announcements", icon: Bell, badge: null },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    )
  }
  const { user } = useAuth();

  const NavItems = ({ isMobile = false }) => (
    <div className="space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        const isExpanded = expandedItems.includes(item.name)
        const hasSubItems = item.subItems && item.subItems.length > 0

        return (
          <div key={item.name}>
            <div className="relative">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200 group",
                  isDesktopCollapsed ? "justify-center px-2" : "px-3",
                  isActive
                    ? isDesktopCollapsed
                      ? "text-blue-600"
                      : "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                )}
                onClick={() => isMobile && setIsMobileOpen(false)}
              >
                <div
                  className={cn(
                    "rounded-lg flex items-center justify-center",
                    isActive && !isDesktopCollapsed
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-gray-200"
                  )}
                  style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px'
                  }}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? isDesktopCollapsed
                          ? "text-blue-600"
                          : "text-white"
                        : "text-gray-600 group-hover:text-gray-900"
                    )}
                  />
                </div>

                {!isDesktopCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className={cn(
                          "text-xs",
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}

                {hasSubItems && !isDesktopCollapsed && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-2 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleExpanded(item.name)
                    }}
                  />
                )}
              </Link>
            </div>

            {hasSubItems && isExpanded && !isDesktopCollapsed && (
              <div className="ml-6 mt-2 space-y-1">
                {item.subItems.map((subItem) => {
                  const isSubActive = pathname === subItem.href
                  return (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isSubActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                      )}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                    >
                      <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                      {subItem.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const UserProfile = ({ isMobile = false }) => (
    <div className={cn("border-t pt-4 mt-4", !isMobile && isDesktopCollapsed ? "px-2" : "px-4")}>
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-200 cursor-pointer group",
          !isMobile && isDesktopCollapsed && "justify-center"
        )}
      >
        <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
          <AvatarImage src="/placeholder.svg" alt="Institution Admin" />
          <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">LP</AvatarFallback>
        </Avatar>
        {!isDesktopCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">loggedin name</p>
              <p className="text-xs text-gray-500 truncate">loggedinemail@gmail.com</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-white shadow-lg">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-3 px-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white">{user?.institution?.name || 'Institution'}</span>
                <p className="text-xs text-blue-100">{user?.email}</p>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <NavItems isMobile />
            </nav>
            <UserProfile isMobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-screen flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
          isDesktopCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Header with collapse toggle */}
        <div
          className={cn(
            "flex h-14 items-center gap-3 px-4 border-b",
            isDesktopCollapsed && "justify-between px-2"
          )}
          style={{ backgroundColor: 'var(--brand-navy)' }}
        >
          <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
            <Building2 className="h-4 w-4 text-white" />
          </div>

          {!isDesktopCollapsed && (
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="text-sm font-medium text-white">{user?.institution?.name || 'Institution'}</span>
                <p className="text-[11px] text-blue-100">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-transparent"
                onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isDesktopCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-transparent ml-auto"
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isDesktopCollapsed && (
          <div className="px-3 py-2 bg-[color:var(--brand-light)] border-b">
            <div className="flex items-center gap-2 text-[color:var(--brand-navy)]">
              <Bell className="h-3.5 w-3.5" />
              <span className="text-xs">3 pending approvals</span>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <NavItems />
        </nav>

        <UserProfile />
      </div>
    </>
  )
}
