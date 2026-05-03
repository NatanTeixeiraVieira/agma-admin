import {
  CompleteFamily,
  CreateFamilyRequest,
  CreateFamilyResponse,
  FamilyFormData,
  FindAllFamiliesPaginatedOptions,
  FindAllFamiliesPaginatedResponse,
  UpdateFamilyAdminRequest,
  UpdateFamilyRequest,
} from '@/types/family';
import { addSearchParamsInUrl } from '@/utils/pagination';
import { api } from './api';

export interface FamilyVersion {
  version: number;
  data: FamilyFormData;
  active: boolean;
  createdAt: string;
}

export interface StoredFamily {
  id: string;
  createdAt: string;
  currentVersion: number;
  versions: FamilyVersion[];
}

const STORAGE_KEY = 'ong_families';

// ----- internals -----------------------------------------------------------

type LegacyFamily = FamilyFormData & {
  id: string;
  createdAt: string;
};

type RawStoredFamily = StoredFamily | LegacyFamily;

function isLegacy(item: RawStoredFamily): item is LegacyFamily {
  return (
    !('versions' in item) || !Array.isArray((item as StoredFamily).versions)
  );
}

function migrate(item: LegacyFamily): StoredFamily {
  const { id, createdAt, ...data } = item;
  return {
    id,
    createdAt,
    currentVersion: 1,
    versions: [
      {
        version: 1,
        data: data as FamilyFormData,
        active: true,
        createdAt,
      },
    ],
  };
}

function readAll(): StoredFamily[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as RawStoredFamily[];
    const normalized = parsed.map((item) =>
      isLegacy(item) ? migrate(item) : item,
    );
    // Persist migration so subsequent reads are clean.
    if (normalized.some((_, i) => isLegacy(parsed[i]))) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return [];
  }
}

function writeAll(families: StoredFamily[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(families));
}

function appendVersion(
  family: StoredFamily,
  data: FamilyFormData,
  active: boolean,
): StoredFamily {
  const nextVersion = family.currentVersion + 1;
  return {
    ...family,
    currentVersion: nextVersion,
    versions: [
      ...family.versions,
      {
        version: nextVersion,
        data,
        active,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export function getCurrentVersion(family: StoredFamily): FamilyVersion {
  return (
    family.versions.find((v) => v.version === family.currentVersion) ??
    family.versions[family.versions.length - 1]
  );
}

// ----- public API ----------------------------------------------------------

export const getFamilies = async (
  options?: FindAllFamiliesPaginatedOptions,
) => {
  const url = addSearchParamsInUrl(
    'v1/form',
    {
      name: 'page',
      value: options?.page,
    },
    {
      name: 'limit',
      value: options?.limit,
    },
    {
      name: 'cpf',
      value: options?.cpf,
    },
    {
      name: 'version',
      value: options?.version,
    },
  );

  const response = await api.get<FindAllFamiliesPaginatedResponse>(url);
  return response;
};

export function getFamilyById(id: string): StoredFamily | undefined {
  return readAll().find((f) => f.id === id);
}

export async function createFamily(data: CreateFamilyRequest) {
  const response = await api.post<CreateFamilyResponse>('/v1/form', data);
  return response;
}

export async function updateFamily(data: UpdateFamilyRequest) {
  const response = await api.put<CompleteFamily>('/v1/form', data);

  return response;
}

export async function updateFamilyAdmin(data: UpdateFamilyAdminRequest) {
  const response = await api.put<CompleteFamily>('/v1/form/admin', data);

  return response;
}

export async function setFamilyActive(
  id: string,
  active: boolean,
): Promise<StoredFamily> {
  const families = readAll();
  const idx = families.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error('Cadastro não encontrado');
  // Toggling active also generates a new version, per business rule.
  const current = getCurrentVersion(families[idx]);
  const updated = appendVersion(families[idx], current.data, active);
  families[idx] = updated;
  writeAll(families);
  return updated;
}

export async function generateFamilyLink(id: string): Promise<string> {
  const response = await api.post<{ token: string }>(
    `/v1/form/generate-link/family/${id}`,
  );
  return response.data.token;
}

export const getFamilyByCpf = async (cpf: string, token: string) => {
  const response = await api.post<CompleteFamily>(
    `/v1/form/family/cpf/${cpf}`,
    { token },
  );
  return response;
};
