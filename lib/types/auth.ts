export interface User {
  _id: string;
  email: string;
  full_name: string;
  institution:{name:string,id:string}
  role: 'student' | 'instructor' | 'admin'|'institution';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  _id: string
  image: string;
  email: string;
  password: string;
  full_name: string;
  role: 'student' | 'institution';
  phone: string;
}