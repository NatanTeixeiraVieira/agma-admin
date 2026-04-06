import {
  CreateTransparencyTypeDto,
  CreateTransparencyTypeResponse,
  TransparencyTypes,
  UpdateTransparencyTypeDto,
  UpdateTransparencyTypeResponse,
} from '@/types/transparency-types';
import { api } from './api';

export const getTransparencyTypes = async () => {
  const response = await api.get<TransparencyTypes[]>('/v1/transparency-type');

  return response;
};

export const createTransparencyType = async ({
  name,
}: CreateTransparencyTypeDto) => {
  const response = await api.post<CreateTransparencyTypeResponse>(
    '/v1/transparency-type',
    { name },
  );

  return response;
};

export const updateTransparencyType = async ({
  id,
  name,
}: UpdateTransparencyTypeDto) => {
  const response = await api.put<UpdateTransparencyTypeResponse>(
    `/v1/transparency-type`,
    { id, name },
  );

  return response;
};

export const deleteTransparencyType = async (id: string) => {
  const response = await api.delete<UpdateTransparencyTypeResponse>(
    `/v1/transparency-type/${id}`,
  );

  return response;
};
