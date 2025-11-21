import { useQuery } from '@tanstack/react-query';
import { getStudentGrades } from '@/lib/api/student';
import { GET_STUDENT_COURSE_GRADES } from '@/lib/constants';

export function useStudentGrades(courseId: string | undefined) {
  return useQuery({
    queryKey: [GET_STUDENT_COURSE_GRADES, courseId],
    queryFn: () => getStudentGrades(courseId!),
    enabled: !!courseId,
  });
}

