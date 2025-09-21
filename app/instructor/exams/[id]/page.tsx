'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axios";
import { getExamById, getExamQuestions, updateExam, createExamQuestion, updateExamQuestion, deleteExamQuestion } from "@/app/lib/api";

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

type ExamMCQ = {
  _id?: string;
  question: string;
  options: string[];
  correct_answers: string[];
  points: number;
  order?: number;
  isNew?: boolean;
  isModified?: boolean;
};

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<ExamMCQ[]>([]);
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
    if (examId) {
      fetchExamData();
      fetchCourses();
    }
  }, [examId]);

  const fetchExamData = async () => {
    try {
      setInitialLoading(true);
      const [examRes, questionsRes] = await Promise.all([
        getExamById(examId),
        getExamQuestions(examId, true)
      ]);

      if (examRes.ok) {
        const exam = examRes.data as any; // Type assertion to handle missing properties
        setFormData({
          title: exam.title || '',
          course: (typeof exam.course === 'object' ? exam.course._id : exam.course) || '',
          description: exam.description || '',
          instructions: exam.instructions || '',
          startDate: exam.startDate ? new Date(exam.startDate).toISOString().slice(0, 16) : '',
          endDate: exam.endDate ? new Date(exam.endDate).toISOString().slice(0, 16) : '',
          duration: exam.duration || 120,
          passingScore: exam.passingScore || 70,
          totalPoints: exam.totalPoints || 100,
          status: exam.status || 'draft'
        });
      } else {
        toast.error('Failed to load exam details');
        router.push('/instructor/exams');
        return;
      }

      if (questionsRes.ok) {
        const mcqQuestions = questionsRes.data
          .filter((q: any) => q.type === 'multiple_choice')
          .map((q: any) => ({
            _id: q._id,
            question: q.question || '',
            options: q.options || ['Option 1', 'Option 2'],
            correct_answers: q.correct_answers || [],
            points: q.points || 1,
            order: q.order || 0,
            isNew: false,
            isModified: false
          }));
        setQuestions(mcqQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch exam data:', error);
      toast.error('Failed to load exam data');
      router.push('/instructor/exams');
    } finally {
      setInitialLoading(false);
    }
  };

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

  // MCQ handlers (same as create page but with modification tracking)
  const addNewQuestion = () => {
    const newQuestion: ExamMCQ = {
      question: 'New question',
      options: ['Option 1', 'Option 2'],
      correct_answers: ['Option 1'],
      points: 1,
      order: questions.length + 1,
      isNew: true,
      isModified: false
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = async (questionIndex: number) => {
    const question = questions[questionIndex];
    
    if (question._id && !question.isNew) {
      // Delete from backend if it's an existing question
      try {
        const res = await deleteExamQuestion(question._id);
        if (!res.ok) {
          toast.error('Failed to delete question');
          return;
        }
        toast.success('Question deleted');
      } catch (error) {
        toast.error('Failed to delete question');
        return;
      }
    }
    
    setQuestions(prev => prev.filter((_, i) => i !== questionIndex));
  };

  const updateQuestion = (questionIndex: number, field: keyof ExamMCQ, value: any) => {
    setQuestions(prev => prev.map((question, i) => 
      i === questionIndex 
        ? { ...question, [field]: value, isModified: !question.isNew }
        : question
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
      ).filter(answer => newOptions.includes(answer));
      
      return {
        ...question,
        options: newOptions,
        correct_answers: newCorrectAnswers,
        isModified: !question.isNew
      };
    }));
  };

  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      const optionToRemove = question.options[optionIndex];
      const newOptions = question.options.filter((_, oIdx) => oIdx !== optionIndex);
      
      const newCorrectAnswers = (question.correct_answers || [])
        .filter(answer => answer !== optionToRemove)
        .filter(answer => newOptions.includes(answer));
      
      return {
        ...question,
        options: newOptions,
        correct_answers: newCorrectAnswers,
        isModified: !question.isNew
      };
    }));
  };

  const addQuestionOption = (questionIndex: number) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      return {
        ...question,
        options: [...question.options, `Option ${question.options.length + 1}`],
        isModified: !question.isNew
      };
    }));
  };

  const updateCorrectAnswers = (questionIndex: number, option: string, isChecked: boolean) => {
    setQuestions(prev => prev.map((question, qIdx) => {
      if (qIdx !== questionIndex) return question;
      
      const currentCorrectAnswers = question.correct_answers || [];
      let newCorrectAnswers;
      
      if (isChecked) {
        if (question.options.includes(option) && !currentCorrectAnswers.includes(option)) {
          newCorrectAnswers = [...currentCorrectAnswers, option];
        } else {
          newCorrectAnswers = currentCorrectAnswers;
        }
      } else {
        newCorrectAnswers = currentCorrectAnswers.filter(answer => answer !== option);
      }
      
      newCorrectAnswers = newCorrectAnswers.filter(answer => question.options.includes(answer));
      
      return {
        ...question,
        correct_answers: newCorrectAnswers,
        isModified: !question.isNew
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

    // Validate MCQ questions
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
      
      const trimmedOptions = q.options.map(opt => opt.trim()).filter(opt => opt);
      if (trimmedOptions.length !== q.options.length) {
        toast.error(`Question ${i + 1}: All options must have text`);
        return false;
      }
      
      const uniqueOptions = new Set(trimmedOptions);
      if (uniqueOptions.size !== trimmedOptions.length) {
        toast.error(`Question ${i + 1}: All options must be unique`);
        return false;
      }
      
      if (!Array.isArray(q.correct_answers) || q.correct_answers.length < 1) {
        toast.error(`Question ${i + 1}: Select at least one correct answer`);
        return false;
      }
      
      const validCorrectAnswers = q.correct_answers.filter(answer => 
        q.options.includes(answer) && answer.trim()
      );
      
      if (validCorrectAnswers.length === 0) {
        toast.error(`Question ${i + 1}: Please reselect correct answers after modifying options`);
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

      // Update exam details
      const examPayload = {
        title: formData.title,
        course: formData.course,
        description: formData.description,
        instructions: formData.instructions,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        duration: formData.duration,
        passingScore: formData.passingScore,
        totalPoints: formData.totalPoints,
        status: formData.status,
      };

      console.log('Sending exam payload:', examPayload); // Debug log

      const examRes = await updateExam(examId, examPayload as any);
      console.log('Update exam response:', examRes); // Debug log
      
      if (!examRes.ok) throw new Error(examRes.message);

      // Update local state to reflect changes if successful
      if (examRes.data && examRes.data.exam) {
        const updatedExam = examRes.data.exam as any; // Type assertion to bypass strict typing
        setFormData(prev => ({
          ...prev,
          title: updatedExam.title || prev.title,
          course: (typeof updatedExam.course === 'object' ? updatedExam.course._id : updatedExam.course) || prev.course,
          description: updatedExam.description || prev.description,
          instructions: updatedExam.instructions || prev.instructions,
          startDate: updatedExam.startDate ? new Date(updatedExam.startDate).toISOString().slice(0, 16) : prev.startDate,
          endDate: updatedExam.endDate ? new Date(updatedExam.endDate).toISOString().slice(0, 16) : prev.endDate,
          duration: updatedExam.duration || prev.duration,
          passingScore: updatedExam.passingScore || prev.passingScore,
          totalPoints: updatedExam.totalPoints || prev.totalPoints,
          status: updatedExam.status || prev.status,
        }));
      }

      // Handle questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionPayload = {
          question: q.question,
          options: q.options,
          correct_answers: q.correct_answers,
          points: q.points,
          order: i + 1,
        };

        if (q.isNew) {
          // Create new question
          const res = await createExamQuestion(examId, questionPayload as any);
          if (!res.ok) throw new Error(`Failed to create question ${i + 1}`);
        } else if (q.isModified && q._id) {
          // Update existing question
          const res = await updateExamQuestion(q._id, questionPayload as any);
          if (!res.ok) throw new Error(`Failed to update question ${i + 1}`);
        }
      }

      toast.success("Exam updated successfully!");
      router.push('/instructor/exams');
    } catch (error: any) {
      console.error('Error updating exam:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading exam details...</p>
        </div>
      </div>
    );
  }

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
                Edit Exam
              </h1>
              <p className="text-muted-foreground">
                Modify exam details and questions
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
                      <div className="flex items-center gap-2">
                        <div className="font-medium">Question {qi + 1}</div>
                        {q.isNew && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">New</span>}
                        {q.isModified && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Modified</span>}
                      </div>
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Exam
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}