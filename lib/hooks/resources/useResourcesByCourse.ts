import { useQuery } from '@tanstack/react-query';
import { useCourseModules } from '../courses/useCourseModules';
import { fetchResourcesByLessonId } from '@/lib/api/resources';
import { GET_RESOURCES_BY_LESSON } from '@/lib/constants';

export function useResourcesByCourse(courseId: string | undefined) {
  const { data: modules = [] } = useCourseModules(courseId);
  
  // Get all lesson IDs from modules
  const lessonIds = modules.flatMap((m: any) => (m.lessons || []).map((l: any) => l._id));

  return useQuery({
    queryKey: [GET_RESOURCES_BY_LESSON, 'course', courseId],
    queryFn: async () => {
      if (lessonIds.length === 0) return [];
      const resourceLists = await Promise.all(
        lessonIds.map(async (lessonId: string) => {
          try {
            return await fetchResourcesByLessonId(lessonId);
          } catch {
            return [];
          }
        })
      );
      return resourceLists.flat();
    },
    enabled: !!courseId && lessonIds.length > 0,
  });
}

