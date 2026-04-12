import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Tag, Trash2 } from 'lucide-react';
import { useTransparencyTypes } from './transparency-types';

const TransparencyTypesPage = () => {
  const {
    transparencyTypes,
    editingType,
    form,
    deleteTarget,
    dialogOpen,
    isPending,
    handleDialogChange,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useTransparencyTypes();

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Tipos de Transparência
          </h2>

          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger>
              <Button onClick={openAddDialog}>
                <Icon name="Plus" />
                Novo Tipo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingType
                    ? 'Editar Tipo de Transparência'
                    : 'Adicionar Tipo de Transparência'}
                </DialogTitle>
              </DialogHeader>
              <Form
                form={form}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Tipo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Relatório de Atividades"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending} type="submit" className="w-full">
                  {editingType ? 'Salvar Alterações' : 'Adicionar Tipo'}
                </Button>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Tipos cadastrados
              <span className="text-muted-foreground font-normal text-sm ml-2">
                ({transparencyTypes.length}{' '}
                {transparencyTypes.length === 1 ? 'tipo' : 'tipos'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transparencyTypes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Nenhum tipo de Transparência cadastrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-25">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transparencyTypes.map((docType) => (
                      <TableRow key={docType.id}>
                        <TableCell className="font-medium">
                          {docType.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(docType.createdAt).toLocaleDateString(
                            'pt-BR',
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => openEditDialog(docType)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => requestDelete(docType)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        disabled={isPending}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && cancelDelete()}
        onConfirm={confirmDelete}
        description={`Deseja excluir o tipo "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
      />
    </>
  );
};

export default TransparencyTypesPage;
