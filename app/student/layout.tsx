import type React from "react"
import { cookies } from "next/headers"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { MainSidebar } from "@/components/student/main-sidebar"
import { ToastProvider } from "@/components/ui/toastContainer"

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
      <SidebarInset className="bg-content-background text-content-foreground">{children}
        <ToastProvider />
      </SidebarInset>
    </SidebarProvider>
  )
}
