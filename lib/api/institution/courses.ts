import axiosInstance from "../../axios";
import { API_URL } from '../config';

export async function getInstitutionById(id: string) {
  const res = await axiosInstance.get(`${API_URL}/api/institutions/${id}`);
  return res.data;
}

export async function getCoursesByInstitution(id: string) {
  const res = await axiosInstance.get(`${API_URL}/api/institutions/${id}/courses`);
  return res.data;
}

