import axiosInstance from "../axios";
import { API_URL } from "./courses";

export type InstitutionProfile = {
  _id: string;
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  logo?: string;
  user_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    isVerified?: boolean;
  };
};

export async function getMyInstitutionProfile(): Promise<{ message: string; institution: InstitutionProfile }>{
  const res = await axiosInstance.get(`${API_URL}/api/institutions/profile/me`);
  return res.data;
}

export async function updateMyInstitutionProfile(form: FormData): Promise<{ message: string; institution: InstitutionProfile }>{
  const res = await axiosInstance.put(`${API_URL}/api/institutions/profile/me`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchPublicInstitutions(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/institutions`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.institutions)) return (data as any).institutions;
  if (Array.isArray((data as any)?.data?.institutions)) return (data as any).data.institutions;
  return [];
}

