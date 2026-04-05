import { documentFormSchema } from '@/validations/schemas/transparency';
import { z } from 'zod';
import { Pagination } from './pagination';
import { CreateTransparencyTypeResponse } from './transparency-types';

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

export type Transparency = {
  id: string;
  path: string;
  filename: string;
};

export type TransparencyPaginated = Pagination<Transparency>;

export type FindAllTransparencyOptions = {
  transparencyType?: string;
  page?: number;
  limit?: number;
};

export type CreateTransparencyPortalDto = {
  pdf: File;
  transparencyType: {
    id: string;
  };
};

export type CreateTransparencyPortalResponse = {
  id: string;
  transparencyType: CreateTransparencyTypeResponse;
  path: string;
  filename: string;
};
