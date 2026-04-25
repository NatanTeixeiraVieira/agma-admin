import { toast } from '@/components/ui/sonner';
import { addFamily } from '@/services/family';
import { FamilyFormData } from '@/types/family';
import { familySchema } from '@/validations/schemas/family';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { FieldPath } from 'react-hook-form';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

const emptyChild = {
  fullName: '',
  birthDate: undefined as unknown as Date,
  gender: undefined as unknown as 'feminino' | 'masculino',
  motherName: '',
  fatherName: '',
  autismCondition: undefined as never,
  supportLevel: undefined as never,
  comorbidities: [] as string[],
  comorbiditiesOther: '',
  multiprofessionalSupport: undefined as never,
  usesMedication: undefined as never,
  medicationNames: '',
  schoolGrade: '',
  schoolName: '',
};

const FAMILY_FIELDS: FieldPath<FamilyFormData>[] = [
  'email',
  'respondent',
  'respondentOther',
  'respondentCpf',
  'familyIncome',
  'imageAuthorization',
  'numberOfChildren',
];

const ADDRESS_FIELDS: FieldPath<FamilyFormData>[] = [
  'residenceType',
  'residenceTypeOther',
  'cep',
  'street',
  'number',
  'neighborhood',
  'referencePoint',
  'motherPhone',
  'fatherPhone',
  'stepParentName',
];

const BENEFITS_FIELDS: FieldPath<FamilyFormData>[] = [
  'bpc',
  'crasRegistration',
  'municipalCard',
  'ciptea',
];

const CHILD_SUBFIELDS = [
  'fullName',
  'birthDate',
  'gender',
  'motherName',
  'fatherName',
  'autismCondition',
  'supportLevel',
  'comorbidities',
  'comorbiditiesOther',
  'multiprofessionalSupport',
  'usesMedication',
  'medicationNames',
  'schoolGrade',
  'schoolName',
] as const;

export function useFamilyRegistration() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      email: '',
      respondent: undefined,
      respondentOther: '',
      respondentCpf: '',
      familyIncome: undefined,
      imageAuthorization: undefined,
      numberOfChildren: 1,
      children: [emptyChild as FamilyFormData['children'][number]],
      residenceType: undefined,
      residenceTypeOther: '',
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      referencePoint: '',
      motherPhone: '',
      fatherPhone: '',
      stepParentName: '',
      bpc: undefined,
      crasRegistration: undefined,
      municipalCard: undefined,
      ciptea: undefined,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const numberOfChildren = useWatch({ control, name: 'numberOfChildren' });

  useEffect(() => {
    if (
      typeof numberOfChildren !== 'number' ||
      Number.isNaN(numberOfChildren) ||
      numberOfChildren < 1
    ) {
      return;
    }
    const target = Math.min(Math.max(numberOfChildren, 1), 10);
    const current = fields.length;
    if (target > current) {
      for (let i = 0; i < target - current; i++) {
        append(emptyChild as never);
      }
    } else if (target < current) {
      for (let i = current - 1; i >= target; i--) {
        remove(i);
      }
    }
  }, [numberOfChildren, fields.length, append, remove]);

  const steps = useMemo(() => {
    const childSteps = fields.map((field, index) => ({
      id: `child-${field.id}`,
      title: `Filho ${index + 1}`,
      description: 'Dados da pessoa na condição autista.',
      kind: 'child' as const,
      childIndex: index,
    }));

    return [
      {
        id: 'family',
        title: 'Dados da Família',
        description: 'Informações sobre o responsável e a família.',
        kind: 'family' as const,
      },
      ...childSteps,
      {
        id: 'address',
        title: 'Endereço e Contatos',
        description: 'Onde a família reside e contatos.',
        kind: 'address' as const,
      },
      {
        id: 'benefits',
        title: 'Benefícios e Documentação',
        description: 'Programas sociais e documentos.',
        kind: 'benefits' as const,
      },
    ];
  }, [fields]);

  const totalSteps = steps.length;
  const safeStep = Math.min(currentStep, totalSteps - 1);
  const activeStep = steps[safeStep];

  const fieldsForStep = (
    step: (typeof steps)[number],
  ): FieldPath<FamilyFormData>[] => {
    switch (step.kind) {
      case 'family':
        return FAMILY_FIELDS;
      case 'address':
        return ADDRESS_FIELDS;
      case 'benefits':
        return BENEFITS_FIELDS;
      case 'child':
        return CHILD_SUBFIELDS.map(
          (sub) =>
            `children.${step.childIndex}.${sub}` as FieldPath<FamilyFormData>,
        );
    }
  };

  const goNext = async () => {
    const valid = await form.trigger(fieldsForStep(activeStep));
    if (!valid) return;
    if (safeStep < totalSteps - 1) {
      setCurrentStep(safeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (safeStep > 0) {
      setCurrentStep(safeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const mutation = useMutation({
    mutationFn: addFamily,
    onSuccess: () => {
      toast.error('Cadastro enviado com sucesso');
      setIsSuccess(true);
      form.reset();
      setCurrentStep(0);
    },
    onError: () => {
      toast.error('Erro ao enviar o cadastro. Tente novamente.');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const isLastStep = safeStep === totalSteps - 1;
  const isFirstStep = safeStep === 0;
  const progress = ((safeStep + 1) / totalSteps) * 100;

  return {
    form,
    fields,
    onSubmit,
    isPending: mutation.isPending,
    isSuccess,
    steps,
    currentStep: safeStep,
    activeStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    goNext,
    goPrev,
  };
}
