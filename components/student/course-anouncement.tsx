import React, { useState, useMemo } from "react";
import { useCourseAnnouncements } from "@/lib/hooks/announcements/useCourseAnnouncements";

// Define types
type AnnouncementType = 'general' | 'assignment' | 'grade' | 'reminder' | 'urgent';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  date: string;
  author: string;
  isRead: boolean;
  isPinned: boolean;
  hasAttachment: boolean;
};

// Mock announcements data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Communicating for Impact - Spring 2025",
    content: "Welcome to our course! Please review the syllabus and complete your profile setup by Friday. We're excited to have you in this semester.",
    type: "general",
    date: "2025-07-20",
    author: "Prof. Sarah Johnson",
    isRead: false,
    isPinned: true,
    hasAttachment: true
  },
  {
    id: "2",
    title: "Assignment 1: Academic Writing Essay Due Date Extended",
    content: "Due to technical issues with the submission portal, the deadline for Assignment 1 has been extended to July 28th, 11:59 PM. Please ensure you submit your work before the new deadline.",
    type: "assignment",
    date: "2025-07-22",
    author: "Prof. Sarah Johnson",
    isRead: false,
    isPinned: false,
    hasAttachment: false
  },
  {
    id: "3",
    title: "Quiz 1 Grades Released",
    content: "Grades for Quiz 1 are now available in your gradebook. Overall class performance was excellent with an average score of 87%. Individual feedback has been provided.",
    type: "grade",
    date: "2025-07-21",
    author: "Teaching Assistant",
    isRead: true,
    isPinned: false,
    hasAttachment: false
  },
  {
    id: "4",
    title: "Reminder: Office Hours This Week",
    content: "Don't forget about office hours on Wednesday 2-4 PM and Friday 10-12 PM. I'm available to help with any questions about the upcoming argumentative essay assignment.",
    type: "reminder",
    date: "2025-07-19",
    author: "Prof. Sarah Johnson",
    isRead: true,
    isPinned: false,
    hasAttachment: false
  },
  {
    id: "5",
    title: "URGENT: Class Cancelled Thursday Due to Weather",
    content: "Due to severe weather conditions, Thursday's class is cancelled. Please review Chapter 3 materials online and we'll discuss them in our next session.",
    type: "urgent",
    date: "2025-07-18",
    author: "Prof. Sarah Johnson",
    isRead: false,
    isPinned: true,
    hasAttachment: false
  }
];

const getTypeColor = (type: AnnouncementType) => {
  switch (type) {
    case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
    case 'assignment': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'grade': return 'text-green-600 bg-green-50 border-green-200';
    case 'reminder': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getTypeLabel = (type: AnnouncementType) => {
  switch (type) {
    case 'urgent': return 'Urgent';
    case 'assignment': return 'Assignment';
    case 'grade': return 'Grade';
    case 'reminder': return 'Reminder';
    default: return 'General';
  }
};

export default function CourseAnnouncements({ courseId }: { courseId?: string }) {
  const { data: announcementsData = [] } = useCourseAnnouncements(courseId);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Transform API data to component format
  const announcements = useMemo(() => {
    return (Array.isArray(announcementsData) ? announcementsData : []).map((a: any) => ({
      id: a._id || a.id,
      title: a.title,
      content: a.content,
      type: (a.type || 'general') as AnnouncementType,
      date: a.created_at || a.date || new Date().toISOString(),
      author: a.author?.name || 'Instructor',
      isRead: readIds.has(a._id || a.id),
      isPinned: !!a.is_pinned,
      hasAttachment: Array.isArray(a.attachments) && a.attachments.length > 0,
    }));
  }, [announcementsData, readIds]);

  const markAsRead = (id: string) => {
    setReadIds(prev => new Set(prev).add(id));
  };

  const filteredAnnouncements = announcements.filter(ann => {
    if (filter === 'unread') return !ann.isRead;
    if (filter === 'pinned') return ann.isPinned;
    return true;
  });

  const unreadCount = announcements.filter(ann => !ann.isRead).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 mb-1">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-medium text-gray-900">Announcements</h1>
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                )}
                <button 
                  onClick={() => setReadIds(new Set(announcements.map(a => a.id)))}
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="px-6 py-2 bg-white border-b border-gray-200">
            <div className="flex space-x-6">
              {[
                { key: 'all', label: 'All Announcements' },
                { key: 'unread', label: 'Unread' },
                { key: 'pinned', label: 'Pinned' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`text-sm py-2 border-b-2 transition-colors ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Announcements List */}
          <div className="lg:col-span-2 space-y-0">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white border-l border-r border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !announcement.isRead ? 'bg-blue-50' : ''
                } ${selectedAnnouncement?.id === announcement.id ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  markAsRead(announcement.id);
                }}
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {announcement.isPinned && (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                          <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                        </svg>
                      )}
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${getTypeColor(announcement.type)}`}>
                        {getTypeLabel(announcement.type)}
                      </span>
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h3 className={`text-sm font-medium mb-1 ${!announcement.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                    {announcement.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {announcement.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">By {announcement.author}</span>
                    <div className="flex items-center space-x-2">
                      {announcement.hasAttachment && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      )}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Announcement Detail */}
          <div className="lg:col-span-1">
            {selectedAnnouncement ? (
              <div className="bg-white border border-gray-200 sticky top-6">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded border font-medium ${getTypeColor(selectedAnnouncement.type)}`}>
                      {getTypeLabel(selectedAnnouncement.type)}
                    </span>
                    <button 
                      onClick={() => setSelectedAnnouncement(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">{selectedAnnouncement.title}</h2>
                </div>
                
                <div className="px-6 py-4">
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">From: {selectedAnnouncement.author}</span>
                      {selectedAnnouncement.isPinned && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Pinned</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Posted: {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {selectedAnnouncement.content}
                  </div>
                  
                  {selectedAnnouncement.hasAttachment && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span>Course_Syllabus_2025.pdf</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 px-6 py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Select an announcement to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}