export type NotificationType = 'announcement' | 'grade' | 'general'

export interface Notification {
  id: string
  recipientId: string
  type: NotificationType
  title: string
  message: string
  createdAtISO: string
  read: boolean
  meta?: Record<string, any>
}

