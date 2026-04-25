import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { AddressSection } from '@/components/address-section';
import { BenefitsSection } from '@/components/benefits-section';
import { ChildSection } from '@/components/child-section';
import { FamilySection } from '@/components/family-section';
import { FamilyVersionSelect } from '@/components/family-version-select';

import {
  getCurrentVersion,
  setFamilyActive,
  updateFamily,
  type StoredFamily,
} from '@/services/family';
import { FamilyFormData } from '@/types/family';
import { familySchema } from '@/validations/schemas/family';
import { Icon } from '../icon';

interface FamilyEditDialogProps {
  family: StoredFamily | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function deserializeChildren(data: FamilyFormData): FamilyFormData {
  // Datas vindas do localStorage chegam como string; o zod espera Date.
  return {
    ...data,
    children: data.children.map((child) => ({
      ...child,
      birthDate:
        child.birthDate instanceof Date
          ? child.birthDate
          : new Date(child.birthDate as unknown as string),
    })),
  };
}

export function FamilyEditDialog({
  family,
  open,
  onOpenChange,
}: FamilyEditDialogProps) {
  const queryClient = useQueryClient();
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const currentVersion = family?.currentVersion ?? 1;
  const versionData = useMemo(() => {
    if (!family) return null;
    const version = family.versions.find((v) => v.version === selectedVersion);
    return version ? deserializeChildren(version.data) : null;
  }, [family, selectedVersion]);

  const isLatestSelected = selectedVersion === currentVersion;
  const currentVersionEntry = family ? getCurrentVersion(family) : null;
  const isActive = currentVersionEntry?.active ?? true;

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    values: versionData ?? undefined,
    mode: 'onBlur',
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const numberOfChildren = useWatch({ control, name: 'numberOfChildren' });

  useEffect(() => {
    if (
      typeof numberOfChildren !== 'number' ||
      Number.isNaN(numberOfChildren) ||
      numberOfChildren < 1 ||
      !isLatestSelected
    ) {
      return;
    }
    const target = Math.min(Math.max(numberOfChildren, 1), 10);
    const current = fields.length;
    if (target > current) {
      for (let i = 0; i < target - current; i++) {
        append({} as never);
      }
    } else if (target < current) {
      for (let i = current - 1; i >= target; i--) {
        remove(i);
      }
    }
  }, [numberOfChildren, fields.length, append, remove, isLatestSelected]);

  // Sempre que abrir o modal ou mudar a família, sincroniza com a versão atual.
  useEffect(() => {
    if (family) setSelectedVersion(family.currentVersion);
  }, [family]);

  const updateMutation = useMutation({
    mutationFn: (data: FamilyFormData) => updateFamily(family!.id, data),
    onSuccess: () => {
      toast.success('Cadastro atualizado. Nova versão gerada.');
      queryClient.invalidateQueries({ queryKey: ['families'] });
      onOpenChange(false);
    },
    onError: () => toast.error('Não foi possível atualizar o cadastro.'),
  });

  const activeMutation = useMutation({
    mutationFn: (active: boolean) => setFamilyActive(family!.id, active),
    onSuccess: (_, active) => {
      toast.success(
        active
          ? 'Cadastro reativado. Nova versão gerada.'
          : 'Cadastro desativado. Nova versão gerada.',
      );
      queryClient.invalidateQueries({ queryKey: ['families'] });
      onOpenChange(false);
    },
    onError: () => toast.error('Não foi possível alterar o status.'),
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  if (!family || !versionData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Icon
              name="Loader2"
              className="w-6 h-6 animate-spin text-muted-foreground"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isPending = updateMutation.isPending || activeMutation.isPending;
  const readOnly = !isLatestSelected;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de Família</DialogTitle>
          <DialogDescription>
            Selecione uma versão para visualizar. Apenas a versão mais recente
            pode ser editada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Versão</label>
          <FamilyVersionSelect
            versions={family.versions}
            currentVersion={currentVersion}
            value={selectedVersion}
            onChange={setSelectedVersion}
          />
          {readOnly && (
            <Alert>
              <Icon name="AlertTriangle" className="h-4 w-4" />
              <AlertDescription>
                Você está visualizando uma versão anterior. Para editar,
                selecione a versão mais recente.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          <fieldset
            disabled={readOnly || isPending}
            className="space-y-6 disabled:opacity-90"
          >
            <FamilySection />
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Filho {index + 1}
                </h3>
                <ChildSection index={index} />
              </div>
            ))}
            <AddressSection />
            <BenefitsSection />
          </fieldset>

          {!readOnly && (
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmDeactivate(true)}
                disabled={isPending}
              >
                {isActive ? 'Desativar cadastro' : 'Reativar cadastro'}
              </Button>
              <Button type="submit" disabled={isPending}>
                {updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </DialogFooter>
          )}
        </Form>

        <AlertDialog
          open={confirmDeactivate}
          onOpenChange={setConfirmDeactivate}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isActive ? 'Desativar cadastro' : 'Reativar cadastro'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação gerará uma nova versão do cadastro
                {isActive
                  ? ' e o marcará como inativo.'
                  : ' e o marcará como ativo.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setConfirmDeactivate(false);
                  activeMutation.mutate(!isActive);
                }}
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
