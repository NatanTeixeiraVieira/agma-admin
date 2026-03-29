import { toast } from '@/components/ui/sonner';
import { transparencyTypesKey } from '@/constants/query-keys';
import {
  addTransparencyType,
  deleteTransparencyType,
  getTransparencyTypes,
  TransparencyTypes,
  updateTransparencyType,
} from '@/services/transparency-types';
import { TransparencyTypeFormValues } from '@/types/transparency-types';
import { transparencyTypeFormSchema } from '@/validations/schemas/transparency-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

export function useTransparencyTypes() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransparencyTypes | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<TransparencyTypes | null>(
    null,
  );

  const { data: transparencyTypes = [] } = useQuery({
    queryKey: transparencyTypesKey(),
    queryFn: getTransparencyTypes,
  });

  const form = useForm<TransparencyTypeFormValues>({
    resolver: zodResolver(transparencyTypeFormSchema),
    defaultValues: { name: '' },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: transparencyTypesKey() });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    form.reset({ name: '' });
    setEditingType(null);
  }, [form]);

  const openAddDialog = useCallback(() => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback(
    (docType: TransparencyTypes) => {
      setEditingType(docType);
      form.reset({ name: docType.name });
      setDialogOpen(true);
    },
    [form],
  );

  const handleSubmit = useCallback(
    (values: TransparencyTypeFormValues) => {
      const trimmedName = values.name.trim();

      const exists = transparencyTypes.some(
        (dt) =>
          dt.name.toLowerCase() === trimmedName.toLowerCase() &&
          dt.id !== editingType?.id,
      );
      if (exists) {
        toast.error('Já existe um tipo de Transparência com esse nome.');
        return;
      }

      if (editingType) {
        updateTransparencyType(editingType.id, trimmedName);
        toast.success('Tipo de Transparência atualizado com sucesso!');
      } else {
        addTransparencyType(trimmedName);
        toast.success('Tipo de Transparência adicionado com sucesso!');
      }

      invalidate();
      resetForm();
      setDialogOpen(false);
    },
    [editingType, transparencyTypes, invalidate, resetForm],
  );

  const requestDelete = useCallback((docType: TransparencyTypes) => {
    setDeleteTarget(docType);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteTransparencyType(deleteTarget.id);
      invalidate();
      toast.success('Tipo de Transparência excluído.');
      setDeleteTarget(null);
    }
  }, [deleteTarget, invalidate]);

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleDialogChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) resetForm();
    },
    [resetForm],
  );

  return {
    transparencyTypes,
    dialogOpen,
    deleteTarget,
    editingType,
    form,
    handleDialogChange,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
