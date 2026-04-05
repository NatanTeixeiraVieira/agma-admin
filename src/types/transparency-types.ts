import { transparencyTypeFormSchema } from '@/validations/schemas/transparency-types';
import { z } from 'zod';

export type TransparencyTypeFormValues = z.infer<
  typeof transparencyTypeFormSchema
>;

export type TransparencyTypes = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransparencyTypeResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransparencyTypeDto = {
  name: string;
};

export type UpdateTransparencyTypeResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateTransparencyTypeDto = {
  id: string;
  name: string;
};
