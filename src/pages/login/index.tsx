import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from './login';

export default function LoginPage() {
  const { form, isPending, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icon name="Lock" />
          </div>
          <h1 className="text-'2xl font-bold text-foreground">
            Área Administrativa
          </h1>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form form={form} onSubmit={handleSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Icon
                        name="Mail"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      />
                      <Input
                        type="email"
                        placeholder="admin@ong.org.br"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Icon
                        name="Lock"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      />
                      <Input type="password" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-destructive font-medium">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
              size="lg"
            >
              Entrar
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
