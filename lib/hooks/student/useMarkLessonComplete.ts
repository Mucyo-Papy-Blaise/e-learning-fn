import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markLessonComplete } from '@/lib/api/student';
import { POST_STUDENT_LESSON_COMPLETE, GET_STUDENT_COURSE_PROGRESS } from '@/lib/constants';

export function useMarkLessonComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_STUDENT_LESSON_COMPLETE],
    mutationFn: ({ lessonId, payload }: { lessonId: string; payload?: Record<string, any> }) =>
      markLessonComplete(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_STUDENT_COURSE_PROGRESS] });
    },
  });
}

