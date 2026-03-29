export type TransparencyDocument = {
  id: string;
  name: string;
  type: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
};

const STORAGE_KEY = 'ong_documents';

export function getDocuments(): TransparencyDocument[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveDocuments(docs: TransparencyDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function addDocument(
  doc: Omit<TransparencyDocument, 'id' | 'createdAt'>,
): TransparencyDocument {
  const docs = getDocuments();
  const newDoc: TransparencyDocument = {
    ...doc,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  docs.push(newDoc);
  saveDocuments(docs);
  return newDoc;
}

export function updateDocument(
  id: string,
  updates: Partial<
    Pick<TransparencyDocument, 'name' | 'type' | 'fileName' | 'fileUrl'>
  >,
): void {
  const docs = getDocuments().map((d) =>
    d.id === id ? { ...d, ...updates } : d,
  );
  saveDocuments(docs);
}

export function deleteDocument(id: string): void {
  const docs = getDocuments().filter((d) => d.id !== id);
  saveDocuments(docs);
}
