"use client";
import InstitutionSidebar from "@/components/institution/institution-sidebar";
import { useAuth } from "@/lib/hooks/use-auth";
import { redirect } from "next/navigation";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!loading && (!user || user.role !== "institution")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <InstitutionSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}