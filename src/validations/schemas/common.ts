import { z } from 'zod';

export const commonFieldSchema = (message: string) =>
  z.string().min(1, message);
