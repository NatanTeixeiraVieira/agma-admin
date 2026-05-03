import { familySchema } from '@/validations/schemas/family';
import z from 'zod';
import { Pagination } from './pagination';

export type FamilyFormData = z.infer<typeof familySchema>;

export type CreateAutisticChildRequest = {
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
  autistic_children: CreateAutisticChildRequest[];
};

export type CreateFamilyResponse = {
  family: {
    id: string;
  };
};

export type UpdateAutisticChildRequest = {
  id: string;
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

export type UpdateFamilyRequest = {
  id: string;
  token: string;
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
  autistic_children: UpdateAutisticChildRequest[];
};

export type UpdateFamilyAdminRequest = Omit<UpdateFamilyRequest, 'token'>;

export type FindAllFamiliesPaginatedOptions = {
  page?: number;
  limit?: number;
};

export type Family = {
  id: string;
  email: string;
  respondent: string;
  respondentOther?: string;
  respondentCpf: string;
  familyIncome: string;
  imageAuthorization: boolean;
  numberOfChildren: string;
  residenceType: string;
  residenceTypeOther?: string;
  cep?: string | null;
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
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  currentVersion?: number;
};

export type Autistic = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type CompleteFamily = {
  family: Family;
  autisticChildren: Autistic[];
};

export type FindAllFamiliesPaginatedResponse = Pagination<CompleteFamily>;
