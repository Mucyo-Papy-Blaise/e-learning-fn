import type React from "react"
import { cookies } from "next/headers"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
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
      <SidebarInset className="bg-content-background text-content-foreground">{children}</SidebarInset>
    </SidebarProvider>
  )
}
