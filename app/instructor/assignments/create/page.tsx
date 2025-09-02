"use client"

import React, { useState, ChangeEvent, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Award, 
  Upload, 
  Plus, 
  X, 
  Save, 
  Eye,
  Settings,
  Users,
  Shield,
  Clock,
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { fetchInstructorCourses, fetchModulesByCourseId } from '@/lib/api/courses';
import axiosInstance from '@/lib/axios';

interface Instruction {
  step: string;
  content: string;
}

interface AssignmentFormData {
  course_id: string;
  module_id: string;
  title: string;
  description: string;
  dueDate: string;
  availableAfter: string;
  points: number;
  submissionType: 'text' | 'file' | 'url' | 'multiple';
  allowedAttempts: number;
  status: 'draft' | 'published' | 'closed';
  isAnonymous: boolean;
  peerReviewEnabled: boolean;
  plagiarismCheckEnabled: boolean;
  instructions: Instruction[];
  attachments: File[];
  rubric: Record<string, any>;
}

type TabType = 'basic' | 'settings' | 'instructions' | 'review';

const CreateAssignmentForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  
  const [formData, setFormData] = useState<AssignmentFormData>({
    course_id: '',
    module_id: '',
    title: '',
    description: '',
    dueDate: '',
    availableAfter: '',
    points: 100,
    submissionType: 'file',
    allowedAttempts: 1,
    status: 'draft',
    isAnonymous: false,
    peerReviewEnabled: false,
    plagiarismCheckEnabled: false,
    instructions: [{ step: '1', content: '' }],
    attachments: [],
    rubric: {}
  });

  const [newInstruction, setNewInstruction] = useState<Instruction>({ step: '', content: '' });
  
  // Dynamic data for dropdowns
  const [courses, setCourses] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [loadingModules, setLoadingModules] = useState<boolean>(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await fetchInstructorCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const loadModulesForCourse = async (courseId: string) => {
    if (!courseId) {
      setModules([]);
      return;
    }
    try {
      setLoadingModules(true);
      const data = await fetchModulesByCourseId(courseId);
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      setModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const handleInputChange = (field: keyof AssignmentFormData, value: any): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = (): void => {
    if (newInstruction.step && newInstruction.content) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, { ...newInstruction }]
      }));
      setNewInstruction({ step: '', content: '' });
    }
  };

  const removeInstruction = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, field: keyof Instruction, value: string): void => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? { ...inst, [field]: value } : inst
      )
    }));
  };

  const handleSubmit = async (isDraft: boolean = false): Promise<void> => {
    try {
      const submissionData = {
        course_id: formData.course_id,
        module_id: formData.module_id,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        availableAfter: formData.availableAfter ? new Date(formData.availableAfter).toISOString() : undefined,
        points: Number(formData.points),
        submissionType: formData.submissionType,
        allowedAttempts: Number(formData.allowedAttempts),
        status: isDraft ? 'draft' : formData.status,
        isAnonymous: formData.isAnonymous,
        peerReviewEnabled: formData.peerReviewEnabled,
        plagiarismCheckEnabled: formData.plagiarismCheckEnabled,
        instructions: formData.instructions,
        attachments: [],
        rubric: formData.rubric,
      };

      await axiosInstance.post('/api/assignments', submissionData);

      toast({ title: 'Success', description: `Assignment ${isDraft ? 'saved as draft' : 'published'} successfully` });
      if (formData.course_id) {
        router.push(`/instructor/courses/${formData.course_id}`);
      } else {
        router.push('/instructor/assignments');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create assignment';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const renderBasicTab = () => (
    <div className="space-y-8">
      {/* Course and Module Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <div className="relative">
            <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <select
              id="course"
              value={formData.course_id}
              onChange={async (e) => {
                const value = e.target.value;
                handleInputChange('course_id', value);
                handleInputChange('module_id', '');
                await loadModulesForCourse(value);
              }}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select a course</option>
              {loadingCourses && <option value="" disabled>Loading courses...</option>}
              {!loadingCourses && courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
            Module *
          </label>
          <div className="relative">
            <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <select
              id="module"
              value={formData.module_id}
              onChange={(e) => handleInputChange('module_id', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select a module</option>
              {loadingModules && <option value="" disabled>Loading modules...</option>}
              {!loadingModules && modules.map((module) => (
                <option key={module._id} value={module._id}>{module.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Assignment Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter assignment title"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      {/* Assignment Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the assignment objectives and requirements"
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          required
        />
      </div>

      {/* Dates and Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="availableAfter" className="block text-sm font-medium text-gray-700 mb-2">
            Available After *
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="datetime-local"
              id="availableAfter"
              value={formData.availableAfter}
              onChange={(e) => handleInputChange('availableAfter', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date *
          </label>
          <div className="relative">
            <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="datetime-local"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
            Total Points *
          </label>
          <div className="relative">
            <Award className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="number"
              id="points"
              value={formData.points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
              min="1"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Submission Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-500" />
          Submission Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="submissionType" className="block text-sm font-medium text-gray-700 mb-2">
              Submission Type *
            </label>
            <select
              id="submissionType"
              value={formData.submissionType}
              onChange={(e) => handleInputChange('submissionType', e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="text">Text Entry</option>
              <option value="file">File Upload</option>
              <option value="url">URL Submission</option>
              <option value="multiple">Multiple Types</option>
            </select>
          </div>

          <div>
            <label htmlFor="allowedAttempts" className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Attempts *
            </label>
            <div className="relative">
              <Target className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="number"
                id="allowedAttempts"
                value={formData.allowedAttempts}
                onChange={(e) => handleInputChange('allowedAttempts', parseInt(e.target.value))}
                min="1"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Advanced Options
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Anonymous Submission</span>
              <p className="text-sm text-gray-500">Hide student names during grading</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.peerReviewEnabled}
              onChange={(e) => handleInputChange('peerReviewEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Peer Review</span>
              <p className="text-sm text-gray-500">Enable students to review each other{"'"}s work</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.plagiarismCheckEnabled}
              onChange={(e) => handleInputChange('plagiarismCheckEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Plagiarism Check</span>
              <p className="text-sm text-gray-500">Automatically check submissions for plagiarism</p>
            </div>
          </label>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-500" />
          Assignment Files
        </h3>
        
        <div className="space-y-4">
          <div>
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('attachments')?.click()}
              className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, DOC, PPT, Images up to 10MB each</p>
            </button>
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstructionsTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Assignment Instructions
        </h3>
        
        {/* Existing Instructions */}
        <div className="space-y-4 mb-6">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-800">Step {instruction.step}</h4>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={instruction.step}
                  onChange={(e) => updateInstruction(index, 'step', e.target.value)}
                  placeholder="Step number"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  value={instruction.content}
                  onChange={(e) => updateInstruction(index, 'content', e.target.value)}
                  placeholder="Step description"
                  rows={3}
                  className="md:col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Instruction */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Add New Instruction</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newInstruction.step}
              onChange={(e) => setNewInstruction(prev => ({ ...prev, step: e.target.value }))}
              placeholder="Step number"
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              value={newInstruction.content}
              onChange={(e) => setNewInstruction(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Step description"
              rows={3}
              className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <button
              type="button"
              onClick={addInstruction}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 h-fit"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewTab = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-500" />
          Assignment Preview
        </h3>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">Title:</h4>
            <p className="text-gray-600">{formData.title || 'Not specified'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800">Description:</h4>
            <p className="text-gray-600">{formData.description || 'Not specified'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800">Due Date:</h4>
              <p className="text-gray-600">{formData.dueDate || 'Not set'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Points:</h4>
              <p className="text-gray-600">{formData.points}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Submission Type:</h4>
              <p className="text-gray-600 capitalize">{formData.submissionType}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Allowed Attempts:</h4>
              <p className="text-gray-600">{formData.allowedAttempts}</p>
            </div>
          </div>
          
          {formData.instructions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
              <ol className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-600">
                    <span className="font-medium">Step {instruction.step}:</span> {instruction.content}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'instructions', name: 'Instructions', icon: Users },
    { id: 'review', name: 'Review', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Create Assignment</h1>
          <p className="text-lg text-gray-600">Design and configure a new assignment for your course</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-200 mb-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="tab-content min-h-96">
            {activeTab === 'basic' && renderBasicTab()}
            {activeTab === 'settings' && renderSettingsTab()}
            {activeTab === 'instructions' && renderInstructionsTab()}
            {activeTab === 'review' && renderReviewTab()}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-w-32 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 min-w-32 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Publish Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentForm;