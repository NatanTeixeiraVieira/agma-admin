import { familySchema } from '@/validations/schemas/family';
import z from 'zod';

export type FamilyFormData = z.infer<typeof familySchema>;
