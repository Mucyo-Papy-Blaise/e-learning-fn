export interface SocialLinks {
  linkedin: string;
  twitter: string;
  github: string;
}

export interface PersonalData {
  name: string;
  email: string;
  phone: string;
  profession_name: string;
  bio: string;
  expertise: string[];
  social_links: SocialLinks;
}

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type TabType = "personal" | "security";