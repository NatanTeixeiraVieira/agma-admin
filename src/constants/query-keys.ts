import { FindAllTransparencyOptions } from '@/types/transparency';

export const transparencyTypesKey = () => ['transparency-types'];
export const transparencyDocumentsKey = (
  filter?: FindAllTransparencyOptions,
) => ['transparency-documents', JSON.stringify(filter)];

export const familyKey = () => ['families'];

export const familyByCpfKey = (cpf: string, token: string) => [
  'family',
  cpf,
  token,
];
