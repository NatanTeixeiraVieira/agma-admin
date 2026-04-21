import { z } from 'zod';

export const commonFieldSchema = (message: string) =>
  z.string().min(1, message);

export const isValidCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos (todos dígitos iguais)
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const calcCheckDigit = (base: string, factor: number) => {
    let total = 0;

    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (factor - i);
    }

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calcCheckDigit(cleaned.slice(0, 9), 10);
  const digit2 = calcCheckDigit(cleaned.slice(0, 10), 11);

  return digit1 === Number(cleaned[9]) && digit2 === Number(cleaned[10]);
};
