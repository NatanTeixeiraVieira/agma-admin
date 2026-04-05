import z from 'zod';

export const documentFormSchema = z.object({
  transparencyType: z.string().min(1, 'Selecione o tipo do documento.'),
});
