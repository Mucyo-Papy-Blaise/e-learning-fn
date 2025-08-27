import { Bell, CalendarDays, CheckCircle, Circle, Clock, BookOpen, FileText, X, PlayCircle, Award, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock data for a student-focused experience
const courseData = {
  title: "Communicating for Impact",
  progress: 68,
  nextLesson: "Module 4: Persuasive Writing Techniques",
  totalLessons: 12,
  completedLessons: 8,
  instructor: "Dr. Sarah Martinez"
}

const upcomingDeadlines = [
  {
    id: 1,
    title: "Final Project Report",
    type: "assignment",
    dueDate: "July 30, 2025",
    daysLeft: 3,
    priority: "high",
    points: 40
  },
  {
    id: 2,
    title: "Module 4 Quiz",
    type: "quiz",
    dueDate: "August 2, 2025",
    daysLeft: 6,
    priority: "medium",
    points: 15
  },
  {
    id: 3,
    title: "Peer Review Assignment",
    type: "assignment",
    dueDate: "August 5, 2025",
    daysLeft: 9,
    priority: "low",
    points: 25
  }
]

const recentActivity = [
  {
    id: 1,
    type: "grade",
    title: "Module 3 Quiz - Graded",
    description: "You scored 92/100. Great work on understanding audience analysis!",
    time: "2 hours ago",
    icon: Award,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "announcement",
    title: "Course Update",
    description: "New supplementary reading materials have been added to Module 4.",
    time: "1 day ago",
    icon: Bell,
    color: "text-gray-600"
  },
  {
    id: 3,
    type: "reminder",
    title: "Assignment Reminder",
    description: "Don't forget: Final Project Report is due in 3 days.",
    time: "2 days ago",
    icon: AlertCircle,
    color: "text-gray-600"
  }
]

const quickLinks = [
  { title: "Course Materials", href: "#", icon: BookOpen },
  { title: "Assignments", href: "#", icon: FileText },
  { title: "Grades", href: "#", icon: Award },
  { title: "Discussions", href: "#", icon: Bell }
]

export default function CourseHomePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gray-900 text-white'
      case 'medium': return 'bg-gray-600 text-white'
      case 'low': return 'bg-gray-400 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50 min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            {courseData.title}
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Progress: {courseData.progress}%</span>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="max-w-7xl mx-auto w-full p-6">
          {/* Welcome Section & Progress */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 mb-4">
                    You{"'"}re making great progress in {courseData.title}. Ready to continue?
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Instructor: {courseData.instructor}</span>
                    <span>•</span>
                    <span>{courseData.completedLessons} of {courseData.totalLessons} lessons completed</span>
                  </div>
                </div>
                <div className="lg:w-80">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Course Progress</span>
                      <span className="text-lg font-bold text-blue-600">{courseData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                        style={{ width: `${courseData.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full justify-center"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Continue: {courseData.nextLesson}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upcoming Deadlines */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg mt-1">
                            {deadline.type === 'quiz' ? (
                              <PlayCircle className="h-4 w-4 text-gray-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{deadline.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                              <span>Due: {deadline.dueDate}</span>
                              <span>•</span>
                              <span>{deadline.points} points</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                                {deadline.daysLeft} days left
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {deadline.priority} priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          {deadline.type === 'quiz' ? 'Start Quiz' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg mt-1">
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {activity.description}
                        </p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Activity →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-8">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">You{"'"}re doing great!</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    You{"'"}ve completed {courseData.completedLessons} lessons and are {courseData.progress}% through the course. 
                    Keep up the excellent work and you{"'"}ll finish ahead of schedule!
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-700">Current average: 89%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-700">3 assignments remaining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}