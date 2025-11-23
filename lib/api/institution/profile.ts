import axiosInstance from "../../axios";
import { API_URL } from '../config';
import { InstitutionProfile } from '@/types/institution/institution.types';

export async function getMyInstitutionProfile(): Promise<{ message: string; institution: InstitutionProfile }> {
  const res = await axiosInstance.get(`${API_URL}/api/institutions/profile/me`);
  return res.data;
}

export async function updateMyInstitutionProfile(form: FormData): Promise<{ message: string; institution: InstitutionProfile }> {
  const res = await axiosInstance.put(`${API_URL}/api/institutions/profile/me`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchCoursesByInstitution(id: string) {
  const res = await axiosInstance.get(`${API_URL}/api/institutions/${id}/courses`);
  return res.data; 
}



