import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAssignment } from '@/lib/api/shared/assignments';
import { POST_ASSIGNMENT_SUBMIT, GET_ASSIGNMENT_SUBMISSIONS_ME } from '@/lib/constants';

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_ASSIGNMENT_SUBMIT],
    mutationFn: ({ assignmentId, formData }: { assignmentId: string; formData: FormData }) =>
      submitAssignment(assignmentId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_ASSIGNMENT_SUBMISSIONS_ME, variables.assignmentId] });
    },
  });
}

