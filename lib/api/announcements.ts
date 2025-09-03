'use client'
import axios from 'axios'

export const API_URL = process.env.NEXT_PUBLIC_API_URL

export type AnnouncementType = 'general' | 'assignment' | 'grade' | 'reminder' | 'urgent'

export interface AnnouncementAuthor {
  _id: string
  name: string
  profile_picture?: string
}

export interface Announcement {
  _id: string
  course_id: string
  title: string
  content: string
  author: AnnouncementAuthor
  type: AnnouncementType
  is_pinned: boolean
  is_published: boolean
  publish_at?: string
  expires_at?: string
  attachments?: string[]
  created_at: string
  updated_at: string
  read_by: string[]
}

export interface CreateAnnouncementInput {
  title: string
  content: string
  type?: AnnouncementType
  isPinned?: boolean
  publishAt?: string
  expiresAt?: string
}

export interface UpdateAnnouncementInput {
  title?: string
  content?: string
  type?: AnnouncementType
  isPinned?: boolean
  isPublished?: boolean
  expiresAt?: string
}

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
}

// GET /api/announcements/courses/:courseId
export async function getCourseAnnouncements(courseId: string): Promise<{ announcements: Announcement[]; userId?: string }> {
  const response = await axios.get(`${API_URL}/api/announcements/courses/${courseId}`, {
    headers: authHeaders(),
  })
  return response.data
}

// POST /api/announcements/courses/:courseId
export async function createAnnouncement(courseId: string, payload: CreateAnnouncementInput): Promise<Announcement> {
  const response = await axios.post(`${API_URL}/api/announcements/courses/${courseId}`, payload, {
    headers: authHeaders(),
  })
  return response.data
}

// PUT /api/announcements/:announcementId
export async function updateAnnouncement(announcementId: string, payload: UpdateAnnouncementInput): Promise<Announcement> {
  const response = await axios.put(`${API_URL}/api/announcements/${announcementId}`, payload, {
    headers: authHeaders(),
  })
  return response.data
}

// DELETE /api/announcements/:announcementId
export async function deleteAnnouncementApi(announcementId: string): Promise<{ message: string }> {
  const response = await axios.delete(`${API_URL}/api/announcements/${announcementId}`, {
    headers: authHeaders(),
  })
  return response.data
}

// POST /api/announcements/:announcementId/read
export async function markAnnouncementRead(announcementId: string): Promise<{ message: string }> {
  const response = await axios.post(`${API_URL}/api/announcements/${announcementId}/read`, undefined, {
    headers: authHeaders(),
  })
  return response.data
}

