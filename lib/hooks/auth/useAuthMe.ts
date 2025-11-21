import { useQuery } from '@tanstack/react-query';
import { getAuthMe } from '@/lib/api/auth';
import { GET_AUTH_ME } from '@/lib/constants';

export function useAuthMe() {
  return useQuery({
    queryKey: [GET_AUTH_ME],
    queryFn: getAuthMe,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  });
}

