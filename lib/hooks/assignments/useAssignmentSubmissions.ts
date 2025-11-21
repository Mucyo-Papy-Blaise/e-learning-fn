import { useQuery } from '@tanstack/react-query';
import { getAssignmentSubmissions, getMyAssignmentSubmission } from '@/lib/api/shared/assignments';
import { GET_ASSIGNMENT_SUBMISSIONS, GET_ASSIGNMENT_SUBMISSIONS_ME } from '@/lib/constants';

export function useAssignmentSubmissions(assignmentId: string | undefined) {
  return useQuery({
    queryKey: [GET_ASSIGNMENT_SUBMISSIONS, assignmentId],
    queryFn: () => getAssignmentSubmissions(assignmentId!),
    enabled: !!assignmentId,
  });
}

export function useMyAssignmentSubmission(assignmentId: string | undefined) {
  return useQuery({
    queryKey: [GET_ASSIGNMENT_SUBMISSIONS_ME, assignmentId],
    queryFn: () => getMyAssignmentSubmission(assignmentId!),
    enabled: !!assignmentId,
  });
}

