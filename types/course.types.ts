export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published";

export interface CourseFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  difficulty_level: DifficultyLevel;
  status: CourseStatus;
  prerequisites: string;
  start_date: string;
  end_date: string;
  is_certified: boolean;
  duration_weeks: string;
}