import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CopyRegistrationLinkButton } from '@/components/copy-registration-link-button';
import { FamilyEditDialog } from '@/components/family-edit-dialog';
import { FamiliesTable } from '@/components/family-table';
import { useFamily } from './family';

export default function FamiliesAdminPage() {
  const { families, editingFamily, openEdit, closeEdit, isEditOpen } =
    useFamily();

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Cadastros de Famílias
            </h2>
          </div>
          <CopyRegistrationLinkButton />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Famílias
              <span className="text-muted-foreground font-normal text-sm ml-2">
                ({families.length}{' '}
                {families.length === 1 ? 'cadastro' : 'cadastros'})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FamiliesTable families={families} onEdit={openEdit} />
          </CardContent>
        </Card>
      </div>

      <FamilyEditDialog
        family={editingFamily}
        open={isEditOpen}
        onOpenChange={(open) => !open && closeEdit()}
      />
    </>
  );
}
