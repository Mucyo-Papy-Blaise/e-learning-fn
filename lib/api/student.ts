"use client";

import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/student/dashboard
export async function fetchStudentDashboard() {
  const response = await axios.get(`${API_URL}/api/student/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

// GET /api/student/notifications
export async function fetchStudentNotifications() {
  const response = await axios.get(`${API_URL}/api/student/notifications`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

// GET /api/student/calendar
export async function fetchStudentCalendar() {
  const response = await axios.get(`${API_URL}/api/student/calendar`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

// GET /api/student/courses/:courseId/progress
export async function fetchCourseProgress(courseId: string) {
  const response = await axios.get(`${API_URL}/api/student/courses/${courseId}/progress`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

// GET /api/announcements/courses/:courseId
export async function fetchCourseAnnouncements(courseId: string) {
  const response = await axios.get(`${API_URL}/api/announcements/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

// POST /api/student/lessons/:lessonId/complete (use FormData)
export async function markLessonComplete(lessonId: string, payload?: Record<string, any>) {
  const formData = new FormData();
  formData.append("completed", "true");
  if (payload) {
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
  }
  const response = await axios.post(`${API_URL}/api/student/lessons/${lessonId}/complete`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

