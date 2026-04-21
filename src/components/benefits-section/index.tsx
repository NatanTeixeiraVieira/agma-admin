import { RadioField } from '@/components/radio-fields';

const yesNoOptions = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

const bpcOptions = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
  {
    value: 'em_processo',
    label: 'Não (mas está em processo na Justiça Federal)',
  },
];

export function BenefitsSection() {
  return (
    <div className="space-y-6">
      <RadioField
        name="bpc"
        label="Pessoa autista recebe o Benefício de Prestação Continuada?"
        options={bpcOptions}
        required
      />

      <RadioField
        name="crasRegistration"
        label="Família possui Cadastro Único realizado no CRAS?"
        options={yesNoOptions}
        required
      />

      <RadioField
        name="municipalCard"
        label="Pessoa na condição Autista possui Carteira de Identificação Municipal solicitada no CAPS II?"
        options={yesNoOptions}
        required
      />

      <RadioField
        name="ciptea"
        label="Pessoa na condição Autista possui Carteira de Identificação da Pessoa Autista (CIPTEA) solicitada pela internet?"
        options={yesNoOptions}
        required
      />
    </div>
  );
}
