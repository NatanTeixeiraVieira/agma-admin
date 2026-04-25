import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { family } from '@/constants/query-keys';
import { getFamilies } from '@/services/family';

export function useFamily() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: families = [], isLoading } = useQuery({
    queryKey: family(),
    queryFn: getFamilies,
  });

  const editingFamily = editingId
    ? (families.find((f) => f.id === editingId) ?? null)
    : null;

  const openEdit = useCallback((id: string) => setEditingId(id), []);
  const closeEdit = useCallback(() => setEditingId(null), []);

  return {
    families,
    isLoading,
    editingFamily,
    isEditOpen: editingId !== null,
    openEdit,
    closeEdit,
  };
}
