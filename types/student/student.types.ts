export interface StudentProfile {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
  profile_image?: string;
  joinedDate?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountOverview {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    memberSince?: string;
    accountAge: string;
  };
  accountStatus: {
    isActive: boolean;
    isVerified: boolean;
    paymentStatus: 'paid' | 'pending' | 'unpaid';
    lastUpdated: string;
  };
  profileCompletion: {
    percentage: number;
    missingFields: string[];
  };
}

export interface StudentAlert {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string | null;
}

export interface Assignment {
  _id: string;
  course_id: { _id: string; title: string };
  module_id: { _id: string; title: string };
  title: string;
  description: string;
  dueDate: string;              
  availableAfter: string;
  points: number;
  submissionType: string;
  allowedAttempts: number;
  status: string;
  isAnonymous: boolean;
  peerReviewEnabled: boolean;
  plagiarismCheckEnabled: boolean;
  instructions: string;
  attachments: string[];
  rubric: string;
  created_at: string;
  updated_at: string;
}



