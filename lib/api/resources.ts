import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchResourcesByLessonId(lessonId: string) {
  const response = await axios.get(`${API_URL}/api/resources/${lessonId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
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

