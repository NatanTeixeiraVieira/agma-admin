import { FamilyFormData } from '@/types/family';

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

export function getFamilies(): StoredFamily[] {
  return readAll();
}

export function getFamilyById(id: string): StoredFamily | undefined {
  return readAll().find((f) => f.id === id);
}

export async function addFamily(data: FamilyFormData): Promise<StoredFamily> {
  const families = readAll();
  const now = new Date().toISOString();
  const newFamily: StoredFamily = {
    id: crypto.randomUUID(),
    createdAt: now,
    currentVersion: 1,
    versions: [{ version: 1, data, active: true, createdAt: now }],
  };
  families.push(newFamily);
  writeAll(families);
  return newFamily;
}

export async function updateFamily(
  id: string,
  data: FamilyFormData,
): Promise<StoredFamily> {
  const families = readAll();
  const idx = families.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error('Cadastro não encontrado');
  // NOTE: backend will be the source of truth for versioning.
  const current = getCurrentVersion(families[idx]);
  const updated = appendVersion(families[idx], data, current.active);
  families[idx] = updated;
  writeAll(families);
  return updated;
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

/**
 * Mock para integração com backend. O backend real deverá emitir um token
 * temporário associado ao cadastro, com a finalidade de permitir edição via
 * link público.
 */
export async function requestEditToken(id: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const exists = getFamilyById(id);
  if (!exists) throw new Error('Cadastro não encontrado');
  return crypto.randomUUID();
}
