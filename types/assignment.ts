export interface IAssignment {
  id: string;
  title: string;
  dueDate: string;
  availableAfter: string;
  status: string;
  points: number;
  submissionType: string;
  attempts: number;
  allowedAttempts: number;
  grade?: string;
  gradedAnonymously?: boolean;
  introduction: string;
  instructions: {
    step: string;
    content: string;
  }[];
  detailedInstructions?: string;
  comments?: string;
  earnedPoints?: number;
  type?: string;
  viewRubric?: boolean; 
  submissionDetails?: string; 
}