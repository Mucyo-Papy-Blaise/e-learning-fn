/* eslint-disable @next/next/no-img-element */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { getInstructorDashboard } from "@/lib/api/instructor"
import { BookOpen, Users, Clock, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyInstructorProfile } from "@/lib/api/instructor/profile"

interface IDashboard {
  courses: number
  students: number
  hours: number
}

export const DashboardOverview = () => {
  const router = useRouter()
  const [dashboard, setDashboard] = useState<IDashboard>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { user,logout} = useAuth()

  const fetchDashboard = async () => {
    try {
      const data = await getInstructorDashboard()
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
    const load = async () => {
      try {
        const res = await getMyInstructorProfile()
        const url = res?.instructor?.profile_image || null
        setAvatarUrl(url)
      } catch {}
    }
    load()
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const institutionStats = [
    { title: "Courses", value: dashboard?.courses || 0, icon: BookOpen },
    { title: "Students", value: dashboard?.students || 0, icon: Users },
    { title: "Content Hours", value: dashboard?.hours || 0, icon: Clock },
    { title: "Assignments Pending", value: 0, icon: Award },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const goHome = () => {
    router.push("/")
  }

  return (
    <div className="space-y-8 p-4 md:p-8 bg-[color:var(--brand-light)] min-h-screen">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--brand-navy)]">Instructor Dashboard</h1>
          <p className="text-sm text-gray-600">A quick overview of your teaching activity</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm bg-white hover:bg-gray-100">
            <div className="h-8 w-8 bg-gray-200 rounded-full overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )
              }
            </div>
            <span className="text-gray-700 font-medium truncate">{user?.name || 'John Doe'}</span>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={goHome} className="cursor-pointer">
             Return Home
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <CardContent>
            <p className="text-gray-500 text-sm">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
