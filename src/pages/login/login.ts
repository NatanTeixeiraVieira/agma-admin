import { useAuthStore } from '@/stores/auth-store';
import { LoginFormValues } from '@/types/login';
import { loginFormSchema } from '@/validations/schemas/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export function useLogin() {
  const {
    actions: { login },
  } = useAuthStore();

  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSubmit = form.handleSubmit((values: LoginFormValues) => {
    const success = login(values.email, values.password);
    if (success) {
      navigate('/admin');
    } else {
      form.setError('root', { message: 'Credenciais inválidas.' });
    }
  });

  return { form, handleSubmit };
}
