import { DateField } from '@/components/date-field';
import { RadioField } from '@/components/radio-fields';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext, useWatch } from 'react-hook-form';

const genderOptions = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
];

const autismOptions = [
  { value: 'diagnosticado', label: 'Já diagnóstico confirmado' },
  { value: 'em_avaliacao', label: 'Está em avaliação' },
  { value: 'com_suspeita', label: 'Com suspeita' },
  { value: 'nenhuma', label: 'Nenhuma das opções anteriores' },
];

const supportLevelOptions = [
  { value: 'nivel_1', label: 'Nível I de suporte' },
  { value: 'nivel_2', label: 'Nível II de suporte' },
  { value: 'nivel_3', label: 'Nível III de suporte' },
  { value: 'nao_sei', label: 'Não sei' },
  { value: 'sem_diagnostico', label: 'Ainda não tem diagnóstico' },
];

const comorbidityOptions = [
  { value: 'tdah', label: 'TDAH' },
  { value: 'tod', label: 'TOD' },
  { value: 'outros', label: 'Outros' },
  { value: 'nenhuma', label: 'Nenhuma' },
];

const yesNoOptions = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

interface ChildSectionProps {
  index: number;
}

export function ChildSection({ index }: ChildSectionProps) {
  const { control } = useFormContext();
  const base = `children.${index}` as const;

  const usesMedication = useWatch({
    control,
    name: `${base}.usesMedication`,
  });
  const comorbidities: string[] =
    useWatch({ control, name: `${base}.comorbidities` }) ?? [];
  const showOtherComorbidity = comorbidities.includes('outros');

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name={`${base}.fullName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome completo da Pessoa na Condição Autista
              <span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DateField
        name={`${base}.birthDate`}
        label="Data de Nascimento da Pessoa na Condição Autista"
        required
      />

      <RadioField
        name={`${base}.gender`}
        label="Gênero"
        options={genderOptions}
        required
      />

      <FormField
        control={control}
        name={`${base}.motherName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome Completo da Mãe<span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${base}.fatherName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome completo do Pai<span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <RadioField
        name={`${base}.autismCondition`}
        label="Com relação a condição autista"
        options={autismOptions}
        required
      />

      <RadioField
        name={`${base}.supportLevel`}
        label="Qual é a classificação?"
        options={supportLevelOptions}
        required
      />

      <FormField
        control={control}
        name={`${base}.comorbidities`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Possui comorbidades<span className="text-destructive"> *</span>
            </FormLabel>
            <div className="flex flex-col space-y-2">
              {comorbidityOptions.map((opt) => {
                const checked = (field.value ?? []).includes(opt.value);
                return (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${base}-comorbidity-${opt.value}`}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const current: string[] = field.value ?? [];
                        if (isChecked) {
                          field.onChange([...current, opt.value]);
                        } else {
                          field.onChange(
                            current.filter((v) => v !== opt.value),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`${base}-comorbidity-${opt.value}`}
                      className="font-normal cursor-pointer"
                    >
                      {opt.label}
                    </Label>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOtherComorbidity && (
        <FormField
          control={control}
          name={`${base}.comorbiditiesOther`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique outras comorbidades</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <RadioField
        name={`${base}.multiprofessionalSupport`}
        label="Recebe acompanhamento com equipe Multiprofissional?"
        options={yesNoOptions}
        required
      />

      <RadioField
        name={`${base}.usesMedication`}
        label="Faz uso de medicação?"
        options={yesNoOptions}
        required
      />

      {usesMedication === 'sim' && (
        <FormField
          control={control}
          name={`${base}.medicationNames`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qual é o nome das medicações que faz uso?</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name={`${base}.schoolGrade`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Qual série/ano estuda?<span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${base}.schoolName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Escola/colégio onde estuda
              <span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
