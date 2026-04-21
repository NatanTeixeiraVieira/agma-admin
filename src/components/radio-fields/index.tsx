import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext, useWatch } from 'react-hook-form';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioFieldProps {
  name: string;
  label: string;
  options: RadioOption[];
  required?: boolean;
  otherOption?: {
    triggerValue: string;
    otherFieldName: string;
    placeholder?: string;
  };
}

export function RadioField({
  name,
  label,
  options,
  required,
  otherOption,
}: RadioFieldProps) {
  const { control } = useFormContext();
  const watchedValue = useWatch({ control, name });
  const showOther = otherOption && watchedValue === otherOption.triggerValue;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="leading-relaxed flex items-start">
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value ?? ''}
              className="flex flex-col space-y-1"
            >
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`${name}-${opt.value}`}
                  />
                  <Label
                    htmlFor={`${name}-${opt.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
          {showOther && (
            <FormField
              control={control}
              name={otherOption.otherFieldName}
              render={({ field: otherField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={otherOption.placeholder ?? 'Especifique...'}
                      {...otherField}
                      value={otherField.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormItem>
      )}
    />
  );
}
