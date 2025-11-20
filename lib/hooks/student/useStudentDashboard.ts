import { useQuery } from '@tanstack/react-query';
import { getStudentDashboard } from '@/lib/api/student';
import { GET_STUDENT_DASHBOARD } from '@/lib/constants';

export function useStudentDashboard() {
  return useQuery({
    queryKey: [GET_STUDENT_DASHBOARD],
    queryFn: getStudentDashboard,
  });
}

