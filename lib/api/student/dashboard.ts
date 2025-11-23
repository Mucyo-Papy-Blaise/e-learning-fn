import { API_URL, getAuthHeaders } from '../config';
import { AccountOverview, StudentAlert } from '@/types/student/student.types';

export async function getStudentDashboard() {
  const response = await fetch(`${API_URL}/api/student/dashboard`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch student dashboard');
  return response.json();
}

export async function getStudentNotifications() {
  const response = await fetch(`${API_URL}/api/student/notifications`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch student notifications');
  return response.json();
}

export async function getStudentCalendar() {
  const response = await fetch(`${API_URL}/api/student/calendar`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch student calendar');
  const data = await response.json();
  // Normalize to an array for consumers expecting a list
  if (Array.isArray(data)) return data;
  const assignments = Array.isArray(data?.assignments) ? data.assignments : [];
  const announcements = Array.isArray(data?.announcements) ? data.announcements : [];
  if (assignments.length || announcements.length) return [...assignments, ...announcements];
  return [];
}

export async function getCourseAnnouncements(courseId: string) {
  const response = await fetch(`${API_URL}/api/announcements/courses/${courseId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch course announcements');
  const data = await response.json();
  // Backend returns { announcements, userId }
  if (Array.isArray(data?.announcements)) return data.announcements;
  if (Array.isArray(data)) return data;
  return [];
}

export async function getAccountOverview(): Promise<{ message: string; overview: AccountOverview }> {
  const response = await fetch(`${API_URL}/api/student/account/overview`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch account overview');
  return response.json();
}

export async function getStudentAlerts(): Promise<{ message: string; alerts: StudentAlert[]; count: number }> {
  const response = await fetch(`${API_URL}/api/student/alerts`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch student alerts');
  return response.json();
}

