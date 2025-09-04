'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Clock, 
  Calendar,
  FileText,
  Upload,
  File,
  CheckCircle2
} from "lucide-react";
// Use react-toastify consistently to avoid provider conflicts
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import { createExam } from "@/app/lib/api";

interface ExamFormData {
  title: string;
  course: string;
  description: string;
  instructions: string;
  examContent: string;
  attachments: File[];
  startDate: string;
  endDate: string;
  duration: number;
  passingScore: number;
  maxAttempts: number;
  allowFileSubmission: boolean;
  allowTextSubmission: boolean;
  submissionInstructions: string;
  gradingCriteria: string;
  totalPoints: number;
  isRandomized: boolean;
  showResults: boolean;
  allowReview: boolean;
  status: 'draft' | 'published';
}

export default function CreateExamPage() {
  const router = useRouter();
  // toast imported from react-toastify
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    course: '',
    description: '',
    instructions: '',
    examContent: '',
    attachments: [],
    startDate: '',
    endDate: '',
    duration: 120,
    passingScore: 70,
    maxAttempts: 1,
    allowFileSubmission: true,
    allowTextSubmission: true,
    submissionInstructions: '',
    gradingCriteria: '',
    totalPoints: 100,
    isRandomized: false,
    showResults: true,
    allowReview: true,
    status: 'draft'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/instructor/courses');
      setCourses(response.data.courses || response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ExamFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCourseChange = async (courseId: string) => {
    handleInputChange('course', courseId)
    try {
      const res = await axiosInstance.get(`/api/courses/${courseId}/modules`)
      setModules(res.data || [])
    } catch (e) {
      setModules([])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Exam title is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.course) {
      toast({
        title: "Validation Error",
        description: "Please select a course",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.examContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Exam content is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Start and end dates are required",
        variant: "destructive",
      });
      return false;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return false;
    }

    if (formData.duration <= 0) {
      toast({
        title: "Validation Error",
        description: "Duration must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Send JSON body to backend (no multipart)
      const payload = {
        title: formData.title,
        course: formData.course,
        description: formData.description,
        instructions: formData.instructions,
        examContent: formData.examContent,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        passingScore: formData.passingScore,
        totalPoints: formData.totalPoints,
      } as const;

      const res = await createExam(payload as any);
      if (!res.ok) throw new Error(res.message);
      
      toast({
        title: "Success",
        description: "Exam created successfully!",
      });
      
      router.push('/instructor/exams');
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create exam",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                Create New Exam
              </h1>
              <p className="text-muted-foreground">
                Design a comprehensive text-based exam for your students
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter exam title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <select
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module">Module *</Label>
                  <select
                    id="module"
                    value={(formData as any).module_id || ''}
                    onChange={(e) => (setFormData(prev => ({ ...prev, ...( { module_id: e.target.value } as any) })))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                    disabled={!formData.course}
                    required
                  >
                    <option value="">Select a module</option>
                    {modules.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter exam description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions for Students</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter instructions for students taking the exam"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Content */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exam Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="examContent">Exam Content *</Label>
                <Textarea
                  id="examContent"
                  placeholder="Write or paste your exam content here. You can include questions, instructions, and any other content students need to see."
                  value={formData.examContent}
                  onChange={(e) => handleInputChange('examContent', e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Write your complete exam here. Students will see this content when they take the exam.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Upload exam files (PDF, Word, images, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </Label>
                </div>

                {/* Display uploaded files */}
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files:</Label>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-slate-500" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Exam Settings */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Exam Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="1"
                    value={formData.maxAttempts}
                    onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    min="0"
                    value={formData.totalPoints}
                    onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Submission Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowTextSubmission"
                      checked={formData.allowTextSubmission}
                      onChange={(e) => handleInputChange('allowTextSubmission', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="allowTextSubmission" className="text-sm">Allow text submission</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowFileSubmission"
                      checked={formData.allowFileSubmission}
                      onChange={(e) => handleInputChange('allowFileSubmission', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="allowFileSubmission" className="text-sm">Allow file submission</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionInstructions">Submission Instructions</Label>
                <Textarea
                  id="submissionInstructions"
                  placeholder="Instructions for how students should submit their answers"
                  value={formData.submissionInstructions}
                  onChange={(e) => handleInputChange('submissionInstructions', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradingCriteria">Grading Criteria</Label>
                <Textarea
                  id="gradingCriteria"
                  placeholder="Explain how the exam will be graded"
                  value={formData.gradingCriteria}
                  onChange={(e) => handleInputChange('gradingCriteria', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Exam Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Exam
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
