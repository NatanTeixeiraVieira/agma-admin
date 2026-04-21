import type { FamilyFormData } from '@/validations/schemas/families';

export interface StoredFamily extends FamilyFormData {
  id: string;
  createdAt: string;
}

const STORAGE_KEY = 'ong_families';

export function getFamilies(): StoredFamily[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as StoredFamily[]) : [];
}

export async function addFamily(data: FamilyFormData): Promise<StoredFamily> {
  const families = getFamilies();
  const newFamily: StoredFamily = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  families.push(newFamily);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(families));
  return newFamily;
}
