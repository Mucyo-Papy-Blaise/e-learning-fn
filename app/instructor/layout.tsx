"use client";

import InstructorSidebar from "@/components/instructor/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { redirect } from "next/navigation";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!loading && (!user || user.role !== "instructor")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen ">
      <InstructorSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}