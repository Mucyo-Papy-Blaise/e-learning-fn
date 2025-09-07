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
  const data = response.data;
  // Normalize typical shapes
  if (data?.data) return data.data;
  if (data?.dashboard) return data.dashboard;
  return data;
}

