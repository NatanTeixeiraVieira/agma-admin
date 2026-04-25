import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Icon } from '../icon';

interface DateFieldProps {
  name: string;
  label: string;
  required?: boolean;
}

export function DateField({ name, label, required }: DateFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? (
                    format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <Icon
                    name="CalendarIcon"
                    className="ml-auto h-4 w-4 opacity-50"
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
                locale={ptBR}
                className={cn('p-3 pointer-events-auto')}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
