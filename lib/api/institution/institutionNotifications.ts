import { API_URL } from "@/lib/axios";
import axios from "axios";


export interface InstitutionNotification {
  _id: string;
  title: string;
  message: string;
  notification_type: "enrollment" | "payment" | "course_update" | "system";
  is_read: boolean;
  created_at: string;
  metadata?: {
    enrollmentId?: string;
    courseId?: string;
    studentId?: string;
    studentName?: string;
    studentEmail?: string;
    enrollmentMode?: string;
    paymentStatus?: string;
  };
}

export const fetchInstitutionNotifications = async (): Promise<InstitutionNotification[]> => {
  try {
    const { data } = await axios.get(`${API_URL}/api/institution/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return data;
  } catch (error: any) {
    console.error('Fetch notifications error:', error);
    throw error.response?.data || error;
  }
};

export const markNotificationsAsRead = async (ids: string[]): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/api/institution/notifications/mark-read`,
      { notification_ids: ids },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error: any) {
    console.error('Mark as read error:', error);
    throw error.response?.data || error;
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/institution/notifications/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    throw error.response?.data || error;
  }
};

export async function toggleInstitutionNotification(id: string) {
  try {
    const res = await axios.patch(
      `${API_URL}/api/institution/notifications/${id}/toggle`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("Toggle notification error:", err);
    throw err.response?.data || err;
  }
}