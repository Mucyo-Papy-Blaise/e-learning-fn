export type UUID = string;

export interface Quiz {
  _id: UUID;
  module_id: UUID;
  title: string;
  description?: string;
  pass_percentage: number;
  max_attempts: number;
  time_limit: number; // minutes
}

export interface QuizQuestion {
  _id: UUID;
  quiz_id: UUID;
  question: string;
  options: string[];
  // correct_answer is never exposed to students; included here for instructor flows
  correct_answer?: string;
  points: number;
}

export interface QuizAttempt {
  _id: UUID;
  quiz_id: UUID;
  user_id: UUID;
  answers: Record<UUID, string>; // questionId -> selected option
  score?: number;
  started_at?: string;
  completed_at?: string;
}

export interface QuizGradingSummary {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
}

export interface Exam {
  _id: UUID;
  course: UUID;
  title: string;
  description?: string;
  instructions?: string;
  examContent?: string;
  startDate?: string;
  endDate?: string;
  duration?: number; // minutes
  passingScore?: number;
  totalPoints?: number;
}

export type ExamQuestionType = 'multiple_choice' | 'written';

export interface ExamQuestionBase {
  _id: UUID;
  exam_id: UUID;
  type: ExamQuestionType;
  question: string;
  points: number;
  order?: number;
}

export interface ExamQuestionMCQ extends ExamQuestionBase {
  type: 'multiple_choice';
  options: string[];
  correct_answer?: string; // hidden from students
}

export interface ExamQuestionWritten extends ExamQuestionBase {
  type: 'written';
}

export type ExamQuestion = ExamQuestionMCQ | ExamQuestionWritten;

export interface ExamSubmission {
  _id: UUID;
  examId: UUID;
  course: UUID;
  studentId: UUID;
  answers: Record<UUID, string>; // questionId -> answer (option or free text)
  autoScore?: number;
  manualScore?: number;
  totalScore?: number;
  results?: Array<{
    questionId: UUID;
    correct?: boolean;
    pointsAwarded?: number;
    feedback?: string;
  }>;
}

export interface StudentGrade {
  studentId: UUID;
  courseId: UUID;
  assessmentType: 'quiz' | 'exam';
  assessmentId: UUID;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  status?: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  status: number;
  message: string;
  details?: unknown;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

