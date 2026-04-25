import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';

import { AddressSection } from '@/components/address-section';
import { BenefitsSection } from '@/components/benefits-section';
import { ChildSection } from '@/components/child-section';
import { FamilySection } from '@/components/family-section';
import { Icon } from '@/components/icon';
import { useFamilyRegistration } from './family-registration';

export default function FamilyRegistrationPage() {
  const {
    form,
    isPending,
    isSuccess,
    steps,
    currentStep,
    activeStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    onSubmit,
    goNext,
    goPrev,
  } = useFamilyRegistration();

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-muted/30 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon name="CheckCircle2" className="h-10 w-10 text-primary" />
              </div>
              <CardTitle>Cadastro enviado com sucesso</CardTitle>
              <CardDescription>
                Recebemos as informações da sua família. Em breve entraremos em
                contato.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const renderStep = () => {
    switch (activeStep.kind) {
      case 'family':
        return <FamilySection />;
      case 'child':
        return <ChildSection index={activeStep.childIndex} />;
      case 'address':
        return <AddressSection />;
      case 'benefits':
        return <BenefitsSection />;
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Cadastro de Famílias
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações abaixo para cadastrar sua família e seus
            filhos junto à Associação.
          </p>
        </header>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Etapa {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-muted-foreground">{activeStep.title}</span>
          </div>
          <Progress value={progress} />
          <div className="flex flex-wrap gap-2 pt-1">
            {steps.map((step, idx) => (
              <span
                key={step.id}
                className={`text-xs px-2 py-1 rounded-full border ${
                  idx === currentStep
                    ? 'bg-primary text-primary-foreground border-primary'
                    : idx < currentStep
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {idx + 1}. {step.title}
              </span>
            ))}
          </div>
        </div>

        <Form form={form} onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeStep.title}</CardTitle>
              <CardDescription>{activeStep.description}</CardDescription>
            </CardHeader>
            <CardContent>{renderStep()}</CardContent>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              disabled={isFirstStep || isPending}
            >
              Voltar
            </Button>

            {isLastStep ? (
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? 'Enviando...' : 'Enviar Cadastro'}
              </Button>
            ) : (
              <Button type="button" onClick={goNext} size="lg">
                Avançar
              </Button>
            )}
          </div>
        </Form>
      </div>
    </main>
  );
}
