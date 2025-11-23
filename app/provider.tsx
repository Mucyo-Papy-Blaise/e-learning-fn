'use client';

import { AuthProvider } from '@/lib/context/auth-context';
import { CourseProvider } from '@/lib/context/course-context';
import { EducationProvider } from '@/context/educationContext';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <CourseProvider>
          <EducationProvider>
            {children}
            <ToastContainer />
          </EducationProvider>
        </CourseProvider>
      </AuthProvider>
    </QueryProvider>
  );
}