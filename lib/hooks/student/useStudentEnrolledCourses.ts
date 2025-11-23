import { useQuery } from '@tanstack/react-query';
import { getStudentEnrolledCourses } from '@/lib/api/student';
import { GET_STUDENT_ENROLLED_COURSES } from '@/lib/constants';

export function useStudentEnrolledCourses() {
  return useQuery({
    queryKey: [GET_STUDENT_ENROLLED_COURSES],
    queryFn: getStudentEnrolledCourses,
  });
}

