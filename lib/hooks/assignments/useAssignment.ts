import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignmentById, createAssignment, updateAssignment } from '@/lib/api/shared/assignments';
import { GET_ASSIGNMENT_BY_ID, POST_ASSIGNMENT, PUT_ASSIGNMENT } from '@/lib/constants';
import { Assignment } from '@/types/shared/assignment.types';

export function useAssignment(id: string | undefined) {
  return useQuery({
    queryKey: [GET_ASSIGNMENT_BY_ID, id],
    queryFn: () => getAssignmentById(id!),
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_ASSIGNMENT],
    mutationFn: (payload: Partial<Assignment>) => createAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_ASSIGNMENT_BY_ID] });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PUT_ASSIGNMENT],
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Assignment> }) =>
      updateAssignment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [GET_ASSIGNMENT_BY_ID, variables.id] });
    },
  });
}

