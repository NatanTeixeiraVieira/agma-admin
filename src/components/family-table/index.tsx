import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { CopyLinkButton } from '@/components/copy-link-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Family } from '@/types/family';
import { Icon } from '../icon';

const RESPONDENT_LABELS: Record<string, string> = {
  mae: 'Mãe',
  pai: 'Pai',
  madrasta: 'Madrasta',
  padrasto: 'Padrasto',
  irmao: 'Irmã(o)',
  outro: 'Outro',
};

interface FamiliesTableProps {
  families: Family[];
  onEdit: (id: string) => void;
}

function describeRespondent(family: Family): string {
  // TODO Implement version
  // const data = getCurrentVersion(family).data;
  const data = family;
  const base = RESPONDENT_LABELS[data.respondent] ?? data.respondent;
  if (data.respondent === 'outro' && data.respondentOther) {
    return `${base}: ${data.respondentOther}`;
  }
  return base;
}

export function FamiliesTable({ families, onEdit }: FamiliesTableProps) {
  if (families.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Icon name="Users" className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Nenhum cadastro de família encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Responsável</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead className="text-center">Filhos</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Versão</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-35 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {families.map((family) => {
            // const current = getCurrentVersion(family);
            const current = family;
            return (
              <TableRow key={family.id}>
                <TableCell className="font-medium">
                  {describeRespondent(family)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {current.email}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {current.numberOfChildren}
                </TableCell>
                <TableCell>
                  {current.active ? (
                    <Badge variant="default">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {/* v{family.currentVersion} */}
                  v1
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(family.createdAt), 'dd/MM/yyyy', {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <CopyLinkButton familyId={family.id} />
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar / visualizar"
                      onClick={() => onEdit(family.id)}
                    >
                      <Icon name="Pencil" className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
