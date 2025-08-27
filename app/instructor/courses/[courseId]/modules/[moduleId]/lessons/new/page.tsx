"use client";

import { LessonForm } from "@/components/instructor/lessons/lesson-form";
import { useRouter } from "next/navigation";

interface AddLessonPageProps {
  params: { moduleId: string };
}

export default function AddLessonPage({ params }: AddLessonPageProps) {
  const router = useRouter();
  const { moduleId } = params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <LessonForm
          moduleId={moduleId}
          onSuccess={() => {
            router.back(); // or router.push to a specific page
          }}
        />
      </div>
    </div>
  );
} 