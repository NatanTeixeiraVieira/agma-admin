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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { allTypesOption, useTransparency } from './transparency';

export default function TransparencyPortalPage() {
  const {
    form,
    transparency,
    dialogOpen,
    deleteTarget,
    filterType,
    editingDoc,
    file,
    documentTypes,
    isCreating,
    isDeleting,
    handleFileClick,
    setFilterType,
    handleDialogChange,
    setFile,
    openAddDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useTransparency();

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={filterType ?? allTypesOption}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-65">
                <SelectValue placeholder="Filtrar por tipo">
                  {documentTypes.find(({ id }) => id === filterType)?.name ??
                    allTypesOption}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allTypesOption}>Todos os tipos</SelectItem>
                {documentTypes.map((dt) => (
                  <SelectItem key={dt.id} value={dt.id}>
                    {dt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filterType !== allTypesOption && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterType(allTypesOption)}
              >
                Limpar filtro
              </Button>
            )}
          </div>

          <Dialog
            open={dialogOpen || isCreating}
            onOpenChange={handleDialogChange}
          >
            <DialogTrigger>
              <Button onClick={openAddDialog}>
                <Icon name="Plus" className="w-4 h-4 mr-1" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDoc ? 'Editar Documento' : 'Adicionar Documento'}
                </DialogTitle>
              </DialogHeader>
              <Form
                form={form}
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-2"
              >
                <FormField
                  control={form.control}
                  name="transparencyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo">
                              {
                                documentTypes.find(
                                  (dt) =>
                                    dt.id === form.watch('transparencyType'),
                                )?.name
                              }
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((dt) => (
                            <SelectItem key={dt.id} value={dt.id}>
                              {dt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>
                    Arquivo PDF {editingDoc && '(opcional — manter atual)'}
                  </FormLabel>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Icon
                      name="Upload"
                      className="w-8 h-8 mx-auto text-muted-foreground mb-2"
                    />
                    <p className="text-sm text-muted-foreground mb-2">
                      {file
                        ? file.name
                        : editingDoc
                          ? editingDoc.filename
                          : 'Clique para selecionar um arquivo PDF'}
                    </p>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      style={{
                        position: 'relative',
                        opacity: 1,
                        height: 'auto',
                      }}
                    />
                  </div>
                </div>
                <Button disabled={isCreating} type="submit" className="w-full">
                  {editingDoc ? 'Salvar Alterações' : 'Adicionar Documento'}
                </Button>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Documentos{' '}
              {filterType !== allTypesOption &&
                `— ${documentTypes.find((dt) => dt.id === filterType)?.name}`}
              <span className="text-muted-foreground font-normal text-sm ml-2">
                ({transparency.length}{' '}
                {transparency.length === 1 ? 'documento' : 'documentos'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transparency.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon
                  name="FileText"
                  className="w-12 h-12 mx-auto mb-3 opacity-40"
                />
                <p>Nenhum documento encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="w-25">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transparency.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="cursor-pointer"
                        onClick={() => handleFileClick(doc.path)}
                      >
                        <TableCell className="font-medium">
                          {doc.filename}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(event) => {
                                event.stopPropagation();
                                requestDelete(doc);
                              }}
                            >
                              <Icon name="Trash2" className="w-4 h-4" />
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
        disabled={isDeleting}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && cancelDelete()}
        onConfirm={confirmDelete}
        description={`Deseja excluir o documento "${deleteTarget?.filename}"? Essa ação não pode ser desfeita.`}
      />
    </>
  );
}
