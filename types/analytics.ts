export interface CourseAnalytics {
  courseId: string;
  enrolmentCount: number;
  completionRatePercent: number;
  averageGradePercent: number;
  submissionsPending: number;
  weeklyActiveUsers: Array<{ weekStartISO: string; activeCount: number }>;
}

export interface DashboardAnalyticsSummary {
  instructorId: string;
  totalCourses: number;
  totalStudents: number;
  avgCourseCompletionPercent: number;
  avgCourseGradePercent: number;
  totalPendingSubmissions: number;
}

