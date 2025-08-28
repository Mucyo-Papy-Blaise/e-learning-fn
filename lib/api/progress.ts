import { UserProgress, CourseProgress } from '../types/progress';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUserProgress(userId: string): Promise<UserProgress[]> {
  const response = await fetch(`${API_URL}/api/student/dashboard`,{
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch user progress');
  return response.json();
}

export async function fetchCourseProgress(courseId: string): Promise<CourseProgress> {
  const response = await fetch(`${API_URL}/api/student/courses/${courseId}/progress`,{
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch course progress');
  return response.json();
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: Partial<UserProgress>
): Promise<UserProgress> {
  const formData = new FormData();
  formData.append('completed', String((data as any).completed ?? data.is_completed ?? true));
  if ((data as any).progress_percentage !== undefined) {
    formData.append('progress_percentage', String((data as any).progress_percentage));
  }
  const response = await fetch(`${API_URL}/api/student/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update lesson progress');
  return response.json();
}