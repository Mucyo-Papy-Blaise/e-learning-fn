export interface InstitutionProfile {
  _id: string;
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  logo?: string;
  user_id?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive?: boolean;
    isVerified?: boolean;
  };
}

