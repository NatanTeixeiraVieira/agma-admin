export interface TransparencyTypes {
  id: string;
  name: string;
  createdAt: string;
}

const STORAGE_KEY = 'ong_transparency_types';

const DEFAULT_TYPES: Omit<TransparencyTypes, 'id' | 'createdAt'>[] = [
  { name: 'Relatório de Atividades' },
  { name: 'Balanço Patrimonial' },
  { name: 'Parcerias com a Administração Pública' },
  { name: 'Doações Espontâneas' },
  { name: 'Estatuto Social' },
];

function ensureDefaults(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const defaults: TransparencyTypes[] = DEFAULT_TYPES.map((dt) => ({
      ...dt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }
}

export function getTransparencyTypes(): TransparencyTypes[] {
  ensureDefaults();
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTransparencyTypes(types: TransparencyTypes[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
}

export function addTransparencyType(name: string): TransparencyTypes {
  const types = getTransparencyTypes();
  const newType: TransparencyTypes = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  };
  types.push(newType);
  saveTransparencyTypes(types);
  return newType;
}

export function updateTransparencyType(id: string, name: string): void {
  const types = getTransparencyTypes().map((t) =>
    t.id === id ? { ...t, name } : t,
  );
  saveTransparencyTypes(types);
}

export function deleteTransparencyType(id: string): void {
  const types = getTransparencyTypes().filter((t) => t.id !== id);
  saveTransparencyTypes(types);
}
