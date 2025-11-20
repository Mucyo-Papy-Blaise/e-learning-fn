import axiosInstance from "../../axios";
import { API_URL, getAuthHeaders } from '../config';
import { InstructorDashboard } from '@/types/instructor/instructor.types';

export async function getInstructorDashboard(): Promise<InstructorDashboard> {
  const response = await axiosInstance.get(`${API_URL}/api/instructor/dashboard`, {
    headers: getAuthHeaders(),
  });
  const raw = response.data?.data ?? response.data?.dashboard ?? response.data;

  const toCount = (val: any): number => {
    if (Array.isArray(val)) return val.length;
    if (val && typeof val === 'object') {
      if (typeof val.total === 'number') return val.total;
      if (typeof val.count === 'number') return val.count;
      if (typeof val.value === 'number') return val.value;
      return Object.keys(val).length;
    }
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  return {
    courses: toCount(raw?.courses),
    students: toCount(raw?.students),
    hours: Number(raw?.hours ?? 0),
  };
}

