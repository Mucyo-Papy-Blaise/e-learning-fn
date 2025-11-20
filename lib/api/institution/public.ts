import { API_URL } from '../config';
import { InstitutionProfile } from '@/types/institution/institution.types';

export async function getPublicInstitutions(): Promise<InstitutionProfile[]> {
  const res = await fetch(`${API_URL}/api/institutions`);
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as any)?.institutions)) return (data as any).institutions;
  if (Array.isArray((data as any)?.data?.institutions)) return (data as any).data.institutions;
  return [];
}

