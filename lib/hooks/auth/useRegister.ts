import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api/auth';
import { RegisterData } from '@/lib/types/auth';
import { POST_AUTH_REGISTER } from '@/lib/constants';
import { toast } from 'react-toastify';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationKey: [POST_AUTH_REGISTER],
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: () => {
      toast.success('Registration successful. Please verify your email.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

