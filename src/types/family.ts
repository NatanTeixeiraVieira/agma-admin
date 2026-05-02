import { familySchema } from '@/validations/schemas/family';
import z from 'zod';

export type FamilyFormData = z.infer<typeof familySchema>;

export type AutisticChildRequest = {
  fullName: string;
  birthDate: string;
  gender: string;
  motherName: string;
  fatherName: string;
  autismCondition: string;
  supportLevel: string;
  comorbidities: string;
  comorbiditiesOther?: string;
  multiprofessionalSupport: boolean;
  usesMedication: boolean;
  medicationNames?: string;
  schoolGrade: string;
  schoolName: string;
};

export type CreateFamilyRequest = {
  email: string;
  respondent: string;
  respondentOther?: string;
  respondentCpf: string;
  familyIncome: string;
  imageAuthorization: boolean;
  numberOfChildren: string;
  residenceType: string;
  residenceTypeOther?: string;
  cep?: string;
  street: string;
  number: string;
  neighborhood: string;
  referencePoint?: string;
  motherPhone: string;
  fatherPhone?: string;
  stepParentName?: string;
  bpc: string;
  crasRegistration: boolean;
  municipalCard: boolean;
  ciptea: boolean;
  autistic_children: AutisticChildRequest[];
};

export type CreateFamilyResponse = {
  family: {
    id: string;
  };
};
