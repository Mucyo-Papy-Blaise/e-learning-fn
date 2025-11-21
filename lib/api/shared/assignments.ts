import { API_URL, getAuthHeaders, getAuthHeadersFormData } from '../config';
import axiosInstance from '../../axios';
import type { Assignment, AssignmentSubmission } from '@/types/shared/assignment.types';

export type { Assignment, AssignmentSubmission };

// GET /api/assignments/:id
export async function getAssignmentById(id: string): Promise<Assignment> {
  const response = await fetch(`${API_URL}/api/assignments/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch assignment');
  return response.json();
}

// GET /api/assignments/course/:courseId
export async function getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
  const response = await axiosInstance.get(`/api/assignments/course/${courseId}`);
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.assignments)) return data.assignments;
  return [];
}

// POST /api/assignments
export async function createAssignment(payload: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_URL}/api/assignments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create assignment');
  return response.json();
}

// PUT /api/assignments/:id
export async function updateAssignment(id: string, payload: Partial<Assignment>): Promise<Assignment> {
  const response = await fetch(`${API_URL}/api/assignments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to update assignment');
  return response.json();
}

// GET /api/assignments/:id/submissions
export async function getAssignmentSubmissions(id: string): Promise<AssignmentSubmission[]> {
  const response = await axiosInstance.get(`/api/assignments/${id}/submissions`);
  const data = response.data;
  if (Array.isArray(data?.submissions)) return data.submissions;
  if (Array.isArray(data)) return data;
  return [];
}

// GET /api/assignments/:id/submissions/me
export async function getMyAssignmentSubmission(id: string): Promise<AssignmentSubmission | null> {
  const response = await fetch(`${API_URL}/api/assignments/${id}/submissions/me`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    // If 404, no submission exists yet
    if (response.status === 404) return null;
    throw new Error('Failed to fetch submission');
  }
  const data = await response.json();
  if (Array.isArray(data)) return data[0] || null;
  if (Array.isArray(data?.submissions)) return data.submissions[0] || null;
  return data || null;
}

// POST /api/assignments/:assignmentId/submit
export async function submitAssignment(assignmentId: string, formData: FormData): Promise<AssignmentSubmission> {
  const response = await fetch(`${API_URL}/api/assignments/${assignmentId}/submit`, {
    method: 'POST',
    headers: getAuthHeadersFormData(),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to submit assignment');
  return response.json();
}

