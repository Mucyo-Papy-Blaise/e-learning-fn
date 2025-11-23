import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyStudentProfile, updateMyStudentProfile } from '@/lib/api/student';
import { GET_STUDENT_PROFILE, PUT_STUDENT_PROFILE } from '@/lib/constants';

export function useStudentProfile() {
  return useQuery({
    queryKey: [GET_STUDENT_PROFILE],
    queryFn: getMyStudentProfile,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [PUT_STUDENT_PROFILE],
    mutationFn: (form: FormData) => updateMyStudentProfile(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_STUDENT_PROFILE] });
    },
  });
}

