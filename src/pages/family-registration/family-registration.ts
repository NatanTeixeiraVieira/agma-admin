import { toast } from '@/components/ui/sonner';
import { createFamily, getFamilyByCpf, updateFamily } from '@/services/family';
import { CompleteFamily, FamilyFormData } from '@/types/family';
import {
  convertFamilyResponseToFormData,
  convertFormToRequest,
} from '@/utils/family-converters';
import { familySchema } from '@/validations/schemas/family';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import type { FieldPath } from 'react-hook-form';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import { FamilyRegistrationPageProps } from '.';

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

type Props = Pick<FamilyRegistrationPageProps, 'edit'>;

export function useFamilyRegistration({ edit }: Props) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editFamilyCpf, setEditFamilyCpf] = useState<string>('');
  const [isCpfFormOpen, setIsCpfFormOpen] = useState(true);
  const [updateFamilyData, setUpdateFamilyData] =
    useState<CompleteFamily | null>(null);

  const { token } = useParams();

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

  // useEffect(() => {
  //   const cpf = sessionStorage.getItem('cpf');
  //   if (!cpf) return;

  //   setEditFamilyCpf(cpf);
  // }, []);

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

  const mutationCreate = useMutation({
    mutationFn: createFamily,
    onSuccess: () => {
      toast.success('Cadastro enviado com sucesso');
      setIsSuccess(true);
      form.reset();
      setCurrentStep(0);
    },
    onError: (error: AxiosError) => {
      if (error.status === 409) {
        toast.error((error.response?.data as any)?.message);
        return;
      }
      toast.error('Erro ao enviar o cadastro. Tente novamente.');
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: updateFamily,
    onSuccess: () => {
      toast.success('Cadastro editado com sucesso');
      setIsSuccess(true);
      form.reset();
      setCurrentStep(0);
    },
    onError: () => {
      toast.error('Erro ao editar o cadastro. Tente novamente.');
    },
  });

  // useEffect(() => {
  //   const cpf = sessionStorage.getItem('cpf');

  //   if (!cpf) return;

  //   setEditFamilyCpf(cpf);
  // }, []);

  const mutationConfirmCpf = useMutation({
    mutationFn: ({ cpf, token }: { cpf: string; token: string }) =>
      getFamilyByCpf(cpf, token),
    onSuccess: ({ data }) => {
      // sessionStorage.setItem('cpf', editFamilyCpf);
      setIsCpfFormOpen(false);
      const formData = convertFamilyResponseToFormData(
        data.family,
        data.autisticChildren,
      );
      setUpdateFamilyData(data);
      form.reset(formData, { keepDefaultValues: true });
    },
    onError: () => {
      toast.error('CPF ou permissão para editar inválidos');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!isLastStep) return;

    const convertedData = convertFormToRequest(data);

    if (edit) {
      if (!updateFamilyData || !token) return;
      console.log('🚀 ~ useFamilyRegistration ~ convertedData:', convertedData);

      mutationUpdate.mutate({
        ...convertedData,
        id: updateFamilyData.family.id,
        token,
        autistic_children: data.children.map((child) => {
          const childFound = updateFamilyData.autisticChildren.find(
            ({ fullName }) => fullName === child.fullName,
          );

          return {
            ...child,
            birthDate:
              child.birthDate instanceof Date
                ? child.birthDate.toISOString().split('T')[0]
                : child.birthDate,
            comorbidities: child.comorbidities.join(','),
            id: childFound!.id,
            multiprofessionalSupport: child.multiprofessionalSupport === 'sim',
            usesMedication: child.usesMedication === 'sim',
          };
        }),
      });
      return;
    }

    mutationCreate.mutate(convertedData);
  });

  const handleConfirmEditCpf = () => {
    if (!token) return;
    if (!editFamilyCpf || editFamilyCpf.length < 11) {
      toast.error('CPF inválido.');
      return;
    }

    mutationConfirmCpf.mutate({ cpf: editFamilyCpf, token });
  };

  const isLastStep = safeStep === totalSteps - 1;
  const isFirstStep = safeStep === 0;
  const progress = ((safeStep + 1) / totalSteps) * 100;

  return {
    form,
    fields,
    isPending: mutationCreate.isPending,
    isSuccess,
    steps,
    currentStep: safeStep,
    activeStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    editFamilyCpf,
    isCpfFormOpen,
    isConfirmingCpf: mutationConfirmCpf.isPending,
    handleConfirmEditCpf,
    onSubmit,
    setIsCpfFormOpen,
    setEditFamilyCpf,
    goNext,
    goPrev,
  };
}
