import { familySchema } from '@/validations/schemas/families';
import z from 'zod';

export type FamilyFormData = z.infer<typeof familySchema>;
