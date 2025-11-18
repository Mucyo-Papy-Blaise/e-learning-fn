'use client'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Course, Module, Lesson, Resource } from '../types/course';

export const API_URL = process.env.NEXT_PUBLIC_API_URL 
var token

// Show toast notifications for success or error
const showToast = (message: string, type: "success" | "error") => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export async function fetchCourses(id: string): Promise<Course[]> {
  try {
    let url: string
    if (id === "all") {
      // Get all available courses (public endpoint)
      url = `${API_URL}/api/courses/student/all`
    } else {
      // Get courses by institution ID
      url = `${API_URL}/api/institutions/${id}/courses`
    }
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = response.data as any
    if (Array.isArray(data)) return data as Course[]
    if (Array.isArray(data?.data)) return data.data as Course[]
    if (Array.isArray(data?.results)) return data.results as Course[]
    if (Array.isArray(data?.courses)) return data.courses as Course[]
    // Some backends wrap in { success, data }
    if (data?.success && Array.isArray(data?.data)) return data.data as Course[]
    return []
  } catch (error) {
    showToast('Failed to fetch courses', 'error');
    throw error;
  }
}

export async function fetchInstructorCourses(): Promise<any[]> {
  try {
    // Preferred per latest backend: returns only instructor-owned courses for instructor role
    const primary = await axios.get(`${API_URL}/api/courses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const pdata = primary.data;
    if (Array.isArray(pdata)) return pdata as Course[];
    if (Array.isArray(pdata?.courses)) return pdata.courses as Course[];
    if (Array.isArray(pdata?.data)) return pdata.data as Course[];
    if (Array.isArray(pdata?.results)) return pdata.results as Course[];
    // If shape unexpected, fall through to legacy path
  } catch (primaryErr) {
    try {
      // Legacy/older backend path
      const fallback = await axios.get(`${API_URL}/api/instructor/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const fdata = fallback.data;
      if (Array.isArray(fdata)) return fdata as Course[];
      if (Array.isArray(fdata?.courses)) return fdata.courses as Course[];
      if (Array.isArray(fdata?.data)) return fdata.data as Course[];
      if (Array.isArray(fdata?.results)) return fdata.results as Course[];
      return [];
    } catch (fallbackErr) {
      showToast('Failed to fetch instructor courses', 'error');
      throw primaryErr;
    }
  }
  return [];
}

export async function fetchCourseById(courseId: string): Promise<Course> {
  try {
    const response = await axios.get(`${API_URL}/api/courses/${courseId}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch course','error');
    throw error;

     
  }
}

export async function fetchModulesByCourseId(courseId: string): Promise<Module[]> {
  try {
    const response = await axios.get(`${API_URL}/api/courses/${courseId}/modules`);
    return response.data;
  } catch (error) {
    showToast('Failed to fetch modules', 'error');
    throw error;

  }
}

export async function fetchLessonsByModuleId(moduleId: string): Promise<Lesson[]> {
  try {
    const response = await axios.get(`${API_URL}/api/courses/modules/${moduleId}/lessons`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch lessons', 'error');
    throw error;

  }
}

export async function fetchResourcesByLessonId(lessonId: string): Promise<Resource[]> {
  try {
    const response = await axios.get(`${API_URL}/api/resources/${lessonId}`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    showToast('Failed to fetch resources', 'error');
    throw error;

  }
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: string;
  category: string;
  difficulty_level: string;
  status: string;
  prerequisites: string;
  start_date?: string;
  end_date?: string;
  is_certified: boolean;
  duration_weeks: string;
  thumbnail?: File | null;
}) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", String(Number(data.price) || 0));
  formData.append("category", data.category);
  formData.append("difficulty_level", data.difficulty_level);
  formData.append("status", data.status);

  if (data.prerequisites.trim()) {
    formData.append(
      "prerequisites",
      JSON.stringify(
        data.prerequisites
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );
  }

  if (data.start_date) formData.append("start_date", data.start_date);
  if (data.end_date) formData.append("end_date", data.end_date);

  formData.append("is_certified", String(Boolean(data.is_certified)));
  formData.append("duration_weeks", String(Number(data.duration_weeks) || 0));

  if (data.thumbnail instanceof File) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await axios.post(`${API_URL}/api/courses`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data;
}

export async function createModule(course_id: string, title: string, description: string, duration_hours: number) {
  try {
    const response = await axios.post(`${API_URL}/api/courses/module`, {
      course_id,
      title,
      description,
      duration_hours,
    },{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Module created successfully', 'success');
    return response.data.module;
  } catch (error) {
    showToast('Failed to create module', 'error');
    throw error;
  }
}

export async function createLesson(module_id: string, title: string, content: string, content_type: string, duration_minutes: number, video: File | null) {
  try {
    const formData = new FormData();
    formData.append("module_id", module_id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("content_type", content_type);
    formData.append("duration_minutes", duration_minutes.toString());

    if (video) {
      formData.append("video", video);
    }

    const response = await axios.post(`${API_URL}/api/courses/lesson`, formData,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Lesson created successfully', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to create lesson', 'error');
    throw error;
  }
}


export async function fetchEnrolledCourses() {
  try {
    // Primary path per backend mounting
    const primary = `${API_URL}/api/enrollment`;
    const response = await axios.get(primary, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (primaryErr) {
    // Backward-compatible alias if older path is used elsewhere
    try {
      const fallback = `${API_URL}/api/enrollement`;
      const response = await axios.get(fallback, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (fallbackErr) {
      showToast('Failed to fetch enrolled courses', 'error');
      throw primaryErr;
    }
  }
}

export async function enrollInCourse(courseId: string) {
  try {
    const formData = new FormData();
    // Backend may not require any fields; send an empty FormData to satisfy multipart requirement
    const response = await axios.post(`${API_URL}/api/courses/${courseId}/enroll`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Enrolled successfully', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to enroll', 'error');
    throw error;
  }
}

// Update course (ownership enforced by backend)
export async function updateCourse(courseId: string, payload: Partial<Course>) {
  try {
    const response = await axios.put(`${API_URL}/api/courses/${courseId}`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Course updated successfully', 'success');
    return response.data as Course;
  } catch (error) {
    showToast('Failed to update course', 'error');
    throw error;
  }
}

// Delete course
export async function deleteCourse(courseId: string) {
  try {
    const response = await axios.delete(`${API_URL}/api/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Course deleted', 'success');
    return response.data;
  } catch (error) {
    showToast('Failed to delete course', 'error');
    throw error;
  }
}


// Publish course
export async function publishCourse(courseId: string) {
  try {
    const response = await axios.patch(`${API_URL}/api/courses/${courseId}/publish`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    showToast('Course published', 'success');
    return response.data as Course;
  } catch (error) {
    showToast('Failed to publish course', 'error');
    throw error;
  }
}

