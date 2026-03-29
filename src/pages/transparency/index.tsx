import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
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
import { FileText, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { allTypesOption, useTransparency } from './transparency';

export default function TransparencyPortalPage() {
  const {
    form,
    filteredTransparencyDocuments,
    typeCounts,
    dialogOpen,
    deleteTarget,
    filterType,
    editingDoc,
    file,
    documentTypes,
    setFilterType,
    handleDialogChange,
    setFile,
    openAddDialog,
    openEditDialog,
    handleSubmit,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useTransparency();

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {typeCounts.map(({ type, count }) => (
            <Card
              key={type}
              className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
              onClick={() =>
                setFilterType(filterType === type ? allTypesOption : type)
              }
            >
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-1">
                  {type}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-65">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allTypesOption}>Todos os tipos</SelectItem>
                {documentTypes.map((dt) => (
                  <SelectItem key={dt.id} value={dt.name}>
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

          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-1" />
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Relatório</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Relatório de Atividades 2024"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do Documento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((dt) => (
                            <SelectItem key={dt.id} value={dt.name}>
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
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {file
                        ? file.name
                        : editingDoc
                          ? editingDoc.fileName
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
                <Button type="submit" className="w-full">
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
              Documentos {filterType !== allTypesOption && `— ${filterType}`}
              <span className="text-muted-foreground font-normal text-sm ml-2">
                ({filteredTransparencyDocuments.length}{' '}
                {filteredTransparencyDocuments.length === 1
                  ? 'documento'
                  : 'documentos'}
                )
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransparencyDocuments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Nenhum documento encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="w-25">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransparencyDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc.name}
                        </TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                            {doc.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => openEditDialog(doc)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => requestDelete(doc)}
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
        open={!!deleteTarget}
        onOpenChange={(open) => !open && cancelDelete()}
        onConfirm={confirmDelete}
        description={`Deseja excluir o documento "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
      />
    </>
  );
}
