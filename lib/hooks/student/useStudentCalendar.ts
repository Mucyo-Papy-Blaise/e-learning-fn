import { useQuery } from '@tanstack/react-query';
import { getStudentCalendar } from '@/lib/api/student';
import { GET_STUDENT_CALENDAR } from '@/lib/constants';

export function useStudentCalendar() {
  return useQuery({
    queryKey: [GET_STUDENT_CALENDAR],
    queryFn: getStudentCalendar,
  });
}

