import {
  CreateTransparencyPortalDto,
  CreateTransparencyPortalResponse,
  FindAllTransparencyOptions,
  TransparencyPaginated,
} from '@/types/transparency';
import { addSearchParamsInUrl } from '@/utils/pagination';
import { api } from './api';

export const getTransparency = async (options?: FindAllTransparencyOptions) => {
  const url = addSearchParamsInUrl(
    'v1/transparency-portal',
    {
      name: 'page',
      value: options?.page,
    },
    {
      name: 'limit',
      value: options?.limit,
    },
    {
      name: 'transparencyType',
      value: options?.transparencyType,
    },
  );

  const response = await api.get<TransparencyPaginated>(url);
  return response;
};

export const createTransparency = async ({
  pdf,
  transparencyType,
}: CreateTransparencyPortalDto) => {
  const formData = new FormData();
  formData.append('imagesDto', JSON.stringify(transparencyType));
  formData.append('image', pdf);
  const response = await api.post<CreateTransparencyPortalResponse>(
    '/images/v1',
    formData,
  );
  return response;
};

// export function updateDocument(
//   id: string,
//   updates: Partial<
//     Pick<TransparencyDocument, 'name' | 'type' | 'fileName' | 'fileUrl'>
//   >,
// ): void {
//   const docs = getTransparency().map((d) =>
//     d.id === id ? { ...d, ...updates } : d,
//   );
//   saveDocuments(docs);
// }

export async function deleteTransparency(id: string) {
  const response = await api.delete<void>(`/images/v1/${id}`);
  return response;
}
