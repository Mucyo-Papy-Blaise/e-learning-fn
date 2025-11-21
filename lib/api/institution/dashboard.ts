import { API_URL, getAuthHeaders } from '../config';

export interface InstitutionStats {
  [key: string]: any;
}

export interface InstitutionDashboardAgg {
  [key: string]: any;
}

export async function getInstitutionStats(): Promise<InstitutionStats> {
  const response = await fetch(`${API_URL}/api/institutions/stats/overview`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch institution stats');
  const data = await response.json();
  if (data?.data) return data.data;
  if (data?.stats) return data.stats;
  return data;
}

export async function getInstitutionDashboard(): Promise<InstitutionDashboardAgg> {
  const response = await fetch(`${API_URL}/api/institutions/dashboard`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch institution dashboard');
  const data = await response.json();
  return data?.data ?? data;
}

