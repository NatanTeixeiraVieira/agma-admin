import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { requestEditToken } from '@/services/family';
import { Icon } from '../icon';

interface CopyLinkButtonProps {
  familyId: string;
}

export function CopyLinkButton({ familyId }: CopyLinkButtonProps) {
  const mutation = useMutation({
    mutationFn: () => requestEditToken(familyId),
    onSuccess: async (token) => {
      const link = `${window.location.origin}/cadastro-familia/${token}`;
      try {
        await navigator.clipboard.writeText(link);
        toast.success('Link copiado para a área de transferência.');
      } catch {
        toast.error('Não foi possível copiar o link.');
      }
    },
    onError: () => {
      toast.error('Falha ao gerar o link de edição.');
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      title="Copiar link de edição"
    >
      {mutation.isPending ? (
        <Icon name="Loader2" className="w-4 h-4 animate-spin" />
      ) : (
        <Icon name="Link2" className="w-4 h-4" />
      )}
    </Button>
  );
}
