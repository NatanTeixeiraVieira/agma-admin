import {
  transparencyDocumentsKey,
  transparencyTypesKey,
} from '@/constants/query-keys';
import {
  addDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
  type TransparencyDocument,
} from '@/services/transparency';
import { getTransparencyTypes } from '@/services/transparency-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const documentFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome do relatório.'),
  type: z.string().min(1, 'Selecione o tipo do documento.'),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

export const allTypesOption = 'Todos os tipos';

export function useTransparency() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TransparencyDocument | null>(
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [filterType, setFilterType] = useState<string | null>(allTypesOption);
  const [deleteTarget, setDeleteTarget] = useState<TransparencyDocument | null>(
    null,
  );

  const { data: transparency = [] } = useQuery({
    queryKey: transparencyDocumentsKey(),
    queryFn: getDocuments,
  });

  const { data: documentTypes = [] } = useQuery({
    queryKey: transparencyTypesKey(),
    queryFn: getTransparencyTypes,
  });

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: { name: '', type: '' },
  });

  const filteredTransparencyDocuments = useMemo(
    () =>
      filterType === allTypesOption
        ? transparency
        : transparency.filter((d) => d.type === filterType),
    [transparency, filterType],
  );

  const typeCounts = useMemo(
    () =>
      documentTypes.map((dt) => ({
        type: dt.name,
        count: transparency.filter((d) => d.type === dt.name).length,
      })),
    [transparency, documentTypes],
  );

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['transparency'] });
  }, [queryClient]);

  const resetForm = useCallback(() => {
    form.reset({ name: '', type: '' });
    setFile(null);
    setEditingDoc(null);
  }, [form]);

  const openAddDialog = useCallback(() => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback(
    (doc: TransparencyDocument) => {
      setEditingDoc(doc);
      form.reset({ name: doc.name, type: doc.type });
      setFile(null);
      setDialogOpen(true);
    },
    [form],
  );

  const handleSubmit = useCallback(
    (values: DocumentFormValues) => {
      if (editingDoc) {
        const updates: Partial<
          Pick<TransparencyDocument, 'name' | 'type' | 'fileName' | 'fileUrl'>
        > = {
          name: values.name.trim(),
          type: values.type,
        };
        if (file) {
          if (file.type !== 'application/pdf') {
            toast.error('Apenas arquivos PDF são permitidos.');
            return;
          }
          updates.fileName = file.name;
          updates.fileUrl = URL.createObjectURL(file);
        }
        updateDocument(editingDoc.id, updates);
        toast.success('Documento atualizado com sucesso!');
      } else {
        if (!file) {
          toast.error('Selecione um arquivo PDF.');
          return;
        }
        if (file.type !== 'application/pdf') {
          toast.error('Apenas arquivos PDF são permitidos.');
          return;
        }
        addDocument({
          name: values.name.trim(),
          type: values.type,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
        });
        toast.success('Documento adicionado com sucesso!');
      }

      invalidate();
      resetForm();
      setDialogOpen(false);
    },
    [editingDoc, file, invalidate, resetForm],
  );

  const requestDelete = useCallback((doc: TransparencyDocument) => {
    setDeleteTarget(doc);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteDocument(deleteTarget.id);
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

  return {
    transparency,
    documentTypes,
    filteredTransparencyDocuments,
    typeCounts,
    filterType,
    dialogOpen,
    editingDoc,
    file,
    form,
    deleteTarget,
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
