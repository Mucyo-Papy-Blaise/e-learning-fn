"use client"

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Pin, 
  PinOff, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock, 
  Users,
  AlertTriangle,
  BookOpen,
  Award,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { fetchInstructorCourses } from '@/lib/api/courses';
import { getCourseAnnouncements, updateAnnouncement, deleteAnnouncementApi, Announcement as ApiAnnouncement } from '@/lib/api/announcements';

type Announcement = ApiAnnouncement

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    let isMounted = true
    async function loadAnnouncements() {
      try {
        setLoading(true)
        const courses = await fetchInstructorCourses()
        const courseIds = Array.isArray(courses) ? courses.map((c: any) => c._id || c.id) : []
        const results = await Promise.all(
          courseIds.map(async (courseId) => {
            try {
              const data = await getCourseAnnouncements(courseId)
              return (data?.announcements || []).map((a: any) => ({ ...a, course_id: a.course_id || courseId }))
            } catch {
              return []
            }
          })
        )
        const merged: Announcement[] = results.flat()
        if (isMounted) setAnnouncements(merged)
      } catch (e) {
        if (isMounted) setAnnouncements([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadAnnouncements()
    return () => { isMounted = false }
  }, [])

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment': return 'bg-green-100 text-green-800 border-green-200';
      case 'grade': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const togglePin = async (id: string) => {
    const previous = announcements
    const next = announcements.map(ann => ann._id === id ? { ...ann, is_pinned: !ann.is_pinned } : ann)
    setAnnouncements(next)
    try {
      const current = next.find(a => a._id === id)
      await updateAnnouncement(id, { isPinned: current?.is_pinned })
    } catch (e) {
      setAnnouncements(previous)
    }
  }

  const togglePublish = async (id: string) => {
    const previous = announcements
    const next = announcements.map(ann => ann._id === id ? { ...ann, is_published: !ann.is_published } : ann)
    setAnnouncements(next)
    try {
      const current = next.find(a => a._id === id)
      await updateAnnouncement(id, { isPublished: current?.is_published })
    } catch (e) {
      setAnnouncements(previous)
    }
  }

  const deleteAnnouncement = async (id: string) => {
    const ok = confirm('Are you sure you want to delete this announcement?')
    if (!ok) return
    const previous = announcements
    setAnnouncements(prev => prev.filter(ann => ann._id !== id))
    try {
      await deleteAnnouncementApi(id)
    } catch (e) {
      setAnnouncements(previous)
    }
  }

  const filteredAnnouncements = announcements
    .filter(ann => {
      if (filter === 'published') return ann.is_published;
      if (filter === 'draft') return !ann.is_published;
      if (filter === 'expired') return ann.expires_at && new Date(ann.expires_at) < new Date();
      return true;
    })
    .filter(ann => typeFilter === 'all' || ann.type === typeFilter)
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-lg mb-2" />
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded-md" />
          </div>
          <div className="w-32 h-10 bg-blue-200 animate-pulse rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded-md" />
              <div className="w-full h-4 bg-gray-200 animate-pulse rounded-md" />
              <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Manage your course announcements</p>
        </div>
        <Link href="/instructor/announcements/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({announcements.length})
            </Button>
            <Button
              variant={filter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('published')}
            >
              Published ({announcements.filter(a => a.is_published).length})
            </Button>
            <Button
              variant={filter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('draft')}
            >
              Draft ({announcements.filter(a => !a.is_published).length})
            </Button>
          </div>
          <div className="border-l pl-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="assignment">Assignment</option>
              <option value="grade">Grade</option>
              <option value="reminder">Reminder</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first announcement.</p>
            <Link href="/instructor/announcements/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </Link>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement._id} className={`p-6 ${announcement.is_pinned ? 'ring-2 ring-blue-200 bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    {announcement.is_pinned && (
                      <Pin className="h-4 w-4 text-blue-600" />
                    )}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.type)}`}>
                      {getTypeIcon(announcement.type)}
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </span>
                    {!announcement.is_published && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <EyeOff className="h-3 w-3" />
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Title and Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {announcement.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {announcement.read_by.length} read
                    </div>
                    {announcement.expires_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Expires {new Date(announcement.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePin(announcement._id)}
                    className={announcement.is_pinned ? 'text-blue-600' : ''}
                  >
                    {announcement.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish(announcement._id)}
                    className={announcement.is_published ? 'text-green-600' : 'text-gray-400'}
                  >
                    {announcement.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Link href={`/instructor/announcements/edit/${announcement._id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAnnouncement(announcement._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsList;