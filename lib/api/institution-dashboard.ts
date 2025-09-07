"use client";

import axios from "axios";
import { API_URL } from "./courses";

export type InstitutionStats = any;

export async function fetchInstitutionStats(): Promise<InstitutionStats> {
  const response = await axios.get(`${API_URL}/api/institutions/stats/overview`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = response.data;
  if (data?.data) return data.data;
  if (data?.stats) return data.stats;
  return data;
}

