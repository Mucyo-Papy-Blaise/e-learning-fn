export interface InstitutionProfile {
  _id: string;
  name: string;
  logo?: string;
  bio?: string;
}

export interface InstitutionProfileResponse {
  message: string;
  institution: InstitutionProfile;
}

export type Institution = InstitutionProfile;