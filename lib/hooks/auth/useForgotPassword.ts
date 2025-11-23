import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/lib/api/auth';
import { POST_AUTH_FORGOT_PASSWORD } from '@/lib/constants';
import { toast } from 'react-toastify';

export function useForgotPassword() {
  return useMutation({
    mutationKey: [POST_AUTH_FORGOT_PASSWORD],
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
}

