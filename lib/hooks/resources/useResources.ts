import { useQuery } from '@tanstack/react-query';
import { fetchResourcesByLessonId } from '@/lib/api/resources';
import { GET_RESOURCES_BY_LESSON } from '@/lib/constants';

export function useResourcesByLesson(lessonId: string | undefined) {
  return useQuery({
    queryKey: [GET_RESOURCES_BY_LESSON, lessonId],
    queryFn: () => fetchResourcesByLessonId(lessonId!),
    enabled: !!lessonId,
  });
}

