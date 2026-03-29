import { transparencyTypeFormSchema } from '@/validations/schemas/transparency-types';
import { z } from 'zod';

export type TransparencyTypeFormValues = z.infer<
  typeof transparencyTypeFormSchema
>;
