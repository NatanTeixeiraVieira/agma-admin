import { loginFormSchema } from '@/validations/schemas/login';
import { z } from 'zod';

export type LoginFormValues = z.infer<typeof loginFormSchema>;
