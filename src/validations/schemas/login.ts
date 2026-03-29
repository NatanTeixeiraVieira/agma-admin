import { z } from 'zod';
import { commonFieldSchema } from './common';

export const loginFormSchema = z.object({
  email: z.email('E-mail inválido'),
  password: commonFieldSchema('A senha é obrigatória.').min(
    8,
    ' A senha deve conter no mínimo 8 caracteres.',
  ),
});
