"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { fetchInstitutionStats, fetchInstitutionDashboardAggregated } from "@/lib/api/institution-dashboard"

interface IDashboard {
  totalInstructors: number
  totalStudents: number
  totalCourses: number
  activeEnrollments: number
  completionRate: number
  newRegistrations: number
}

export default function InstitutionDashboardOverview() {
  const [dashboard, setDashboard] = useState<IDashboard | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [recentActivities, setRecentActivities] = useState<Array<{ action?: string; title?: string; detail?: string; time?: string }>>([])

  useEffect(() => {
    const load = async () => {
      try {
        const agg = await fetchInstitutionDashboardAggregated().catch(() => null)
        if (agg?.stats) {
          const s = agg.stats
          const normalized: IDashboard = {
            totalInstructors: Number(s?.totalInstructors ?? 0),
            totalStudents: Number(s?.totalStudents ?? 0),
            totalCourses: Number(s?.totalCourses ?? 0),
            activeEnrollments: Number(s?.activeEnrollments ?? 0),
            completionRate: Number(s?.completionRate ?? 0),
            newRegistrations: Number(s?.newRegistrations ?? 0),
          }
          setDashboard(normalized)
        } else {
          const data = await fetchInstitutionStats()
          const normalized: IDashboard = {
            totalInstructors: Number((data as any)?.totalInstructors ?? (data as any)?.instructors ?? 0),
            totalStudents: Number((data as any)?.totalStudents ?? (data as any)?.students ?? 0),
            totalCourses: Number((data as any)?.totalCourses ?? (data as any)?.courses ?? 0),
            activeEnrollments: Number((data as any)?.activeEnrollments ?? (data as any)?.enrollments ?? 0),
            completionRate: Number((data as any)?.completionRate ?? (data as any)?.completion_rate ?? 0),
            newRegistrations: Number((data as any)?.newRegistrations ?? (data as any)?.registrations ?? 0),
          }
          setDashboard(normalized)
        }
        if (Array.isArray(agg?.recentActivity)) {
          const mapped = agg.recentActivity.map((a: any) => ({
            action: a.title || a.type,
            detail: a.detail,
            time: a.time,
          }))
          setRecentActivities(mapped)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const institutionStats = [
    { title: "Total Instructors", value: dashboard?.totalInstructors || 0, icon: UserCheck },
    { title: "Total Students", value: dashboard?.totalStudents || 0, icon: Users },
    { title: "Total Courses", value: dashboard?.totalCourses || 0, icon: BookOpen },
    { title: "Active Enrollments", value: dashboard?.activeEnrollments || 0, icon: GraduationCap },
  ]

  const performanceMetrics = [
    { title: "Course Completion Rate", value: `${dashboard?.completionRate || 0}%`, change: "0.0%" },
    { title: "New Registrations", value: dashboard?.newRegistrations || 0, change: "0.0%" },
    // { title: "Student Satisfaction", value: "4.8/5", change: "+0.3" },
  ]

  

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Institution Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your educational institution</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Link href="/institution/instructors/new" className="flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          Add Instructor
          </Link>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {institutionStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
            </div>
          )
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-2">{metric.title}</div>
              <div className="text-xs text-green-600 font-medium">{metric.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors">
              Add New Instructor
            </button>
            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
              Create Department
            </button>
            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
              Approve Courses
            </button>
            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors">
              Generate Reports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.detail}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Department Overview</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top Performing Departments</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Computer Science</p>
                  <p className="text-xs text-gray-600">12 instructors • 28 courses</p>
                </div>
                <div className="text-sm font-semibold text-blue-600">450 students</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Administration</p>
                  <p className="text-xs text-gray-600">8 instructors • 18 courses</p>
                </div>
                <div className="text-sm font-semibold text-blue-600">320 students</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Design & Arts</p>
                  <p className="text-xs text-gray-600">6 instructors • 15 courses</p>
                </div>
                <div className="text-sm font-semibold text-blue-600">280 students</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Enrollments</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Introduction to AI</p>
                  <p className="text-xs text-gray-600">Started 2 days ago</p>
                </div>
                <div className="text-sm font-semibold text-green-600">+24</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Python Programming</p>
                  <p className="text-xs text-gray-600">Started 3 days ago</p>
                </div>
                <div className="text-sm font-semibold text-green-600">+18</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Digital Marketing</p>
                  <p className="text-xs text-gray-600">Started 5 days ago</p>
                </div>
                <div className="text-sm font-semibold text-green-600">+15</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}