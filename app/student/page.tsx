"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Award, BookMarked, X, Search, Bell, Calendar, CheckCircle, AlertCircle, MessageSquare, Megaphone, Target, PlayCircle, FileText, Users, TrendingUp, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { useEffect, useState } from "react";
import { IEnrollment } from "@/types/education";
import { useEducation } from "@/context/educationContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { fetchStudentDashboard, fetchStudentNotifications, fetchStudentCalendar } from "@/lib/api/student";

function DashboardOverview() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [dashboard, setDashboard] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { institution, fetchInstitution, setSelectedInstitution, fetchCourseByInstitution } =
    useEducation();
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [calendarItems, setCalendarItems] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      const data = await fetchStudentDashboard();
      if (data && Array.isArray(data)) {
        setDashboard(data);
      } else if (data?.enrollments && Array.isArray(data.enrollments)) {
        setDashboard(data.enrollments);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [notif, cal] = await Promise.all([
        fetchStudentNotifications().catch(() => []),
        fetchStudentCalendar().catch(() => []),
      ]);
      setNotifications(Array.isArray(notif) ? notif : []);
      setCalendarItems(Array.isArray(cal) ? cal : []);
    } catch {}
  };

  useEffect(() => {
    fetchDashboard();
    fetchAuxiliaryData();
  }, []);

  useEffect(() => {
    fetchInstitution();
  }, []);

  const handleClickInstitution = async (insId: string) => {
    const selected = institution.find(i => i._id === insId) ?? null;
    setSelectedInstitution(selected);
    if (selected) {
      await fetchCourseByInstitution(insId);
      setModalOpen(true);
    }
  };

  const handleCourseClick = (courseId: string | undefined) => {
    if (courseId) {
      router.push(`/student/courses/${courseId}`);
    }
  };

  const getDaysUntilDeadline = (dueDate: string) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-gray-900 text-white';
      case 'high': return 'bg-gray-700 text-white';
      case 'medium': return 'bg-gray-500 text-white';
      case 'low': return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  // Loading state handling
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="space-y-2">
            <p className="text-gray-900 font-semibold text-lg">Loading your dashboard...</p>
            <p className="text-gray-600 text-sm">Preparing your learning experience</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state handling
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Learner!
                </h1>
                <p className="text-gray-600">
                  Ready to continue your learning journey? Let{"'"}s make today count!
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last login: Today at 9:32 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Enrolled Courses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard.length}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg ml-3">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard ? dashboard.filter((dash) => dash.status === "active").length : 0}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg ml-3">
                    <TrendingUp className="h-4 w-4 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard ? dashboard.filter((dash) => dash.status === "completed").length : 0}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg ml-3">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                      Certificates
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboard ? dashboard.filter((dash) => dash.status === "completed").length : 0}
                    </p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg ml-3">
                    <Award className="h-4 w-4 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Course Progress */}
            <div className="lg:col-span-8 space-y-8">
              {/* Announcements Section */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Latest Updates
                      </CardTitle>
                    </div>
                    <span className="text-sm text-gray-500">
                      {notifications.filter(a => !a.read).length} new
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((announcement: any) => (
                      <div
                        key={announcement.id}
                        className={`p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 ${
                          !announcement.read 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {announcement.type === 'message' && <MessageSquare className="h-4 w-4 text-gray-600" />}
                            {announcement.type === 'update' && <Star className="h-4 w-4 text-gray-600" />}
                            {announcement.type === 'announcement' && <Megaphone className="h-4 w-4 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                            <span className="text-xs text-gray-500">{announcement.time || ''}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Progress Section */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Your Learning Progress
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {dashboard && dashboard.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold">
                            Amazing! You{"'"}re enrolled in {dashboard.length} course{dashboard.length > 1 ? "s" : ""}
                          </p>
                          <p className="text-gray-600 text-sm">Keep up the excellent work!</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {dashboard && dashboard.length > 0 ? (
                      dashboard.map((dash) => (
                        <div
                          key={dash.course_id?._id}
                          onClick={() => handleCourseClick(dash.course_id?._id)}
                          className="cursor-pointer group"
                        >
                          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {dash.course_id?.title}
                                </CardTitle>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                                    dash.status === "completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                  {dash.status.charAt(0).toUpperCase() + dash.status.slice(1)}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">Progress</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    {dash.progress_percentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                      width: `${Math.min(100, Math.max(0, dash.progress_percentage || 0))}%`,
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{dash.completedLessons}/{dash.totalLessons} lessons</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(dash.lastAccessed).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <Card className="bg-white border border-gray-200 shadow-sm col-span-2">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-gray-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Ready to Start Learning?
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Discover amazing courses and begin your educational journey today!
                          </p>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium">
                            Browse Courses
                          </button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Deadlines & Institutions */}
            <div className="lg:col-span-4 space-y-8">
              {/* Upcoming Deadlines */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-700" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Upcoming Deadlines
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calendarItems.map((deadline: any) => {
                      const daysLeft = getDaysUntilDeadline(deadline.dueDate || deadline.due_date);
                      return (
                        <div
                          key={deadline.id}
                          className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-gray-100 rounded-lg">
                                {deadline.type === 'quiz' && <PlayCircle className="h-3 w-3 text-gray-600" />}
                                {deadline.type === 'assignment' && <FileText className="h-3 w-3 text-gray-600" />}
                                {deadline.type === 'task' && <CheckCircle className="h-3 w-3 text-gray-600" />}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                                {daysLeft === 0 ? 'Due Today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              deadline.status === 'pending' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {deadline.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{deadline.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{deadline.course || ''}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>Due: {new Date(deadline.dueDate || deadline.due_date).toLocaleDateString()}</span>
                            <span>{deadline.dueTime || ''}</span>
                          </div>
                          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                            {deadline.type === 'quiz' ? 'Start Quiz' : 
                             deadline.type === 'assignment' ? 'Submit Assignment' : 
                             'Complete Task'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;