import { API_URL, getAuthHeaders, getAuthHeadersFormData } from '../config';

export async function getStudentEnrolledCourses() {
  const response = await fetch(`${API_URL}/api/enrollement`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch enrolled courses');
  return response.json();
}

export async function getCourseProgress(courseId: string) {
  const response = await fetch(`${API_URL}/api/student/courses/${courseId}/progress`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch course progress');
  return response.json();
}

export async function getStudentGrades(courseId: string) {
  const response = await fetch(`${API_URL}/api/student/courses/${courseId}/grades`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch student grades');
  const data = await response.json();
  if (data?.success && Array.isArray(data.grades)) {
    return data.grades;
  }
  return [];
}

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
  const response = await fetch(`${API_URL}/api/student/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: getAuthHeadersFormData(),
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to mark lesson complete');
  return response.json();
}

