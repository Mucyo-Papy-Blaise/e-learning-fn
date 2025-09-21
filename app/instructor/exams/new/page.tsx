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
  correct_answers: string[];
  points: number;
};

export default function CreateExamPage() {
  const router = useRouter();
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
  };

  const handleCourseChange = async (courseId: string) => {
    handleInputChange('course', courseId);
  };

  // Fixed MCQ handlers
  const addNewQuestion = () => {
    setQuestions(prev => ([
      ...prev, 
      { 
        question: 'New question', 
        options: ['Option 1', 'Option 2'], 
        correct_answers: ['Option 1'], 
        points: 1 
      }
    ]));
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== questionIndex));
  };

  const updateQuestion = (questionIndex: number, field: keyof NewMCQ, value: any) => {
    setQuestions(prev => prev.map((question, i) => 
      i === questionIndex ? { ...question, [field]: value } : question
    ));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, newValue: string) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      const oldValue = question.options[optionIndex];
      const newOptions = question.options.map((opt, oIdx) => 
        oIdx === optionIndex ? newValue : opt
      );
      
      // Update correct_answers to replace old option value with new one
      const newCorrectAnswers = (question.correct_answers || []).map(answer => 
        answer === oldValue ? newValue : answer
      ).filter(answer => newOptions.includes(answer)); // Ensure all correct answers are valid
      
      return {
        ...question,
        options: newOptions,
        correct_answers: newCorrectAnswers
      };
    }));
  };

  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      const optionToRemove = question.options[optionIndex];
      const newOptions = question.options.filter((_, oIdx) => oIdx !== optionIndex);
      
      // Remove the deleted option from correct_answers and ensure all remaining
      // correct answers are still valid
      const newCorrectAnswers = (question.correct_answers || [])
        .filter(answer => answer !== optionToRemove)
        .filter(answer => newOptions.includes(answer));
      
      return {
        ...question,
        options: newOptions,
        correct_answers: newCorrectAnswers
      };
    }));
  };

  const addQuestionOption = (questionIndex: number) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      return {
        ...question,
        options: [...question.options, `Option ${question.options.length + 1}`]
      };
    }));
  };

  const updateCorrectAnswers = (questionIndex: number, option: string, isChecked: boolean) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      const currentCorrectAnswers = question.correct_answers || [];
      let newCorrectAnswers;
      
      if (isChecked) {
        // Only add if it exists in options and isn't already selected
        if (question.options.includes(option) && !currentCorrectAnswers.includes(option)) {
          newCorrectAnswers = [...currentCorrectAnswers, option];
        } else {
          newCorrectAnswers = currentCorrectAnswers;
        }
      } else {
        newCorrectAnswers = currentCorrectAnswers.filter(answer => answer !== option);
      }
      
      // Final validation: ensure all correct answers are in options
      newCorrectAnswers = newCorrectAnswers.filter(answer => question.options.includes(answer));
      
      return {
        ...question,
        correct_answers: newCorrectAnswers
      };
    }));
  };

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

    // Validate MCQ questions with state cleanup
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }
      
      if (!Array.isArray(q.options) || q.options.length < 2) {
        toast.error(`Question ${i + 1}: Provide at least 2 options`);
        return false;
      }
      
      // Check for empty or duplicate options
      const trimmedOptions = q.options.map(opt => opt.trim()).filter(opt => opt);
      if (trimmedOptions.length !== q.options.length) {
        toast.error(`Question ${i + 1}: All options must have text`);
        return false;
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(trimmedOptions);
      if (uniqueOptions.size !== trimmedOptions.length) {
        toast.error(`Question ${i + 1}: All options must be unique`);
        return false;
      }
      
      if (!Array.isArray(q.correct_answers) || q.correct_answers.length < 1) {
        toast.error(`Question ${i + 1}: Select at least one correct answer`);
        return false;
      }
      
      // Clean up correct answers before validation
      const validCorrectAnswers = q.correct_answers.filter(answer => 
        q.options.includes(answer) && answer.trim()
      );
      
      if (validCorrectAnswers.length === 0) {
        // Auto-fix: clean up the state and show error
        setQuestions(prev => prev.map((question, qIdx) => 
          qIdx === i ? { ...question, correct_answers: [] } : question
        ));
        toast.error(`Question ${i + 1}: Please reselect correct answers after modifying options`);
        return false;
      }
      
      // Update state with cleaned correct answers if needed
      if (validCorrectAnswers.length !== q.correct_answers.length) {
        setQuestions(prev => prev.map((question, qIdx) => 
          qIdx === i ? { ...question, correct_answers: validCorrectAnswers } : question
        ));
        toast.error(`Question ${i + 1}: Some selected answers were invalid and have been removed. Please verify your selections.`);
        return false;
      }
      
      if (q.points <= 0) {
        toast.error(`Question ${i + 1}: Points must be greater than 0`);
        return false;
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

      const examId = (res.data as any).exam?._id || (res.data as any).exam?.id || (res.data as any)._id;
      if (!examId) throw new Error('Failed to get exam id');

      if (questions.length > 0) {
        await Promise.all(questions.map((q, idx) => createExamQuestion(examId, {
          question: q.question,
          options: q.options,
          correct_answers: q.correct_answers,
          points: q.points,
          order: idx + 1,
        } as any)));
      }

      toast.success("Exam created successfully!");
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
                <Button type="button" variant="secondary" onClick={addNewQuestion}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>
              <div className="space-y-4">
                {questions.map((q, qi) => (
                  <div key={qi} className="p-4 bg-white dark:bg-slate-900 rounded-lg border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Question {qi + 1}</div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="text-red-600" 
                        onClick={() => removeQuestion(qi)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea 
                        value={q.question} 
                        onChange={(e) => updateQuestion(qi, 'question', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="space-y-1">
                            <Label>Option {oi + 1}</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={opt} 
                                onChange={(e) => updateQuestionOption(qi, oi, e.target.value)} 
                              />
                              {q.options.length > 2 && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => removeQuestionOption(qi, oi)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => addQuestionOption(qi)}
                      >
                        Add Option
                      </Button>
                      
                      <div className="space-y-2">
                        <Label>Correct answers (select one or more)</Label>
                        <div className="grid md:grid-cols-2 gap-2">
                          {q.options.map((option, optionIndex) => {
                            const checked = (q.correct_answers || []).includes(option) && option.trim() !== '';
                            return (
                              <label key={`${qi}-${optionIndex}-${option}`} className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={checked} 
                                  onChange={(e) => updateCorrectAnswers(qi, option, e.target.checked)}
                                />
                                <span className="truncate">{option || `Option ${optionIndex + 1}`}</span>
                              </label>
                            );
                          })}
                        </div>
                        {q.correct_answers && q.correct_answers.length === 0 && (
                          <p className="text-sm text-red-600">⚠️ Please select at least one correct answer</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <Label>Points</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={q.points} 
                          onChange={(e) => updateQuestion(qi, 'points', parseInt(e.target.value || '0', 10))} 
                        />
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