import type React from "react"
import { cookies } from "next/headers"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/student/main-sidebar"
// Removed duplicate ToastContainer to avoid react-toastify runtime errors

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MainSidebar />
      <SidebarInset className="bg-content-background text-content-foreground">
        {/* Mobile top bar to toggle global student sidebar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 border-b bg-white px-3 py-2">
          <SidebarTrigger className="h-8 w-8" />
          <span className="text-sm font-medium text-gray-700">Student</span>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
