export interface InstitutionProfile {
  _id: string;
  name: string;
  logo?: string;
  bio?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface InstitutionProfileResponse {
  message: string;
  institution: InstitutionProfile;
}

export type Institution = InstitutionProfile;