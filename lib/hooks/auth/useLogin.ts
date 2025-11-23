import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/auth';
import { LoginCredentials } from '@/lib/types/auth';
import { POST_AUTH_LOGIN } from '@/lib/constants';
import { toast } from 'react-toastify';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationKey: [POST_AUTH_LOGIN],
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast.success('Logged in successfully');
      
      if (data.user.role === 'student') {
        router.push('/student');
      } else if (data.user.role === 'institution') {
        router.push('/institution');
      } else {
        router.push('/instructor');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

