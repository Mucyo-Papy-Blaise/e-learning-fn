import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/lib/api/auth';
import { POST_AUTH_RESET_PASSWORD } from '@/lib/constants';
import { toast } from 'react-toastify';

export function useResetPassword() {
  return useMutation({
    mutationKey: [POST_AUTH_RESET_PASSWORD],
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Password reset successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Password reset failed');
    },
  });
}

