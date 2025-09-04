'use client'
import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';
import type {
  ApiResult,
  Exam,
  ExamQuestion,
  ExamSubmission,
  Quiz,
  QuizAttempt,
  QuizGradingSummary,
  QuizQuestion,
  UUID,
} from '@/lib/types/assessments';

// Generic request wrapper to return ApiResult<T>
async function request<T>(fn: () => Promise<{ data: T }>): Promise<ApiResult<T>> {
  try {
    const res = await fn();
    return { ok: true, data: res.data };
  } catch (err) {
    const ax = err as AxiosError<any>;
    const status = ax.response?.status ?? 0;
    const message = (ax.response?.data as any)?.message || ax.message || 'Request failed';
    const details = ax.response?.data;
    return { ok: false, status, message, details };
  }
}

// ============ Quizzes (Student + Instructor) ============

export function getQuizzes(params?: { module_id?: UUID }): Promise<ApiResult<Quiz[]>> {
  return request<Quiz[]>(() => axiosInstance.get('/api/quizzes', { params }));
}

export function getQuizById(id: UUID): Promise<ApiResult<Quiz>> {
  return request<Quiz>(() => axiosInstance.get(`/api/quizzes/${id}`));
}

export function getQuizQuestions(quizId: UUID): Promise<ApiResult<QuizQuestion[]>> {
  return request<QuizQuestion[]>(() => axiosInstance.get(`/api/quizzes/${quizId}/questions`));
}

export function startQuizAttempt(quiz_id: UUID): Promise<ApiResult<QuizAttempt>> {
  return request<QuizAttempt>(() => axiosInstance.post('/api/quizzes/attempts', { quiz_id }));
}

export function submitQuizAttempt(attemptId: UUID, answers: Record<UUID, string>): Promise<ApiResult<{ message: string; attempt: QuizAttempt; grading: QuizGradingSummary }>> {
  return request(() => axiosInstance.post(`/api/quizzes/attempts/${attemptId}/submit`, { answers }));
}

export function getQuizAttempts(quizId?: UUID): Promise<ApiResult<QuizAttempt[]>> {
  const params = quizId ? { quiz_id: quizId } : undefined;
  return request<QuizAttempt[]>(() => axiosInstance.get('/api/quizzes/attempts/user', { params }));
}

// Instructor: manage quizzes
export function createQuiz(payload: Omit<Quiz, '_id'>): Promise<ApiResult<Quiz>> {
  return request<Quiz>(() => axiosInstance.post('/api/quizzes', payload));
}

export function updateQuiz(id: UUID, payload: Partial<Omit<Quiz, '_id'>>): Promise<ApiResult<Quiz>> {
  return request<Quiz>(() => axiosInstance.put(`/api/quizzes/${id}`, payload));
}

export function deleteQuiz(id: UUID): Promise<ApiResult<{ message: string }>> {
  return request<{ message: string }>(() => axiosInstance.delete(`/api/quizzes/${id}`));
}

export function createQuizQuestion(quizId: UUID, payload: Omit<QuizQuestion, '_id' | 'quiz_id'> & { quiz_id?: UUID }): Promise<ApiResult<QuizQuestion>> {
  const body = { ...payload, quiz_id: payload.quiz_id ?? quizId };
  return request<QuizQuestion>(() => axiosInstance.post(`/api/quizzes/${quizId}/questions`, body));
}

export function updateQuizQuestion(id: UUID, payload: Partial<Omit<QuizQuestion, '_id' | 'quiz_id'>>): Promise<ApiResult<QuizQuestion>> {
  return request<QuizQuestion>(() => axiosInstance.put(`/api/quizzes/questions/${id}`, payload));
}

export function deleteQuizQuestion(id: UUID): Promise<ApiResult<{ message: string }>> {
  return request<{ message: string }>(() => axiosInstance.delete(`/api/quizzes/questions/${id}`));
}

// ============ Exams (Student + Instructor) ============

export function listExams(params?: { course?: UUID }): Promise<ApiResult<{ message?: string; exams: Exam[] }>> {
  return request<{ message?: string; exams: Exam[] }>(() => axiosInstance.get('/api/exams', { params }));
}

export function getExamById(id: UUID): Promise<ApiResult<Exam>> {
  return request<Exam>(() => axiosInstance.get(`/api/exams/${id}`));
}

export function getExamQuestions(examId: UUID, includeAnswers: boolean = false): Promise<ApiResult<ExamQuestion[]>> {
  const params = includeAnswers ? { includeAnswers: true } : undefined;
  return request<ExamQuestion[]>(() => axiosInstance.get(`/api/exams/${examId}/questions`, { params }));
}

export function submitExam(examId: UUID, payload: { courseId: UUID; answers: Record<UUID, string> }): Promise<ApiResult<{ message: string; autoGrading: { autoScore: number; autoMaxScore: number; manualMaxScore: number; totalMaxScore: number }; submission: ExamSubmission }>> {
  return request(() => axiosInstance.post(`/api/exams/submit/${examId}`, payload));
}

export function getOwnExamSubmission(examId: UUID): Promise<ApiResult<ExamSubmission | null>> {
  return request<ExamSubmission | null>(() => axiosInstance.get(`/api/exams/submission/${examId}`));
}

// Instructor: manage exams and grading
export function createExam(payload: Omit<Exam, '_id'> & { examContent?: string }): Promise<ApiResult<{ message?: string; exam: Exam }>> {
  return request<{ message?: string; exam: Exam }>(() => axiosInstance.post('/api/exams', payload));
}

export function updateExam(id: UUID, payload: Partial<Omit<Exam, '_id'>>): Promise<ApiResult<{ message?: string; exam: Exam }>> {
  return request<{ message?: string; exam: Exam }>(() => axiosInstance.put(`/api/exams/${id}`, payload));
}

export function deleteExam(id: UUID): Promise<ApiResult<{ message: string }>> {
  return request<{ message: string }>(() => axiosInstance.delete(`/api/exams/${id}`));
}

export function createExamQuestion(examId: UUID, payload: any): Promise<ApiResult<ExamQuestion>> {
  return request<ExamQuestion>(() => axiosInstance.post(`/api/exams/${examId}/questions`, payload));
}

export function updateExamQuestion(id: UUID, payload: any): Promise<ApiResult<ExamQuestion>> {
  return request<ExamQuestion>(() => axiosInstance.put(`/api/exams/questions/${id}`, payload));
}

export function deleteExamQuestion(id: UUID): Promise<ApiResult<{ message: string }>> {
  return request<{ message: string }>(() => axiosInstance.delete(`/api/exams/questions/${id}`));
}

export function listSubmissionsForCourse(courseId: UUID): Promise<ApiResult<ExamSubmission[]>> {
  return request<ExamSubmission[]>(() => axiosInstance.get(`/api/exams/submissions/${courseId}`));
}

export function manualGradeSubmission(
  submissionId: UUID,
  perQuestionFeedback: Array<{ questionId: UUID; pointsAwarded: number; feedback?: string }>
): Promise<ApiResult<{ message: string; submission: ExamSubmission }>> {
  return request(() => axiosInstance.put(`/api/exams/grade/${submissionId}`, { perQuestionFeedback }));
}

// ============ Utilities ============

export type { Quiz, QuizQuestion, QuizAttempt, Exam, ExamQuestion, ExamSubmission };

