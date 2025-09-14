"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEducation } from "@/context/educationContext";
import { toast } from "react-toastify";

export const InstitutionCoursesModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { selectedInstitution, course, enrollInCourse, loadingEducation } =
    useEducation();

  if (!selectedInstitution) return null;

  const handleEnroll = async (courseId: string, courseTitle: string) => {
    try {
      await enrollInCourse(courseId);
      toast.success(`You have enrolled in ${courseTitle}.`);
    } catch (error) {
      toast.error(
        `Could not enroll in ${courseTitle}. Please try again.`
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-700">
            Courses from {selectedInstitution.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {loadingEducation ? (
            <p className="text-sm text-gray-600">Loading courses...</p>
          ) : course.length === 0 ? (
            <p className="text-sm text-gray-600">No courses found.</p>
          ) : (
            course.map((c) => (
              <div
                key={c._id}
                className="border rounded p-4 bg-gray-50 hover:shadow transition"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {c.title}
                  </h3>
                  <div className="prose max-w-none text-sm text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{ __html: c.description || "" }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Level: {c.difficulty_level}
                  </p>
                  <p className="text-sm text-green-500 font-semibold">
                    Price: {c.price.toLocaleString()} RWF
                  </p>
                </div>
                <button
                  onClick={() => handleEnroll(c._id, c.title)}
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Enroll
                </button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
