import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { familyKey } from '@/constants/query-keys';
import { getFamilies } from '@/services/family';

export function useFamily() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: families = [], isLoading } = useQuery({
    queryKey: familyKey(),
    queryFn: async () => {
      return (
        await getFamilies({
          page: 1,
          limit: 100,
        })
      ).data.items;
    },
  });

  const editingFamily = editingId
    ? (families.find(({ family }) => family.id === editingId) ?? null)
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
