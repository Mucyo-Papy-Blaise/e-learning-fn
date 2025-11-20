import { useQuery } from '@tanstack/react-query';
import { getAssignmentsByCourse } from '@/lib/api/shared/assignments';
import { GET_ASSIGNMENTS_BY_COURSE } from '@/lib/constants';

export function useAssignmentsByCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: [GET_ASSIGNMENTS_BY_COURSE, courseId],
    queryFn: () => getAssignmentsByCourse(courseId!),
    enabled: !!courseId,
  });
}

