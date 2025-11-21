import { useQuery } from '@tanstack/react-query';
import { fetchModulesByCourseId } from '@/lib/api/courses';
import { GET_COURSE_MODULES } from '@/lib/constants';

export function useCourseModules(courseId: string | undefined) {
  return useQuery({
    queryKey: [GET_COURSE_MODULES, courseId],
    queryFn: () => fetchModulesByCourseId(courseId!),
    enabled: !!courseId,
  });
}

