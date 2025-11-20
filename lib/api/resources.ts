import { API_URL, getAuthHeaders } from './config';

export async function fetchResourcesByLessonId(lessonId: string) {
  const response = await fetch(`${API_URL}/api/resources/${lessonId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}

export async function uploadResource(
  lessonId: string,
  title: string,
  resource_type: 'pdf' | 'doc' | 'video' | 'audio' | 'other',
  file: File
) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('resource_type', resource_type);
  formData.append('file', file);
  formData.append('lesson_id', lessonId);

  const response = await axios.post(`${API_URL}/api/resources`, formData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
}

