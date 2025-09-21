"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapEditor from "@/components/ui/TipTap.Editor";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  _id: string;
  title: string;
}

interface Module {
  _id: string;
  title: string;
  course_id: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course_id: string | { _id?: string; title?: string };
  module_id: string | { _id?: string; title?: string };
  dueDate: string;
  availableAfter?: string;
  points: number;
  submissionType?: "text" | "file" | "url" | "multiple";
  allowedAttempts?: number;
  status?: "draft" | "published" | "closed";
  instructions?: string;
  attachments?: any[];
  rubric?: any;
}

interface AssignmentFormProps {
  isEditing?: boolean;
  assignmentId?: string;
  initialData?: Assignment;
  moduleId?: string; 
  courseId?: string;
}

export default function AssignmentForm({
  isEditing = false,
  assignmentId,
  initialData,
}: AssignmentFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(!!(isEditing && !initialData));
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true)
  const [loadingModules, setLoadingModules] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    availableAfter: "",
    points: "",
    submissionType: "file" as "text" | "file" | "url" | "multiple",
    allowedAttempts: "1",
    status: "draft" as "draft" | "published" | "closed",
    instructions: "",
    rubric: "",
  });

  // Load courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor/courses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const payload = response.data;
        setCourses(Array.isArray(payload) ? payload : payload.courses || []);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("Failed to load courses");
        setCourses([]);
      }finally{
        setLoadingCourses(false)
      }
    };
    loadCourses();
  }, []);

  // Load assignment for editing if needed
  useEffect(() => {
    const loadAssignment = async () => {
      if (initialData) {
        populateFormData(initialData);
        setInitialLoading(false);
        return;
      }
      if (!isEditing || !assignmentId) {
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const assignment: Assignment = response.data;
        populateFormData(assignment);
      } catch (error) {
        console.error("Failed to load assignment:", error);
        toast.error("Failed to load assignment data");
        router.push("/instructor/assignments");
      } finally {
        setInitialLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId, isEditing, initialData, router]);

  const populateFormData = (assignment: Assignment) => {
    // Normalize course_id and module_id to strings
    const normCourseId =
      typeof assignment.course_id === "object"
        ? assignment.course_id._id ?? ""
        : assignment.course_id ?? "";
    const normModuleId =
      typeof assignment.module_id === "object"
        ? assignment.module_id._id ?? ""
        : assignment.module_id ?? "";

    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : "",
      availableAfter: assignment.availableAfter ? new Date(assignment.availableAfter).toISOString().slice(0, 16) : "",
      points: assignment.points?.toString() ?? "",
      submissionType: assignment.submissionType ?? "file",
      allowedAttempts: (assignment.allowedAttempts ?? 1).toString(),
      status: assignment.status ?? "draft",
      instructions: assignment.instructions ?? "",
      rubric: typeof assignment.rubric === "object" ? JSON.stringify(assignment.rubric, null, 2) : (assignment.rubric ?? ""),
    });

    setSelectedCourse(normCourseId);
    setSelectedModule(normModuleId);
    setExistingAttachments(assignment.attachments ?? []);

    if (normCourseId) {
      fetchModulesForCourse(normCourseId, normModuleId);
    }
  };

  // Fetch modules for a course (optionally preselect a module)
  const fetchModulesForCourse = async (courseId: string, preselectedModuleId?: string) => {
    setSelectedCourse(courseId);
    if (!preselectedModuleId) setSelectedModule("");
    setModules([]);
    if (!courseId) return;
    setLoadingModules(true);
    try {
      const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const payload = resp.data;
      const loadedModules = Array.isArray(payload) ? payload : payload.modules || [];
      setModules(loadedModules);
      if (preselectedModuleId) setSelectedModule(preselectedModuleId);
    } catch (err) {
      console.error("Failed to load modules:", err);
      toast.error("Failed to load modules");
      setModules([]);
    }finally{
      setLoadingModules(false)
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (attachmentId: string) => {
    setExistingAttachments((prev) => prev.filter((att) => att._id !== attachmentId));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleInstructionsChange = (content: string) => {
    setFormData((prev) => ({ ...prev, instructions: content }));
  };

  const validateAndProcessRubric = (rubricString: string): any => {
    if (!rubricString || !rubricString.trim()) return "";
    try {
      return JSON.parse(rubricString);
    } catch {
      return rubricString;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client-side validation
    if (!selectedCourse || !selectedModule) {
      toast.error("Please select a course and module");
      return;
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    if (!formData.instructions || !formData.instructions.trim()) {
      toast.error("Instructions are required");
      return;
    }
    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }
    if (!formData.points || Number(formData.points) <= 0) {
      toast.error("Points must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("course_id", selectedCourse);
      formDataToSend.append("module_id", selectedModule);
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("dueDate", formData.dueDate);
      formDataToSend.append("points", formData.points);
      formDataToSend.append("submissionType", formData.submissionType);
      formDataToSend.append("allowedAttempts", formData.allowedAttempts);
      formDataToSend.append("status", formData.status);
      // instructions required by schema
      formDataToSend.append("instructions", formData.instructions.trim());

      if (formData.availableAfter) {
        formDataToSend.append("availableAfter", formData.availableAfter);
      }

      // append new files
      attachments.forEach((file) => formDataToSend.append("attachments", file));

      // include existing attachments (IDs) when editing so backend can keep them
      if (isEditing && existingAttachments.length > 0) {
        formDataToSend.append("existingAttachments", JSON.stringify(existingAttachments.map((att) => att._id)));
      }

      // rubric processing
      const processedRubric = validateAndProcessRubric(formData.rubric);
      formDataToSend.append("rubric", typeof processedRubric === "string" ? processedRubric : JSON.stringify(processedRubric));

      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${assignmentId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/assignments`;
      const method = isEditing ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`Assignment ${isEditing ? "updated" : "created"} successfully!`);
      router.push("/instructor/assignments");
    } catch (error: any) {
      console.error(`Error ${isEditing ? "updating" : "creating"} assignment:`, error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${isEditing ? "update" : "create"} assignment`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading assignment data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{isEditing ? "Edit Assignment" : "Create Assignment"}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course & Module */}
        <Card>
          <CardHeader>
            <CardTitle>Course & Module</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course">Course *</Label>
            <Select value={selectedCourse} onValueChange={(v) => fetchModulesForCourse(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {loadingCourses
                  ? [...Array(3)].map((_, i) => (
                      <div key={i} className="p-2">
                        <Skeleton className="h-4 w-40" />
                      </div>
                    ))
                  : courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.title}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
        </div>

{/* Module */}
<div>
  <Label htmlFor="module">Module *</Label>
  <Select value={selectedModule} onValueChange={setSelectedModule} disabled={!selectedCourse}>
    <SelectTrigger>
      <SelectValue placeholder="Select a module" />
    </SelectTrigger>
    <SelectContent>
      {loadingModules
        ? [...Array(3)].map((_, i) => (
            <div key={i} className="p-2">
              <Skeleton className="h-4 w-36" />
            </div>
          ))
        : modules.map((module) => (
            <SelectItem key={module._id} value={module._id}>
              {module.title}
            </SelectItem>
          ))}
    </SelectContent>
  </Select>
</div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" type="text" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter assignment title" required />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <div className="mt-2">
                <TiptapEditor content={formData.description} onChange={handleDescriptionChange} placeholder="Enter detailed assignment description..." className="min-h-[200px]" name="description" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Use the rich text editor to format the assignment description (headings, lists, links, etc.).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="datetime-local" value={formData.dueDate} onChange={(e) => handleInputChange("dueDate", e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="availableAfter">Available After</Label>
                <Input id="availableAfter" type="datetime-local" value={formData.availableAfter} onChange={(e) => handleInputChange("availableAfter", e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="points">Points *</Label>
              <Input id="points" type="number" min="1" value={formData.points} onChange={(e) => handleInputChange("points", e.target.value)} placeholder="Enter maximum points" required />
            </div>
          </CardContent>
        </Card>

        {/* Submission Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="submissionType">Submission Type</Label>
              <Select value={formData.submissionType} onValueChange={(v) => handleInputChange("submissionType", v as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Entry</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="url">URL Submission</SelectItem>
                  <SelectItem value="multiple">Text + File Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="allowedAttempts">Allowed Attempts</Label>
              <Input id="allowedAttempts" type="number" min="1" max={99} value={formData.allowedAttempts} onChange={(e) => handleInputChange("allowedAttempts", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v as string)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="instructions">Assignment Instructions *</Label>
              <TiptapEditor content={formData.instructions} onChange={handleInstructionsChange} placeholder="Enter assignment instructions..." className="min-h-[200px]" name="instructions" />
              <p className="text-sm text-gray-600 mt-2">Provide clear, step-by-step instructions for students.</p>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing && existingAttachments.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Files</Label>
                {existingAttachments.map((att, idx) => (
                  <div key={att._id ?? idx} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm">{att.filename ?? att.name ?? "file"}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExistingAttachment(att._id)}>Remove</Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="attachments">Upload New Files</Label>
              <Input id="attachments" type="file" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif" />
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label>New Files to Upload</Label>
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeAttachment(i)}>Remove</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rubric */}
        <Card>
          <CardHeader>
            <CardTitle>Rubric (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="rubric">Grading Rubric</Label>
              <Textarea id="rubric" value={formData.rubric} onChange={(e) => handleInputChange("rubric", e.target.value)} placeholder="Enter rubric JSON or text..." rows={6} />
              <p className="text-sm text-gray-600 mt-2">Describe the grading criteria or paste a JSON rubric.</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">{loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Assignment" : "Create Assignment")}</Button>
        </div>
      </form>
    </div>
  );
}
