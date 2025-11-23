"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '@/lib/types/auth';
import { toast } from 'react-toastify';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;

  // 🔥 ADDED
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  showAuthModal: false, // already existed
};

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'OPEN_AUTH_MODAL' }
  | { type: 'CLOSE_AUTH_MODAL' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };

    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'OPEN_AUTH_MODAL':
      return { ...state, showAuthModal: true };

    case 'CLOSE_AUTH_MODAL':
      return { ...state, showAuthModal: false };

    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Authentication failed');

      const data = await response.json();
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      dispatch({ type: 'SET_USER', payload: data.user });
      toast.success("Logged in successfully");

      if (data.user.role === 'student') window.location.href = '/student';
      else if (data.user.role === 'institution') window.location.href = '/institution';
      else window.location.href = '/instructor';

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      toast.success("Registration successful. Please verify your email.");
      window.location.href = '/login';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success("Logged out successfully");
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
      }

      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
      }

      toast.success("Password reset successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password reset failed');
    }
  };

  // 🔥 ADDED — Modal handlers
  const openAuthModal = () => dispatch({ type: "OPEN_AUTH_MODAL" });
  const closeAuthModal = () => dispatch({ type: "CLOSE_AUTH_MODAL" });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,

        // ⬇️ 🔥 expose modal controls
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook stays same
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
