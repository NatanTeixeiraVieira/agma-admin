import {
  Autistic,
  CreateAutisticChildRequest,
  CreateFamilyRequest,
  Family,
  FamilyFormData,
} from '@/types/family';

export const convertAutisticToChild = (autistic: Autistic) => {
  return {
    fullName: autistic.fullName,
    birthDate: new Date(autistic.birthDate),
    gender: autistic.gender as 'feminino' | 'masculino',
    motherName: autistic.motherName,
    fatherName: autistic.fatherName,
    autismCondition: autistic.autismCondition as never,
    supportLevel: autistic.supportLevel as never,
    comorbidities: autistic.comorbidities
      ? autistic.comorbidities.split(',')
      : ([] as any),
    comorbiditiesOther: autistic.comorbiditiesOther ?? '',
    multiprofessionalSupport: autistic.multiprofessionalSupport ? 'sim' : 'nao',
    usesMedication: autistic.usesMedication ? 'sim' : 'nao',
    medicationNames: autistic.medicationNames ?? '',
    schoolGrade: autistic.schoolGrade,
    schoolName: autistic.schoolName,
  } as const;
};

export const convertFamilyResponseToFormData = (
  family: Family,
  autisticChildren: Autistic[],
) => {
  return {
    email: family.email,
    respondent: family.respondent as FamilyFormData['respondent'],
    respondentOther: family.respondentOther ?? '',
    respondentCpf: family.respondentCpf,
    familyIncome: family.familyIncome as FamilyFormData['familyIncome'],
    imageAuthorization: family.imageAuthorization ? 'sim' : 'nao',
    numberOfChildren: Number(family.numberOfChildren),
    children: autisticChildren.map(convertAutisticToChild),
    residenceType: family.residenceType as FamilyFormData['residenceType'],
    residenceTypeOther: family.residenceTypeOther ?? '',
    cep: family.cep ?? '',
    street: family.street,
    number: family.number,
    neighborhood: family.neighborhood,
    referencePoint: family.referencePoint ?? '',
    motherPhone: family.motherPhone,
    fatherPhone: family.fatherPhone ?? '',
    stepParentName: family.stepParentName ?? '',
    bpc: family.bpc as FamilyFormData['bpc'],
    crasRegistration: family.crasRegistration ? 'sim' : 'nao',
    municipalCard: family.municipalCard ? 'sim' : 'nao',
    ciptea: family.ciptea ? 'sim' : 'nao',
  } as const;
};

function convertChildToRequest(
  child: FamilyFormData['children'][number],
): CreateAutisticChildRequest {
  return {
    fullName: child.fullName,
    birthDate:
      child.birthDate instanceof Date
        ? child.birthDate.toISOString().split('T')[0]
        : child.birthDate,
    gender: child.gender,
    motherName: child.motherName,
    fatherName: child.fatherName,
    autismCondition: child.autismCondition,
    supportLevel: child.supportLevel,
    comorbidities: child.comorbidities.join(','),
    comorbiditiesOther: child.comorbiditiesOther || undefined,
    multiprofessionalSupport: child.multiprofessionalSupport === 'sim',
    usesMedication: child.usesMedication === 'sim',
    medicationNames: child.medicationNames || undefined,
    schoolGrade: child.schoolGrade,
    schoolName: child.schoolName,
  };
}

export function convertFormToRequest(
  form: FamilyFormData,
): CreateFamilyRequest {
  return {
    email: form.email,
    respondent: form.respondent,
    respondentOther: form.respondentOther || undefined,
    respondentCpf: form.respondentCpf,
    familyIncome: form.familyIncome,
    imageAuthorization: form.imageAuthorization === 'sim',
    numberOfChildren: String(form.numberOfChildren),
    residenceType: form.residenceType,
    residenceTypeOther: form.residenceTypeOther || undefined,
    cep: form.cep || undefined,
    street: form.street,
    number: form.number,
    neighborhood: form.neighborhood,
    referencePoint: form.referencePoint || undefined,
    motherPhone: form.motherPhone,
    fatherPhone: form.fatherPhone || undefined,
    stepParentName: form.stepParentName || undefined,
    bpc: form.bpc,
    crasRegistration: form.crasRegistration === 'sim',
    municipalCard: form.municipalCard === 'sim',
    ciptea: form.ciptea === 'sim',
    autistic_children: form.children.map(convertChildToRequest),
  };
}
