import { z } from 'zod';
import { commonFieldSchema, isValidCPF } from './common';

export const respondentEnum = z.enum(
  ['mae', 'pai', 'madrasta', 'padrasto', 'irmao', 'outro'],
  { error: 'Selecione uma opção' },
);

export const familyIncomeEnum = z.enum(
  ['1_salario', 'ate_2_salarios', 'ate_3_salarios', 'acima_3_salarios'],
  { error: 'Selecione uma opção' },
);

export const yesNoEnum = z.enum(['sim', 'nao'], {
  error: 'Selecione uma opção',
});

export const bpcEnum = z.enum(['sim', 'nao', 'em_processo'], {
  error: 'Selecione uma opção',
});

export const residenceTypeEnum = z.enum(
  ['proprio', 'alugado', 'cedido', 'outro'],
  { error: 'Selecione uma opção' },
);

export const genderEnum = z.enum(['feminino', 'masculino'], {
  error: 'Selecione uma opção',
});

export const autismConditionEnum = z.enum(
  ['diagnosticado', 'em_avaliacao', 'com_suspeita', 'nenhuma'],
  { error: 'Selecione uma opção' },
);

export const supportLevelEnum = z.enum(
  ['nivel_1', 'nivel_2', 'nivel_3', 'nao_sei', 'sem_diagnostico'],
  { error: 'Selecione uma opção' },
);

export const comorbidityEnum = z.enum(['tdah', 'tod', 'outros', 'nenhuma']);

export const childSchema = z
  .object({
    fullName: commonFieldSchema('Informe o nome completo'),
    birthDate: z.date({ error: 'Informe a data de nascimento' }),
    gender: genderEnum,
    motherName: commonFieldSchema('Informe o nome da mãe'),
    fatherName: commonFieldSchema('Informe o nome do pai'),
    autismCondition: autismConditionEnum,
    supportLevel: supportLevelEnum,
    comorbidities: z
      .array(comorbidityEnum)
      .min(1, 'Selecione ao menos uma opção'),
    comorbiditiesOther: z.string().trim().optional(),
    multiprofessionalSupport: yesNoEnum,
    usesMedication: yesNoEnum,
    medicationNames: z.string().trim().optional(),
    schoolGrade: commonFieldSchema('Informe a série/ano'),
    schoolName: commonFieldSchema('Informe a escola/colégio'),
  })
  .superRefine((data, ctx) => {
    if (data.comorbidities.includes('outros') && !data.comorbiditiesOther) {
      ctx.addIssue({
        code: 'custom',
        path: ['comorbiditiesOther'],
        message: 'Especifique a comorbidade',
      });
    }
    if (data.usesMedication === 'sim' && !data.medicationNames) {
      ctx.addIssue({
        code: 'custom',
        path: ['medicationNames'],
        message: 'Informe o nome das medicações',
      });
    }
  });

export const familySchema = z
  .object({
    email: z.email('E-mail inválido').trim().max(255),
    respondent: respondentEnum,
    respondentOther: z.string().trim().optional(),
    respondentCpf: commonFieldSchema('Informe o CPF')
      .max(14, 'CPF inválido')
      .refine((value) => isValidCPF(value), {
        message: 'CPF inválido',
      }),
    familyIncome: familyIncomeEnum,
    imageAuthorization: yesNoEnum,
    numberOfChildren: z
      .number({
        error: 'Informe o número de filhos',
      })
      .int('Deve ser um número inteiro')
      .min(1, 'Mínimo 1 filho')
      .max(10, 'Máximo 10 filhos'),
    children: z.array(childSchema).min(1, 'Cadastre ao menos um filho'),
    residenceType: residenceTypeEnum,
    residenceTypeOther: z.string().trim().optional(),
    cep: z.string().trim().optional(),
    street: commonFieldSchema('Informe a rua'),
    number: commonFieldSchema('Informe o número'),
    neighborhood: commonFieldSchema('Informe o bairro/distrito'),
    referencePoint: z.string().trim().optional(),
    motherPhone: commonFieldSchema('Informe o telefone da mãe'),
    fatherPhone: z.string().trim().optional(),
    stepParentName: z.string().trim().optional(),
    bpc: bpcEnum,
    crasRegistration: yesNoEnum,
    municipalCard: yesNoEnum,
    ciptea: yesNoEnum,
  })
  .superRefine((data, ctx) => {
    if (data.respondent === 'outro' && !data.respondentOther) {
      ctx.addIssue({
        code: 'custom',
        path: ['respondentOther'],
        message: 'Especifique quem está respondendo',
      });
    }
    if (data.residenceType === 'outro' && !data.residenceTypeOther) {
      ctx.addIssue({
        code: 'custom',
        path: ['residenceTypeOther'],
        message: 'Especifique o tipo de residência',
      });
    }
    if (data.children.length !== data.numberOfChildren) {
      ctx.addIssue({
        code: 'custom',
        path: ['children'],
        message: 'Quantidade de filhos não corresponde ao informado',
      });
    }
  });
