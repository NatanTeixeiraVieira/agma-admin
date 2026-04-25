import { Link2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export function CopyRegistrationLinkButton() {
  const handleCopy = async () => {
    const link = `${window.location.origin}/cadastro-familia`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link de cadastro copiado para a área de transferência.');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy}>
      <Link2 className="w-4 h-4" />
      Copiar link de cadastro
    </Button>
  );
}
