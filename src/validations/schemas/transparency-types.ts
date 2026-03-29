import { z } from 'zod';

export const transparencyTypeFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome do tipo de Transparência.'),
});
