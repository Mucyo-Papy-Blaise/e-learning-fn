"use client";

import axios from "axios";
import axiosInstance from "../axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;


export type StudentProfile = {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
  profile_image?: string;
  joinedDate?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AccountOverview = {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    memberSince?: string;
    accountAge: string;
  };
  accountStatus: {
    isActive: boolean;
    isVerified: boolean;
    paymentStatus: 'paid' | 'pending' | 'unpaid';
    lastUpdated: string;
  };
  profileCompletion: {
    percentage: number;
    missingFields: string[];
  };
};

export type StudentAlert = {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string | null;
};

// Get comprehensive student profile
export async function getMyStudentProfile(): Promise<{ message: string; student: StudentProfile }> {
  const res = await axiosInstance.get(`${API_URL}/api/student/profile`);
  return res.data;
}

// Update student profile (bio, gender, dateOfBirth, profile_image)
export async function updateMyStudentProfile(form: FormData): Promise<{ message: string; student: StudentProfile }> {
  const res = await axiosInstance.put(`${API_URL}/api/student/profile`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updatePassword(payload: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
  const res = await axiosInstance.put(`${API_URL}/api/student/password`, payload);
  return res.data;
}

// Get account overview/dashboard data
export async function getAccountOverview(): Promise<{ message: string; overview: AccountOverview }> {
  const res = await axiosInstance.get(`${API_URL}/api/student/account/overview`);
  return res.data;
}

// Get student alerts/notifications
export async function getStudentAlerts(): Promise<{ message: string; alerts: StudentAlert[]; count: number }> {
  const res = await axiosInstance.get(`${API_URL}/api/student/alerts`);
  return res.data;
}


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
  const data = response.data;
  // Normalize to an array for consumers expecting a list
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.assignments)) return data.assignments;
  return [];
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
  const data = response.data;
  // Backend returns { announcements, userId }
  if (Array.isArray(data?.announcements)) return data.announcements;
  if (Array.isArray(data)) return data;
  return [];
}

// Student area helpers for learning journey
export async function fetchStudentEnrolledCourses() {
  const response = await axios.get(`${API_URL}/api/enrollement`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function fetchStudentGrades(courseId: string) {
  const response = await axios.get(`${API_URL}/api/student/grades/${courseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function fetchStudentSubmissions(courseId?: string) {
  const url = courseId ? `${API_URL}/api/assignments/${courseId}/submissions/me` : `${API_URL}/api/assignments/submissions/me`;
  const response = await axios.get(url, {
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


