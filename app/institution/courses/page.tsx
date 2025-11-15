"use client";

import { useEffect, useState } from "react";
import {
  fetchCoursesByInstitution,
  getMyInstitutionProfile,
} from "@/lib/api/institution";

export default function InstitutionCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMyInstitutionProfile();
        setInstitution(profile.institution);

        const result = await fetchCoursesByInstitution(
          profile.institution._id
        );
        setCourses(result.data?.courses || []);
      } catch (err) {
        console.error("Error loading institution courses:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-blue-600 text-lg font-medium animate-pulse">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-white">{institution?.name} — Courses</h1>
        <p className="text-blue-100 mt-2">
          Overview of all courses created by your institution
        </p>
      </div>

      {/* No Courses Fallback */}
      {courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-5xl mb-4">📘</div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            No courses available yet
          </h2>
          <p className="text-blue-500 max-w-md">
            You haven’t created any courses. Once you add new courses, they’ll
            appear here with details like enrollment, rating, and revenue.
          </p>
        </div>
      )}

      {/* Courses Table */}
      {courses.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-blue-100">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-4 px-4 text-left font-semibold">Course</th>
                <th className="py-4 px-4 text-left font-semibold">Level</th>
                <th className="py-4 px-4 text-left font-semibold">Rating</th>
                <th className="py-4 px-4 text-left font-semibold">Enrolled</th>
                <th className="py-4 px-4 text-left font-semibold">Created Date</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course: any) => (
                <tr
                  key={course._id}
                  className="border-b border-blue-100 hover:bg-blue-50 transition"
                >
                  {/* Course Title */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-blue-700">
                      {course.title}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1">
                      {course.description}
                    </p>
                  </td>

                  {/* Level */}
                  <td className="py-4 px-4 text-gray-700">
                    {course.level || "N/A"}
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-yellow-500 font-medium">
                      ⭐ {course.rating || "0.0"}
                    </div>
                  </td>

                  {/* Enroll Count */}
                  <td className="py-4 px-4 font-medium text-blue-700">
                    {course.total_enrolled || 0}
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="p-4 text-sm text-gray-500 border-t border-blue-100">
            Showing {courses.length} course(s)
          </div>
        </div>
      )}
    </div>
  );
}
