"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  BookOpen,
  Users,
  Clock,
  Award,
  TrendingUp,
  GraduationCap,
  Building2,
  UserCheck,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Calendar,
  BarChart3,
  Settings,
  Download,
} from "lucide-react"
import { useEffect, useState } from "react"

interface IDashboard {
  courses: number
  students: number
  hours: number
}

export const DashboardOverview = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [dashboard, setDashboard] = useState<IDashboard>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data) {
        setDashboard(response.data)
      } else {
        throw new Error("Invalid response data")
      }
    } catch (error) {
      setError("Error fetching dashboard data")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const institutionStats = [
    {
      title: "Total Courses",
      value: dashboard?.courses || 0,
      icon: BookOpen,
      trend: "+12%",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Active courses offered",
      change: "+3 this month",
    },
    {
      title: "Enrolled Students",
      value: dashboard?.students || 0,
      icon: Users,
      trend: "+18%",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      description: "Total active enrollments",
      change: "+127 this month",
    },
    {
      title: "Content Hours",
      value: dashboard?.hours || 0,
      icon: Clock,
      trend: "+8%",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      description: "Total learning content",
      change: "+45 hours added",
    },
    {
      title: "Certifications",
      value: dashboard?.courses || 0,
      icon: Award,
      trend: "+25%",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Certificates issued",
      change: "+89 this month",
    },
  ]

  const recentActivities = [
    { action: "New course published", course: "Advanced AI Ethics", time: "2 hours ago", type: "course" },
    { action: "Student batch completed", course: "Data Science Fundamentals", time: "4 hours ago", type: "completion" },
    { action: "Instructor added", course: "Machine Learning Basics", time: "1 day ago", type: "instructor" },
    { action: "Course updated", course: "Cybersecurity Essentials", time: "2 days ago", type: "update" },
  ]

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-1 md:p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 md:block hidden bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-900">Institution Dashboard</h1>
              <p className="text-gray-600 text-lg">Manage your educational platform</p>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col md:flex-col items-center space-x-3">
          <Button variant="outline" className="border-gray-200 hover:border-blue-300 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="border-gray-200 hover:border-blue-300 bg-transparent">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {institutionStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${stat.color} opacity-20`}></div>
                </div>
              </div>

              <CardHeader className="flex flex-row items-start justify-between pb-3 relative z-10">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</span>
                    <div className="flex items-center space-x-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    <span dangerouslySetInnerHTML={{ __html: stat.description }} />
                  </p>
                  <p className="text-xs text-blue-600 font-medium">{stat.change}</p>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min((stat.value / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Overview */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Performance Overview</CardTitle>
              <p className="text-gray-600 text-sm mt-1">Institution metrics this month</p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="85, 100"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">85%</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Course Completion</p>
                  <p className="text-xs text-gray-500">Average across all courses</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="92, 100"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-600">92%</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Student Satisfaction</p>
                  <p className="text-xs text-gray-500">Based on course ratings</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="78, 100"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-600">78%</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Instructor Utilization</p>
                  <p className="text-xs text-gray-500">Active teaching hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <p className="text-gray-600 text-sm">Latest platform updates</p>
            </div>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {activity.type === "course" && (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.type === "completion" && (
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <GraduationCap className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}
                  {activity.type === "instructor" && (
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                  {activity.type === "update" && (
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Settings className="h-4 w-4 text-amber-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-blue-600">{activity.course}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-gray-200 hover:border-blue-300 bg-transparent">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Management Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Management</CardTitle>
          <p className="text-gray-600 text-sm">Common administrative tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Add Course</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 bg-transparent"
            >
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">Manage Students</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
            >
              <UserCheck className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Add Instructor</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 bg-transparent"
            >
              <BarChart3 className="h-5 w-5 text-amber-600" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
