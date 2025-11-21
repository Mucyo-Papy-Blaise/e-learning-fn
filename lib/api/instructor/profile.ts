import axiosInstance from "../../axios";
import { API_URL } from '../config';
import { InstructorProfile } from '@/types/instructor/instructor.types';

export async function getMyInstructorProfile(): Promise<{ message: string; instructor: InstructorProfile }> {
  const res = await axiosInstance.get(`${API_URL}/api/instructor/profile`);
  return res.data;
}

export async function updateMyInstructorProfile(form: FormData): Promise<{ message: string; instructor: InstructorProfile }> {
  const res = await axiosInstance.put(`${API_URL}/api/instructor/profile`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateInstructorAccount(payload: { name?: string; phone?: string }): Promise<{ message: string; user: any }> {
  const res = await axiosInstance.put(`${API_URL}/api/instructor/account`, payload);
  return res.data;
}

