"use client";

import axios from "axios";
import { API_URL } from "./courses";

export type InstructorDashboard = any;

export async function fetchInstructorDashboard(): Promise<InstructorDashboard> {
  const response = await axios.get(`${API_URL}/api/instructor/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const raw = response.data?.data ?? response.data?.dashboard ?? response.data;

  const toCount = (val: any): number => {
    if (Array.isArray(val)) return val.length;
    if (val && typeof val === 'object') {
      if (typeof val.total === 'number') return val.total;
      if (typeof val.count === 'number') return val.count;
      if (typeof val.value === 'number') return val.value;
      // Fallback: number of keys for object shapes
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

