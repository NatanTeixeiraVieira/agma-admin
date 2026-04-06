import { toast } from '@/components/ui/sonner';
import {
  transparencyDocumentsKey,
  transparencyTypesKey,
} from '@/constants/query-keys';
import {
  createTransparency,
  deleteTransparency,
  getTransparency,
} from '@/services/transparency';
import { getTransparencyTypes } from '@/services/transparency-types';
import { DocumentFormValues, Transparency } from '@/types/transparency';
import { documentFormSchema } from '@/validations/schemas/transparency';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const allTypesOption = 'Todos os tipos';

export function useTransparency() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Transparency | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filterType, setFilterType] = useState<string | null>(allTypesOption);
  const [deleteTarget, setDeleteTarget] = useState<Transparency | null>(null);

  const options = useMemo(() => {
    return filterType && filterType !== allTypesOption
      ? { transparencyType: filterType, page: 1, limit: 100 }
      : { page: 1, limit: 100 };
  }, [filterType]);

  const { data: transparency = [] } = useQuery({
    queryKey: transparencyDocumentsKey(options),
    queryFn: async () => {
      return (await getTransparency(options)).data.items;
    },
  });

  const { data: documentTypes = [] } = useQuery({
    queryKey: transparencyTypesKey(),
    queryFn: async () => (await getTransparencyTypes()).data,
  });

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: { transparencyType: '' },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['transparency'] });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    form.reset({ transparencyType: '' });
    setFile(null);
    setEditingDoc(null);
  }, [form]);

  const openAddDialog = useCallback(() => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback(
    (doc: Transparency) => {
      setEditingDoc(doc);
      form.reset({ transparencyType: '' });
      setFile(null);
      setDialogOpen(true);
    },
    [form],
  );

  const handleSubmit = useCallback(
    (values: DocumentFormValues) => {
      if (!file) {
        toast.error('Selecione um arquivo PDF.');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos.');
        return;
      }

      createTransparency({
        pdf: file,
        transparencyType: { id: values.transparencyType },
      });

      toast.success(
        editingDoc
          ? 'Documento atualizado com sucesso!'
          : 'Documento adicionado com sucesso!',
      );

      invalidate();
      resetForm();
      setDialogOpen(false);
    },
    [editingDoc, file, invalidate, resetForm],
  );

  const requestDelete = useCallback((doc: Transparency) => {
    setDeleteTarget(doc);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteTransparency(deleteTarget.id);
      invalidate();
      toast.success('Documento excluído.');
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

  const handleFileClick = (url: string) => {
    window.open(url, '_blank');
  };

  return {
    transparency,
    documentTypes,
    filterType,
    dialogOpen,
    editingDoc,
    file,
    form,
    deleteTarget,
    handleFileClick,
    setFilterType,
    handleDialogChange,
    setFile,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
