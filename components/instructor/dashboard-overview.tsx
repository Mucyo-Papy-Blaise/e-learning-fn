"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { fetchInstructorDashboard } from "@/lib/api/instructor"
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
      const data = await fetchInstructorDashboard()
      if (data) {
        setDashboard(data)
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
    { title: "Courses", value: dashboard?.courses || 0, icon: BookOpen },
    { title: "Students", value: dashboard?.students || 0, icon: Users },
    { title: "Content Hours", value: dashboard?.hours || 0, icon: Clock },
    { title: "Assignments Pending", value: 0, icon: Award },
  ]

  // const recentActivities = [
  //   { action: "New course published", course: "Advanced AI Ethics", time: "2 hours ago", type: "course" },
  //   { action: "Student batch completed", course: "Data Science Fundamentals", time: "4 hours ago", type: "completion" },
  //   { action: "Instructor added", course: "Machine Learning Basics", time: "1 day ago", type: "instructor" },
  //   { action: "Course updated", course: "Cybersecurity Essentials", time: "2 days ago", type: "update" },
  // ]

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
    <div className="space-y-8 p-4 md:p-8 bg-[color:var(--brand-light)] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--brand-navy)]">Instructor Dashboard</h1>
          <p className="text-sm text-gray-600">A quick overview of your teaching activity</p>
        </div>
        <Button className="bg-[color:var(--brand-blue)] hover:opacity-90">Create Course</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {institutionStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[color:var(--brand-blue)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button className="bg-[color:var(--brand-blue)] hover:opacity-90">Create Course</Button>
              <Button variant="outline" className="border-gray-200">Add Module</Button>
              <Button variant="outline" className="border-gray-200">Add Lesson</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          {/* <CardContent className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-md">
                  <BookOpen className="h-4 w-4 text-gray-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.course} • {activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent> */}
        </Card>
      </div>
    </div>
  )
}
