import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Pin, 
  PinOff, 
  Calendar, 
  Clock, 
  Paperclip, 
  X,
  ArrowLeft,
  MessageSquare,
  BookOpen,
  Award,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Course {
  _id: string;
  title: string;
}

interface AnnouncementFormData {
  course_id: string;
  title: string;
  content: string;
  type: 'general' | 'assignment' | 'grade' | 'reminder' | 'urgent';
  is_pinned: boolean;
  is_published: boolean;
  publish_at?: string;
  expires_at?: string;
  attachments: File[];
}

const AnnouncementForm = () => {
  const router = useRouter();
  const { id } = router.query; // For edit mode
  const isEdit = !!id;

  const [formData, setFormData] = useState<AnnouncementFormData>({
    course_id: '',
    title: '',
    content: '',
    type: 'general',
    is_pinned: false,
    is_published: true,
    attachments: []
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock courses data - replace with actual API call
  useEffect(() => {
    const mockCourses: Course[] = [
      { _id: 'course1', title: 'Advanced React Development' },
      { _id: 'course2', title: 'Node.js Backend Architecture' },
      { _id: 'course3', title: 'Database Design Principles' }
    ];
    setCourses(mockCourses);

    // If editing, load announcement data
    if (isEdit && id) {
      // Mock existing announcement data
      const mockAnnouncement = {
        course_id: 'course1',
        title: 'Welcome to Advanced React Development',
        content: 'Welcome students! This course will cover advanced React concepts including hooks, context, and performance optimization.',
        type: 'general' as const,
        is_pinned: true,
        is_published: true,
        publish_at: '2024-01-15T10:00:00',
        expires_at: '2024-02-15T23:59:59'
      };
      setFormData(prev => ({
        ...prev,
        ...mockAnnouncement,
        attachments: []
      }));
    }
  }, [isEdit, id]);

  const handleInputChange = (field: keyof AnnouncementFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_id) {
      newErrors.course_id = 'Please select a course';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.publish_at && formData.expires_at) {
      if (new Date(formData.publish_at) >= new Date(formData.expires_at)) {
        newErrors.expires_at = 'Expiry date must be after publish date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Mock API call - replace with actual implementation
      console.log('Submitting announcement:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to announcements list
      router.push('/instructor/announcements');
      
    } catch (error) {
      console.error('Error saving announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return <MessageSquare className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      case 'grade': return <Award className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/instructor/announcements">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Announcement' : 'Create New Announcement'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update your announcement details' : 'Share important information with your students'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => handleInputChange('course_id', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.course_id ? 'border-red-500' : ''}`}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.course_id && (
                <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>
              )}
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="assignment">Assignment</option>
                <option value="grade">Grade</option>
                <option value="reminder">Reminder</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter announcement title"
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter announcement content"
              rows={8}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {formData.is_published ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Published</p>
                  <p className="text-sm text-gray-600">Make visible to students</p>
                </div>
              </div>
              <Button
                type="button"
                variant={formData.is_published ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('is_published', !formData.is_published)}
              >
                {formData.is_published ? 'Published' : 'Draft'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {formData.is_pinned ? (
                  <Pin className="h-5 w-5 text-blue-600" />
                ) : (
                  <PinOff className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Pinned</p>
                  <p className="text-sm text-gray-600">Show at the top</p>
                </div>
              </div>
              <Button
                type="button"
                variant={formData.is_pinned ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('is_pinned', !formData.is_pinned)}
              >
                {formData.is_pinned ? 'Pinned' : 'Unpin'}
              </Button>
            </div>
          </div>

          {/* Date Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Publish Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.publish_at || ''}
                onChange={(e) => handleInputChange('publish_at', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to publish immediately</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Expiry Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.expires_at || ''}
                onChange={(e) => handleInputChange('expires_at', e.target.value || undefined)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.expires_at ? 'border-red-500' : ''}`}
              />
              {errors.expires_at && (
                <p className="text-red-500 text-xs mt-1">{errors.expires_at}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <label htmlFor="file-upload">
              <Button type="button" variant="outline" className="cursor-pointer">
                Choose Files
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 10MB each)
            </p>
          </div>

          {/* Uploaded Files */}
          {formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Uploaded Files:</h3>
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Preview Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {formData.is_pinned && (
                <Pin className="h-4 w-4 text-blue-600" />
              )}
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
                formData.type === 'general' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                formData.type === 'assignment' ? 'bg-green-100 text-green-800 border-green-200' :
                formData.type === 'grade' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                formData.type === 'reminder' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                formData.type === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {getTypeIcon(formData.type)}
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </span>
              {!formData.is_published && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  <EyeOff className="h-3 w-3" />
                  Draft
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {formData.title || 'Announcement Title'}
            </h3>
            
            <div className="text-gray-600 whitespace-pre-wrap mb-4">
              {formData.content || 'Your announcement content will appear here...'}
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.attachments.length} attachment{formData.attachments.length !== 1 ? 's' : ''}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.attachments.map((file, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs text-gray-600 border"
                    >
                      <Paperclip className="h-3 w-3" />
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Link href="/instructor/announcements">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          
          <div className="flex gap-3">
            {formData.is_published && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleInputChange('is_published', false)}
                className="flex items-center gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Save as Draft
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : (isEdit ? 'Update Announcement' : 'Create Announcement')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;