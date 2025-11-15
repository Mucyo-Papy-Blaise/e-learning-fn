"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Users, DollarSign, BookOpen, ChevronDown, ChevronUp, Eye } from "lucide-react";
import Link from "next/link";
import { useCourses } from "@/lib/hooks/use-courses";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";

export function CourseList() {
  const { courses, loadCourses, loadInstructorCourses, isLoading } = useCourses();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
const {user,loading} = useAuth()

  useEffect(()=>{
     if(!loading && user){
       if (user.role === 'instructor' || user.role === 'institution') {
         loadInstructorCourses();
       } else if (user.institution?.id) {
         loadCourses(user.institution.id);
       }
     }
  }, [loading, user]);

  const toggleCourseDetails = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 md:mt-0 mt-6 p-2 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-lg" />
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded-md" />
          </div>
          <div className="w-full sm:w-32 h-12 bg-blue-200 animate-pulse rounded-lg" />
        </div>
        <Card className="p-6 bg-white border shadow-lg">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="w-3/4 h-5 bg-gray-200 animate-pulse rounded-md" />
                  <div className="flex gap-4">
                    <div className="w-20 h-4 bg-gray-200 animate-pulse rounded-md" />
                    <div className="w-16 h-4 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-0 md:mt-0 mt-6 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            My Courses
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Manage and track your course content</p>
        </div>
        <Link href="/instructor/courses/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="mr-2 h-5 w-5" />
            Add Course
          </Button>
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card className="bg-white border shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Course Overview</h2>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Course Title</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Students</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {  courses && courses.map((course, index) => (
                  
                  <TableRow 
                    key={course._id} 
                    className="hover:bg-blue-50 transition-colors duration-200 border-b"
                  >
                    <TableCell className="py-6 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg shadow-md">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Course #{index + 1}</div>
                          <div className="prose max-w-none text-xs mt-1"><div dangerouslySetInnerHTML={{ __html: course.description || '' }} /></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">{course.students || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-green-600 text-lg">${course.price}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 text-center">
                      <Link href={`/instructor/courses/${course._id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 w-10 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {courses.map((course, index) => (
          <Card key={course._id} className="bg-white border shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {course.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Course #{index + 1}</p>
                    <div className="prose max-w-none text-xs mt-1"><div dangerouslySetInnerHTML={{ __html: course.description || '' }} /></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/instructor/courses/${course._id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCourseDetails(course._id)}
                    className="h-9 px-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">Details</span>
                    {expandedCourse === course._id ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedCourse === course._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">Students</span>
                    </div>
                    <span className="font-semibold text-gray-900">{course.students || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">Price</span>
                    </div>
                    <span className="font-bold text-green-600">${course.price}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}