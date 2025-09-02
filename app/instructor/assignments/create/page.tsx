"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import TiptapEditor from "@/components/ui/TipTap.Editor"
import { Calendar, FileText, Upload, Save, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"

interface Course {
  _id: string
  title: string
}

interface Module {
  _id: string
  title: string
  course_id: string
}

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedModule, setSelectedModule] = useState<string>("")
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    availableAfter: "",
    points: "",
    submissionType: "text",
    allowedAttempts: "1",
    status: "draft"
  })

  const [attachments, setAttachments] = useState<File[]>([])

  // Load courses on mount
  useState(() => {
    const loadCourses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setCourses(response.data)
      } catch (error) {
        toast.error("Failed to load courses")
      }
    }
    loadCourses()
  }, [])

  // Load modules when course changes
  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId)
    setSelectedModule("")
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setModules(response.data)
    } catch (error) {
      toast.error("Failed to load modules")
      setModules([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse || !selectedModule) {
      toast.error("Please select a course and module")
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append("course_id", selectedCourse)
      formDataToSend.append("module_id", selectedModule)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("instructions", formData.instructions)
      formDataToSend.append("dueDate", formData.dueDate)
      formDataToSend.append("availableAfter", formData.availableAfter)
      formDataToSend.append("points", formData.points)
      formDataToSend.append("submissionType", formData.submissionType)
      formDataToSend.append("allowedAttempts", formData.allowedAttempts)
      formDataToSend.append("status", formData.status)

      // Add attachments
      attachments.forEach((file, index) => {
        formDataToSend.append(`attachment_${index}`, file)
      })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      toast.success("Assignment created successfully!")
      router.push("/instructor/assignments")
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast.error("Failed to create assignment")
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-2xl font-bold">Create Assignment</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={selectedCourse} onValueChange={handleCourseChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">Module *</Label>
                <Select 
                  value={selectedModule} 
                  onValueChange={setSelectedModule}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module._id} value={module._id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <TiptapEditor
              name="instructions"
              content={formData.instructions}
              onChange={(content) => setFormData(prev => ({ ...prev, instructions: content }))}
              placeholder="Write detailed instructions for the assignment..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableAfter">Available After</Label>
                <Input
                  id="availableAfter"
                  type="datetime-local"
                  value={formData.availableAfter}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableAfter: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                  placeholder="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type</Label>
                <Select 
                  value={formData.submissionType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, submissionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Only</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="multiple">Text + File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedAttempts">Allowed Attempts</Label>
                <Input
                  id="allowedAttempts"
                  type="number"
                  value={formData.allowedAttempts}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowedAttempts: e.target.value }))}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="attachments">Upload Files</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </form>
    </div>
  )
}