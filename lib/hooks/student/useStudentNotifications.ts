import { useQuery } from '@tanstack/react-query';
import { getStudentNotifications } from '@/lib/api/student';
import { GET_STUDENT_NOTIFICATIONS } from '@/lib/constants';

export function useStudentNotifications() {
  return useQuery({
    queryKey: [GET_STUDENT_NOTIFICATIONS],
    queryFn: getStudentNotifications,
  });
}

