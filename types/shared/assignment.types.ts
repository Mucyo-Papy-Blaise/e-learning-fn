export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course_id: string | { _id?: string; title?: string };
  module_id: string | { _id?: string; title?: string };
  dueDate: string;
  availableAfter?: string;
  points: number;
  submissionType?: 'text' | 'file' | 'url' | 'multiple';
  allowedAttempts?: number;
  status?: 'draft' | 'published' | 'closed';
  instructions?: string;
  attachments?: any[];
  rubric?: any;
  submitted: any;
  priority: any
}

export interface AssignmentSubmission {
  _id: string;
  content: string;
  file_url?: string;
  score?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
  submitted_at: string;
  grade: string;
}

