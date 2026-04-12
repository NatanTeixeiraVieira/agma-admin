import { toast } from '@/components/ui/sonner';
import { transparencyTypesKey } from '@/constants/query-keys';
import {
  createTransparencyType,
  deleteTransparencyType,
  getTransparencyTypes,
  updateTransparencyType,
} from '@/services/transparency-types';
import {
  TransparencyTypeFormValues,
  TransparencyTypes,
} from '@/types/transparency-types';
import { transparencyTypeFormSchema } from '@/validations/schemas/transparency-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

export function useTransparencyTypes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TransparencyTypes | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<TransparencyTypes | null>(
    null,
  );

  const { data: transparencyTypes = [] } = useQuery({
    queryKey: transparencyTypesKey(),
    queryFn: async () => (await getTransparencyTypes()).data,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransparencyType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transparencyTypesKey() });
      toast.success('Tipo de Transparência excluído.');
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error('Erro ao excluir o tipo de Transparência.');
    },
  });

  const createMutation = useMutation({
    mutationFn: createTransparencyType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transparencyTypesKey() });
      toast.success('Tipo de Transparência adicionado com sucesso!');
      resetForm();
      setDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao adicionar o tipo de Transparência.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTransparencyType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transparencyTypesKey() });
      toast.success('Tipo de Transparência atualizado com sucesso!');
      resetForm();
      setDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao atualizar o tipo de Transparência.');
    },
  });

  const form = useForm<TransparencyTypeFormValues>({
    resolver: zodResolver(transparencyTypeFormSchema),
    defaultValues: { name: '' },
  });

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
        updateMutation.mutate({ id: editingType.id, name: trimmedName });
      } else {
        createMutation.mutate({ name: trimmedName });
      }
    },
    [editingType, transparencyTypes, updateMutation, createMutation],
  );

  const requestDelete = useCallback((docType: TransparencyTypes) => {
    setDeleteTarget(docType);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  }, [deleteTarget, deleteMutation]);

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
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    handleDialogChange,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
