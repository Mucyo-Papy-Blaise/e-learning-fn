export interface InstructorProfile {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    isVerified?: boolean;
  };
  profession_name?: string;
  bio?: string;
  expertise?: string[];
  social_links?: Record<string, string>;
  profile_image?: string;
}

export interface InstructorDashboard {
  courses: number;
  students: number;
  hours: number;
}

