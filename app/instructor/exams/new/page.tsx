'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  FileText
} from "lucide-react";
// Use react-toastify consistently to avoid provider conflicts
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import { createExam, createExamQuestion } from "@/app/lib/api";

interface ExamFormData {
  title: string;
  course: string;
  description: string;
  instructions: string;
  startDate: string;
  endDate: string;
  duration: number;
  passingScore: number;
  totalPoints: number;
  status: 'draft' | 'published';
}

type NewMCQ = {
  question: string;
  options: string[];
  correct_answer: string;
  points: number;
};

export default function CreateExamPage() {
  const router = useRouter();
  // toast imported from react-toastify
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<NewMCQ[]>([]);
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    course: '',
    description: '',
    instructions: '',
    startDate: '',
    endDate: '',
    duration: 120,
    passingScore: 70,
    totalPoints: 100,
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
    toast.error(error instanceof Error ? error.message : 'Failed to load courses');
    }
  };

  const handleInputChange = (field: keyof ExamFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };  1

  const handleCourseChange = async (courseId: string) => {
    handleInputChange('course', courseId)
  }

  const validateForm = (): boolean => {
  if (!formData.title.trim()) {
    toast.error("Exam title is required");
    return false;
  }

  if (!formData.course) {
    toast.error("Please select a course");
    return false;
  }

  if (!formData.startDate || !formData.endDate) {
    toast.error("Start and end dates are required");
    return false;
  }

  if (new Date(formData.startDate) >= new Date(formData.endDate)) {
    toast.error("End date must be after start date");
    return false;
  }

  if (formData.duration <= 0) {
    toast.error("Duration must be greater than 0");
    return false;
  }

  // Validate MCQ questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    if (!q.question.trim()) {
      toast.error(`Question ${i + 1}: question text is required`)
      return false
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      toast.error(`Question ${i + 1}: provide at least 2 options`)
      return false
    }
    if (!q.options.includes(q.correct_answer)) {
      toast.error(`Question ${i + 1}: correct answer must be one of the options`)
      return false
    }
    if (q.points <= 0) {
      toast.error(`Question ${i + 1}: points must be greater than 0`)
      return false
    }
  }

  return true;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        course: formData.course,
        description: formData.description,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        passingScore: formData.passingScore,
        totalPoints: formData.totalPoints,
      } as const;

      const res = await createExam(payload as any);
      if (!res.ok) throw new Error(res.message);

      const examId = (res.data as any).exam?._id || (res.data as any).exam?.id || (res.data as any)._id
      if (!examId) throw new Error('Failed to get exam id');

      if (questions.length > 0) {
        await Promise.all(questions.map((q, idx) => createExamQuestion(examId, {
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          points: q.points,
          order: idx + 1,
        } as any)))
      }

      toast.success("Exam created successfully!")
      router.push('/instructor/exams');
    } catch (error: any) {
      console.error('Error creating exam:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create an exam');
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
                Create New Exam (MCQ Only)
              </h1>
              <p className="text-muted-foreground">
                Create an exam with multiple choice questions only
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

          {/* MCQ Builder */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Questions (Multiple Choice Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={() => setQuestions(qs => ([...qs, { question: 'New question', options: ['Option 1', 'Option 2'], correct_answer: 'Option 1', points: 1 }]))}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>
              <div className="space-y-4">
                {questions.map((q, qi) => (
                  <div key={qi} className="p-4 bg-white dark:bg-slate-900 rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Question {qi + 1}</div>
                      <Button type="button" variant="ghost" className="text-red-600" onClick={() => setQuestions(prev => prev.filter((_, i) => i !== qi))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea value={q.question} onChange={(e) => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, question: e.target.value } : x))} />
                    </div>
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="space-y-1">
                            <Label>Option {oi + 1}</Label>
                            <div className="flex gap-2">
                              <Input value={opt} onChange={(e) => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, options: x.options.map((o, j) => j === oi ? e.target.value : o) } : x))} />
                              <Button type="button" variant="outline" onClick={() => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, options: x.options.filter((_, j) => j !== oi), correct_answer: x.correct_answer === x.options[oi] ? (x.options.filter((_, j) => j !== oi)[0] ?? '') : x.correct_answer } : x))}>Remove</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="secondary" onClick={() => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, options: [...x.options, `Option ${x.options.length + 1}`] } : x))}>Add Option</Button>
                      <div className="space-y-2">
                        <Label>Correct answer</Label>
                        <select className="w-full px-3 py-2 border rounded" value={q.correct_answer} onChange={(e) => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, correct_answer: e.target.value } : x))}>
                          {q.options.map((o, i) => (
                            <option key={i} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <Label>Points</Label>
                        <Input type="number" min="1" value={q.points} onChange={(e) => setQuestions(prev => prev.map((x, i) => i === qi ? { ...x, points: parseInt(e.target.value || '0', 10) } : x))} />
                      </div>
                    </div>
                  </div>
                ))}
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
