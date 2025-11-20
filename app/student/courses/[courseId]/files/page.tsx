"use client"

import React, { useMemo, useState } from 'react';
import { useResourcesByCourse } from '@/lib/hooks/resources/useResourcesByCourse';
import { 
  Download, 
  Eye, 
  FileText, 
  File, 
  Image, 
  Video, 
  Music,
  Archive,
  Search,
  Filter,
  Calendar,
  User,
  FolderOpen
} from 'lucide-react';

interface FileResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  course: string;
  category: 'lecture' | 'assignment' | 'reading' | 'reference' | 'media';
  url: string; // Mock URL
}

export default function ResourcesPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Load all resources for the course
  const { data: resourcesData = [], isLoading } = useResourcesByCourse(courseId);
  
  // Transform resources to FileResource format
  const resources = useMemo(() => {
    return (resourcesData || []).map((r: any) => ({
      id: String(r._id),
      name: r.title || r.file_url?.split('/')?.pop() || 'Resource',
      type: (r.resource_type || 'other') as FileResource['type'],
      size: r.file_size || 0,
      uploadedBy: 'Instructor',
      uploadedAt: r.created_at || new Date().toISOString(),
      course: '',
      category: 'reference' as const,
      url: r.file_url || '#',
    } as FileResource));
  }, [resourcesData]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'image':
        return <Image className="h-8 w-8 text-green-600" />;
      case 'video':
        return <Video className="h-8 w-8 text-blue-600" />;
      case 'audio':
        return <Music className="h-8 w-8 text-purple-600" />;
      case 'archive':
        return <Archive className="h-8 w-8 text-orange-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-green-100 text-green-800 border-green-200';
      case 'reading': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reference': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (resource: FileResource) => {
    // Mock download functionality
    console.log('Downloading:', resource.name);
    // In a real app, this would trigger the actual download
    alert(`Downloading: ${resource.name}`);
  };

  const handlePreview = (resource: FileResource) => {
    // Mock preview functionality
    console.log('Previewing:', resource.name);
    // In a real app, this would open a preview modal or new tab
    alert(`Opening preview for: ${resource.name}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Course Resources</h1>
        </div>
        <p className="text-gray-600">Access and download course materials, assignments, and references</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 border border-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files, courses, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="lecture">Lectures</option>
              <option value="assignment">Assignments</option>
              <option value="reading">Readings</option>
              <option value="reference">References</option>
              <option value="media">Media</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="doc">Documents</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="archive">Archives</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(resource.type)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {resource.name}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {resource.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(resource.uploadedAt)}
                        </span>
                        <span>{formatFileSize(resource.size)}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(resource.category)}`}>
                          {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{resource.course}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(resource)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleDownload(resource)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg border border-green-200 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

