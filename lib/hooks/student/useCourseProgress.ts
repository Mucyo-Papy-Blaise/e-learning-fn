import { useQuery } from '@tanstack/react-query';
import { getCourseProgress } from '@/lib/api/student';
import { GET_STUDENT_COURSE_PROGRESS } from '@/lib/constants';

export function useCourseProgress(courseId: string | undefined) {
  return useQuery({
    queryKey: [GET_STUDENT_COURSE_PROGRESS, courseId],
    queryFn: () => getCourseProgress(courseId!),
    enabled: !!courseId,
  });
}

