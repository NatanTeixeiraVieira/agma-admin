import { LoginDto, LoginResponse } from '@/types/auth';
import { api } from './api';

export const login = async (dto: LoginDto) => {
  const response = await api.post<LoginResponse>('/v1/auth/login', dto);

  return response;
};

export const logout = async () => {
  const response = await api.post<void>('/v1/auth/logout');

  return response;
};
