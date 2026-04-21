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

const residenceOptions = [
  { value: 'proprio', label: 'Casa/apartamento próprio' },
  { value: 'alugado', label: 'Casa/apartamento alugado' },
  { value: 'cedido', label: 'Casa/apartamento cedido' },
  { value: 'outro', label: 'Outro' },
];

export function AddressSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <RadioField
        name="residenceType"
        label="A família reside em:"
        options={residenceOptions}
        required
        otherOption={{
          triggerValue: 'outro',
          otherFieldName: 'residenceTypeOther',
          placeholder: 'Especifique o tipo de residência',
        }}
      />

      <FormField
        control={control}
        name="cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP</FormLabel>
            <FormControl>
              <Input
                placeholder="00000-000"
                mask={Masks.postalCode}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome da rua que a família reside
              <span className="text-destructive"> *</span>
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
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Número da residência (em caso de apartamento, identifique o Bloco
              e o número)<span className="text-destructive"> *</span>
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
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Bairro/Distrito<span className="text-destructive"> *</span>
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
        name="referencePoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ponto de referência</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="motherPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Telefone da mãe com DDD
              <span className="text-destructive"> *</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="(00) 00000-0000"
                mask={Masks.phoneNumber}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fatherPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone do pai com DDD</FormLabel>
            <FormControl>
              <Input
                placeholder="(00) 00000-0000"
                mask={Masks.phoneNumber}
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="stepParentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nome da madrasta ou padrasto (caso tenha convívio)
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
