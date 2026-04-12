import { toast } from '@/components/ui/sonner';
import { login } from '@/services/auth';
import { useAuthStore } from '@/stores/auth-store';
import { LoginFormValues } from '@/types/auth';
import { loginFormSchema } from '@/validations/schemas/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export function useLogin() {
  const {
    state: { auth },
    actions,
  } = useAuthStore();

  useEffect(() => {
    if (auth) {
      navigate('/transparencia');
    }
  }, [auth]);

  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      actions.login(data);
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast.error((error.response?.data as any)?.message);
        return;
      }

      toast.error('Houve um erro ao entrar.');
    },
  });

  const handleSubmit = form.handleSubmit((values: LoginFormValues) => {
    loginMutation.mutate(values);
  });

  return { form, handleSubmit };
}
