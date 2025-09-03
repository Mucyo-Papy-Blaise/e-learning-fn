"use client"

import { ClipboardList, CheckCircle, Clock, FileText, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Mock assignment data
const assignmentData = {
  "reflection-activity": {
    id: "reflection-activity",
    title: "Reflection Activity",
    dueDate: "Jul 8 by 10:59pm",
    points: "15",
    submissionType: "Submitting a text entry box",
    availableAfter: "May 16 at 10:30pm",
    status: "submitted",
    submittedDate: "Jul 9 at 11:46am",
    isLate: true,
    isGraded: false,
    purpose: "This activity will help you articulate a core aspect of your mission or a challenge it addresses, using a storytelling framework to highlight the \"gap\" between the current reality and your desired future. This will prepare you for deeper discussions in class.",
    importantNote: "This is a mandatory pre-class activity. We will be reviewing your work in class, and it is an integral part of our main activity. **Students who come to class without completing this reflection will be asked to leave.**",
    questions: [
      "What is the current situation (the \"what is\") related to your mission?",
      "What is the desired future (the \"what could be\") that your mission aims to achieve?",
      "What potential \"intriguing\" opening could you use to hook your audience when discussing this?",
      "What is a brief \"solution\" or approach inherent in your mission?",
      "What is a potential positive \"outcome\" or impact of your mission?"
    ]
  },
  "term-paper-summative": {
    id: "term-paper-summative",
    title: "Term Paper_Module Summative",
    dueDate: "Jul 31 by 11:59pm",
    points: "20",
    submissionType: "Submitting a file upload",
    availableAfter: "Jul 15 at 12:00am",
    status: "not_submitted",
    submittedDate: null,
    isLate: false,
    isGraded: false,
    purpose: "This comprehensive term paper will demonstrate your understanding of the course material and your ability to apply communication principles to real-world scenarios.",
    importantNote: "This is a major assignment worth 20% of your final grade. Please ensure you follow all formatting guidelines and submit your work on time.",
    questions: [
      "Analyze a communication challenge in your field of interest",
      "Apply the communication theories discussed in class",
      "Propose solutions based on best practices",
      "Reflect on the potential impact of your recommendations"
    ]
  },
  "create-your-first-podcast": {
    id: "create-your-first-podcast",
    title: "Create Your First Podcast_Formative Assignment",
    dueDate: "Jun 29 by 11:59pm",
    points: "20",
    submissionType: "Submitting a file upload",
    availableAfter: "Jun 15 at 12:00am",
    status: "submitted",
    submittedDate: "Jun 28 at 3:45pm",
    isLate: false,
    isGraded: true,
    grade: "16/20",
    purpose: "Create your first podcast episode focusing on a topic related to effective communication. This assignment will help you develop your voice and storytelling skills.",
    importantNote: "Make sure your audio quality is clear and your content is engaging. The podcast should be between 5-10 minutes in length.",
    questions: [
      "What topic will you focus on for your podcast?",
      "How will you structure your content to engage listeners?",
      "What techniques will you use to maintain audience interest?",
      "How will you conclude your podcast effectively?"
    ]
  }
}

export default function AssignmentDetailPage({ 
  params 
}: { 
  params: { courseId: string; assignmentId: string } 
}) {
  const { courseId, assignmentId } = params
  const assignment = assignmentData[assignmentId as keyof typeof assignmentData]

  if (!assignment) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
          <h1 className="text-xl font-semibold text-gray-900">
            <Link href={`/student/courses/${courseId}/assignments`} className="text-blue-600 hover:underline">
              Assignments
            </Link>{" "}
            <span className="text-gray-400">›</span> Assignment Not Found
          </h1>
        </header>
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Assignment Not Found</h2>
            <p className="text-sm text-gray-600">The assignment you{"'"}re looking for doesn{"'"}t exist.</p>
          </div>
        </main>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (assignment.status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "not_submitted":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (assignment.status) {
      case "submitted":
        return "Submitted!"
      case "not_submitted":
        return "Not Submitted"
      default:
        return "In Progress"
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          <Link href={`/student/courses/${courseId}/assignments`} className="text-blue-600 hover:underline">
            Assignments
          </Link>{" "}
          <span className="text-gray-400">›</span> {assignment.title}
        </h1>
        <div className="ml-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            New Attempt
          </Button>
        </div>
      </header>

      <main className="flex flex-1 gap-6 p-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {/* Assignment Metadata */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>Due {assignment.dueDate}</p>
            <p>Points {assignment.points}</p>
            <p>{assignment.submissionType}</p>
            <p>Available after {assignment.availableAfter}</p>
          </div>

          <hr className="border-gray-200" />

          {/* Activity Link */}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <Link href="#" className="text-blue-600 hover:underline">
              {assignment.title}
            </Link>
          </div>

          {/* Purpose Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Purpose:</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{assignment.purpose}</p>
          </div>

          {/* Important Note Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Important Note:</h3>
            <p 
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: assignment.importantNote }}
            />
          </div>

          {/* Reflection Questions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Reflection Questions:</h3>
            <ul className="space-y-2">
              {assignment.questions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm mt-0.5">•</span>
                  <span className="text-sm text-gray-700">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submission Status Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Submission</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="font-semibold text-gray-900">{getStatusText()}</span>
              </div>

              {/* Submission Date */}
              {assignment.submittedDate && (
                <div className="text-sm text-gray-600">
                  {assignment.submittedDate}
                  {assignment.isLate && (
                    <span className="text-red-600 ml-1">(late)</span>
                  )}
                </div>
              )}

              {/* Submission Details Link */}
              {assignment.status === "submitted" && (
                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  Submission Details
                </Link>
              )}

              {/* Grading Message */}
              {assignment.status === "submitted" && !assignment.isGraded && (
                <p className="text-sm text-gray-600">
                  You may not see all comments right now because the assignment is currently being graded.
                </p>
              )}

              {/* Grade Display */}
              {'grade' in assignment && assignment.isGraded && (assignment as any).grade && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Grade: {(assignment as any).grade}</p>
                </div>
              )}

              {/* Action Buttons */}
              {assignment.status === "not_submitted" && (
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Submit Assignment
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Draft
                  </Button>
                </div>
              )}

              {assignment.status === "submitted" && (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    View Submission
                  </Button>
                  <Button variant="outline" className="w-full">
                    Resubmit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 