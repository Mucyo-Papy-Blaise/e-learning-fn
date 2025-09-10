"use client";

import CreateAssignmentForm from "@/components/assignments/instructor/CreateAssignmentForm";
import { useParams } from "next/navigation";

export default function NewAssignmentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  return (
    <CreateAssignmentForm 
      moduleId={moduleId}
      courseId={courseId}
    />
  );
}