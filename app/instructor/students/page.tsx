"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  GraduationCap,
  Upload,
} from "lucide-react";
import { RegisterData } from "@/lib/types/auth";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  email: string;
  courses: Array<{
    courseId: string;
    courseTitle: string;
    courseCode: string;
    progress: number;
    enrolledAt: string;
  }>;
  totalProgress: number;
  courseCount: number;
  status: "Active" | "Completed" | "Paused";
  joinDate: string;
}


const statusFilters = ["Active", "Completed", "Paused"];

const Students: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingStudentId, setUploadingStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.courses.some(course => 
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === "All" || student.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchTerm, selectedStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/instructor/students`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setStudents(response.data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900">
      {/* Header */}
      <header className="bg-blue-100 border-blue-200 shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <GraduationCap className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </button>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                Students Dashboard
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full sm:w-64 lg:w-80 rounded-lg border bg-white border-blue-300 text-blue-900 placeholder-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Section */}
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-lg md:text-3xl font-bold mb-4 lg:mb-4 text-blue-600">
            Enrolled Students
          </h2>
          <p className="text-base sm:text-lg max-w-2xl lg:max-w-4xl mx-auto text-blue-700">
            Track and manage all students enrolled in your courses with detailed
            progress insights.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-8 lg:mb-12">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounde text-sm sm:text-base lg:text-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedStatus === status
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {loading ? (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-blue-100">
                <GraduationCap className="h-10 w-10 text-blue-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Loading students...</h3>
              <p className="text-blue-700">Please wait while we fetch your students</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className="flex flex-col bg-white border border-blue-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Top: Profile + Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="flex flex-col flex-1 space-y-1 text-sm text-blue-800">
                    <div className="text-base font-semibold">{student.name}</div>
                    <div className="text-blue-600 text-sm truncate">
                      {student.email}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{student.courseCount} courses enrolled</span>
                      {student.courses.length > 0 && (
                        <div className="text-xs text-blue-500">
                          Latest: {student.courses[0].courseTitle}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col text-xs text-blue-500">
                      <span>Joined {formatDate(student.joinDate)}</span>
                      <span>ID: {student._id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Average Progress
                    </span>
                    <span className="text-sm font-bold text-blue-900">
                      {student.totalProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${student.totalProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                {student.status === "Active" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/instructor/students/${student._id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </button>
                    <label
                      htmlFor={`file-upload-${student._id}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </label>
                    <input
                      id={`file-upload-${student._id}`}
                      type="file"
                      accept=".pdf,.png,.jpg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setUploadingStudentId(student._id);
                          alert(
                            `Selected ${e.target.files[0].name} for ${student.name}`
                          );
                          // TODO: Upload file to backend here
                        }
                      }}
                    />
                  </div>
                )}

                {/* Completed students: certificate + upload */}
                {student.status === "Completed" && (
                  <div className="flex flex-col space-y-3 border-t border-blue-200 pt-4">
                    {/* Certificate link */}
                    <a
                      href="#"
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                    >
                      View Certificate
                    </a>

                    {/* Drag & Drop Upload Area */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          setSelectedFile(e.dataTransfer.files[0]);
                          setUploadingStudentId(student._id);
                          alert(
                            `Dropped ${e.dataTransfer.files[0].name} for ${student.name}`
                          );
                          // TODO: Upload file to backend here
                        }
                      }}
                      className="w-full p-3 border-2 border-dashed border-blue-300 rounded-md cursor-pointer text-center text-xs text-blue-700 hover:border-blue-500"
                    >
                      Drag & drop your certificate here or click below
                    </div>

                    {/* File picker button */}
                    <label
                      htmlFor={`file-upload-${student._id}`}
                      className="inline-block px-4 py-1 bg-blue-600 text-white text-xs rounded-full cursor-pointer hover:bg-blue-700 transition"
                    >
                      {uploadingStudentId === student._id && selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Assign Certificate"}
                    </label>
                    <input
                      id={`file-upload-${student._id}`}
                      type="file"
                      accept=".pdf,.png,.jpg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setUploadingStudentId(student._id);
                          alert(
                            `Selected ${e.target.files[0].name} for ${student.name}`
                          );
                          // TODO: Upload file to backend here
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* No Results */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-16 lg:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-blue-100">
              <GraduationCap className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No students found</h3>
            <p className="text-blue-700">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;
