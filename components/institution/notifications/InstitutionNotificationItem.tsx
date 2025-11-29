import React from "react";
import { InstitutionNotification } from "@/lib/api/institution/institutionNotifications";

interface Props {
  notification: InstitutionNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string) => void;
  onConfirmPayment?: (enrollmentId: string, notificationId: string) => Promise<void>;
}

const notificationColors: Record<string, string> = {
  enrollment: "bg-green-100 text-green-800",
  payment: "bg-blue-100 text-blue-800",
  system: "bg-gray-100 text-gray-800",
  course_update: "bg-yellow-100 text-yellow-800",
  other: "bg-purple-100 text-purple-800",
};

export const InstitutionNotificationItem: React.FC<Props> = ({
  notification,
  onDelete,
  onToggleRead,
  onConfirmPayment
}) => {
  const isEnrollmentNotification = notification.notification_type === "enrollment";
  const hasEnrollmentId = notification.metadata?.enrollmentId;
  const paymentStatus = notification.metadata?.paymentStatus;

  const handleConfirmPayment = async () => {
    if (hasEnrollmentId && onConfirmPayment) {
      await onConfirmPayment(notification.metadata?.enrollmentId!, notification._id);
    }
  };

  return (
    <div className={`flex justify-between items-start p-4 border-b hover:bg-gray-50 ${notification.is_read ? 'opacity-75' : ''}`}>
      <div className="flex-1">
        <div className="font-semibold">{notification.title}</div>
        <div className="text-sm text-gray-600">{notification.message}</div>
        {notification.metadata?.studentName && (
          <div className="text-xs text-gray-500 mt-1">
            Student: {notification.metadata.studentName}
            {notification.metadata.studentEmail && ` (${notification.metadata.studentEmail})`}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {new Date(notification.created_at).toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 ml-4">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            notificationColors[notification.notification_type] || notificationColors.other
          }`}
        >
          {notification.notification_type}
        </span>

        {isEnrollmentNotification && hasEnrollmentId && paymentStatus === "pending" && (
          <button
            onClick={handleConfirmPayment}
            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
          >
            Confirm Payment
          </button>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onToggleRead(notification._id)}
            className={`text-xs font-medium ${
              notification.is_read ? "text-gray-400" : "text-blue-600"
            } hover:underline`}
          >
            {notification.is_read ? "Mark as Unread" : "Mark as Read"}
          </button>

          <button
            onClick={() => onDelete(notification._id)}
            className="text-xs text-red-600 font-medium hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
