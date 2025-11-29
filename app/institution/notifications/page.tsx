"use client";

import React, { useEffect, useState } from "react";
import {
  fetchInstitutionNotifications,
  markNotificationsAsRead,
  deleteNotification,
  InstitutionNotification,
  toggleInstitutionNotification,
} from "../../../lib/api/institution/institutionNotifications";
import { InstitutionNotificationItem } from "@/components/institution/notifications/InstitutionNotificationItem";
import { confirmPayment } from "@/lib/api/institution/courses";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<InstitutionNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchInstitutionNotifications();
      setNotifications(data);
    } catch (error: any) {
      toast.error('Failed to load notifications');
      console.error('Load notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const updated = await toggleInstitutionNotification(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, is_read: updated.notification.is_read } : n))
      );
    } catch (error: any) {
      toast.error('Failed to update notification');
      console.error('Toggle read error:', error);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationsAsRead([id]);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, is_read: true } : n))
      );
    } catch (error: any) {
      toast.error('Failed to mark as read');
      console.error('Mark as read error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error: any) {
      toast.error('Failed to delete notification');
      console.error('Delete error:', error);
    }
  };

  const handleConfirmPayment = async (enrollmentId: string, notificationId: string) => {
    try {
      setConfirmingPayment(enrollmentId);
      await confirmPayment(enrollmentId);
      
      // Update notification to reflect payment confirmation
      setNotifications(prev =>
        prev.map(n => {
          if (n._id === notificationId) {
            return {
              ...n,
              notification_type: 'payment' as const,
              title: 'Payment Confirmed',
              message: `Payment has been confirmed for enrollment in course`,
              metadata: {
                ...n.metadata,
                paymentStatus: 'approved'
              }
            };
          }
          return n;
        })
      );
      
      toast.success('Payment confirmed successfully! Student now has full access to the course.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
      console.error('Confirm payment error:', error);
    } finally {
      setConfirmingPayment(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n._id);
    if (unreadIds.length === 0) return;

    try {
      await markNotificationsAsRead(unreadIds);
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Failed to mark all as read');
      console.error('Mark all read error:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh notifications every 30 seconds for real-time updates
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-blue-600 text-lg font-medium animate-pulse">
          Loading notifications...
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No notifications</p>
            <p className="text-sm mt-2">You{"'"}ll see enrollment and payment notifications here</p>
          </div>
        ) : (
          notifications.map(notification => (
            <InstitutionNotificationItem
              key={notification._id}
              notification={notification}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
              onMarkRead={handleMarkRead}
              onConfirmPayment={handleConfirmPayment}
            />
          ))
        )}
      </div>
    </div>
  );
}
