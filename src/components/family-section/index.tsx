import { RadioField } from '@/components/radio-fields';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Masks } from '@/constants/masks';
import { useFormContext } from 'react-hook-form';

const respondentOptions = [
  { value: 'mae', label: 'Mãe' },
  { value: 'pai', label: 'Pai' },
  { value: 'madrasta', label: 'Madrasta' },
  { value: 'padrasto', label: 'Padrasto' },
  { value: 'irmao', label: 'Irmã(o)' },
  { value: 'outro', label: 'Outro' },
];

const incomeOptions = [
  { value: '1_salario', label: '1 salário mínimo' },
  { value: 'ate_2_salarios', label: 'Até 2 salários mínimos' },
  { value: 'ate_3_salarios', label: 'Até 3 salários mínimos' },
  { value: 'acima_3_salarios', label: 'Acima de 3 salários mínimos' },
];

const yesNoOptions = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

const IMAGE_AUTH_TEXT =
  'Eu inscrito/a sob CPF acima já identificado neste formulário, assim como endereço onde resido, na condição de Responsável legal da pessoa na condição autista também já identificada neste formulário, AUTORIZO que sejam captadas, utilizadas e veiculadas nossas imagens fotográficas e audiovisuais durante as atividades realizadas na Associação desde que em conformidade com o Estatuto da Criança e do Adolescente e a Lei Geral de Proteção de Dados Pessoais (LGPD).';

export function FamilySection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              E-mail<span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input type="email" placeholder="seu@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RadioField
        name="respondent"
        label="Identifique por gentileza quem está respondendo este questionário"
        options={respondentOptions}
        required
        otherOption={{
          triggerValue: 'outro',
          otherFieldName: 'respondentOther',
          placeholder: 'Especifique quem está respondendo',
        }}
      />

      <FormField
        control={control}
        name="respondentCpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              CPF da pessoa que está respondendo este cadastro
              <span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input
                mask={Masks.cpf}
                placeholder="000.000.000-00"
                maxLength={14}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RadioField
        name="familyIncome"
        label="A renda familiar fica em torno de?"
        options={incomeOptions}
        required
      />

      <RadioField
        name="imageAuthorization"
        label={IMAGE_AUTH_TEXT}
        options={yesNoOptions}
        required
      />

      <FormField
        control={control}
        name="numberOfChildren"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Número de filhos que serão cadastrados
              <span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={10}
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? undefined : Number(e.target.value),
                  )
                }
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
