"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import TiptapEditor from "@/components/ui/TipTap.Editor"
import { FileText, Upload, Send, ArrowLeft, Calendar, Clock, Award } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"

interface Assignment {
  _id: string
  title: string
  description: string
  instructions: string
  dueDate: string
  availableAfter: string
  points: number
  submissionType: string
  allowedAttempts: number
  status: string
  course_id: {
    _id: string
    title: string
  }
  module_id: {
    _id: string
    title: string
  }
}

interface Submission {
  _id: string
  content: string
  file_url?: string
  status: string
  submitted_at: string
  grade?: number
  feedback?: string
}

export default function SubmitAssignmentPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.assignmentId as string
  
  const [loading, setLoading] = useState(false)
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null)
  const [submissionContent, setSubmissionContent] = useState("")
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )
        setAssignment(response.data)
      } catch (error) {
        toast.error("Failed to load assignment")
        router.push("/student/assignments")
      }
    }

    const loadExistingSubmission = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}/submissions/me`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )
        if (response.data) {
          setExistingSubmission(response.data)
          setSubmissionContent(response.data.content || "")
          setAttempts(1) // Assuming one attempt if submission exists
        }
      } catch (error) {
        // No existing submission, which is fine
      }
    }

    loadAssignment()
    loadExistingSubmission()
  }, [assignmentId, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubmissionFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!assignment) return

    // Check if assignment allows more attempts
    if (existingSubmission && attempts >= assignment.allowedAttempts) {
      toast.error("Maximum attempts reached for this assignment")
      return
    }

    // Check if assignment is still available
    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    if (now > dueDate) {
      toast.error("Assignment deadline has passed")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      
      // Add submission content
      formData.append("content", submissionContent)
      formData.append("courseId", assignment.course_id._id)
      
      // Add file if provided and assignment allows it
      if (submissionFile && (assignment.submissionType === "file" || assignment.submissionType === "multiple")) {
        formData.append("file", submissionFile)
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      toast.success("Assignment submitted successfully!")
      router.push("/student/assignments")
    } catch (error) {
      console.error("Error submitting assignment:", error)
      toast.error("Failed to submit assignment")
    } finally {
      setLoading(false)
    }
  }

  if (!assignment) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="text-center">Loading assignment...</div>
      </div>
    )
  }

  const isOverdue = new Date() > new Date(assignment.dueDate)
  const isAvailable = new Date() >= new Date(assignment.availableAfter || 0)

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Submit Assignment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4" />
                  <span>{assignment.points} points</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Attempts: {attempts}/{assignment.allowedAttempts}</span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Submission Type: </span>
                  <span className="capitalize">{assignment.submissionType}</span>
                </div>
              </div>

              {existingSubmission && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="font-medium text-blue-900">Previous Submission</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Status: <span className="capitalize">{existingSubmission.status}</span>
                  </p>
                  {existingSubmission.grade && (
                    <p className="text-sm text-blue-700">
                      Grade: {existingSubmission.grade}/{assignment.points}
                    </p>
                  )}
                </div>
              )}

              {!isAvailable && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    Assignment not yet available. Available after: {new Date(assignment.availableAfter).toLocaleDateString()}
                  </p>
                </div>
              )}

              {isOverdue && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    Assignment is overdue. Late submissions may be penalized.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAvailable ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Assignment is not yet available for submission.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Instructions */}
                  {assignment.instructions && (
                    <div className="space-y-2">
                      <Label>Instructions</Label>
                      <div 
                        className="prose prose-sm max-w-none p-4 bg-gray-50 rounded border"
                        dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                      />
                    </div>
                  )}

                  {/* Text Submission */}
                  {(assignment.submissionType === "text" || assignment.submissionType === "multiple") && (
                    <div className="space-y-2">
                      <Label>Your Response *</Label>
                      <TiptapEditor
                        name="submissionContent"
                        content={submissionContent}
                        onChange={setSubmissionContent}
                        placeholder="Write your response here..."
                      />
                    </div>
                  )}

                  {/* File Submission */}
                  {(assignment.submissionType === "file" || assignment.submissionType === "multiple") && (
                    <div className="space-y-2">
                      <Label htmlFor="submissionFile">
                        Upload File {assignment.submissionType === "file" ? "*" : ""}
                      </Label>
                      <Input
                        id="submissionFile"
                        type="file"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                        required={assignment.submissionType === "file"}
                      />
                      {submissionFile && (
                        <p className="text-sm text-gray-600">
                          Selected: {submissionFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* URL Submission */}
                  {assignment.submissionType === "url" && (
                    <div className="space-y-2">
                      <Label htmlFor="submissionUrl">Submission URL *</Label>
                      <Input
                        id="submissionUrl"
                        type="url"
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        placeholder="https://example.com/your-work"
                        required
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      // disabled={loading || (existingSubmission && attempts >= assignment.allowedAttempts)}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {loading ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
