import { loginFormSchema } from '@/validations/schemas/login';
import { z } from 'zod';

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    active: boolean;
    role: {
      id: string;
      name: string;
    };
  };
};
