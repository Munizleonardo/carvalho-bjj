"use server";

import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import type { BeltColor, Category, Gender } from "@/app/_lib/types";

type CreateParticipantInput = {
  full_name: string;
  cpf: string;
  phone_number: string;
  area_code: string;
  age: number;
  academy?: string;

  category: Category | null;
  weight_kg: number | null;
  belt_color: BeltColor;
  gender: Gender;

  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;

  responsavel_name?: string;
  responsavel_cpf?: string;
  responsavel_telefone?: string;
};

function digitsOnly(value: string) {
  return (value ?? "").replace(/\D/g, "");
}

function normalizeFullNameUppercase(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleUpperCase("pt-BR");
}

function formatPhoneBRFromParts(areaCodeRaw: string, phoneNumberRaw: string) {
  const areaCodeDigits = digitsOnly(areaCodeRaw).slice(-2);
  const phoneDigitsRaw = digitsOnly(phoneNumberRaw);

  let areaCode = areaCodeDigits;
  let phoneDigits = phoneDigitsRaw;

  // Se o usuário digitou o telefone com DDD no campo errado, tenta corrigir.
  if (phoneDigitsRaw.length === 10 || phoneDigitsRaw.length === 11) {
    areaCode = phoneDigitsRaw.slice(0, 2);
    phoneDigits = phoneDigitsRaw.slice(2);
  }

  if (!/^\d{2}$/.test(areaCode)) throw new Error("DDD inválido");
  if (!(phoneDigits.length === 8 || phoneDigits.length === 9)) throw new Error("Telefone inválido");

  const formatted =
    phoneDigits.length === 9
      ? `(${areaCode}) ${phoneDigits.slice(0, 5)}-${phoneDigits.slice(5)}`
      : `(${areaCode}) ${phoneDigits.slice(0, 4)}-${phoneDigits.slice(4)}`;

  return { areaCode, formatted };
}

function formatPhoneBR(value: string) {
  const digits = digitsOnly(value);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 8 || digits.length === 9) {
    throw new Error("Informe o telefone com DDD (ex: (11) 91234-5678)");
  }
  throw new Error("Telefone inválido");
}

function calcFee({
  mod_gi,
  mod_nogi,
  mod_gi_extra,
  festival,
}: {
  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;
  festival: boolean;
}) {
  // Primeira modalidade = R$ 100
  // Cada modalidade adicional = +R$ 50
  const modalidades = [mod_gi, mod_nogi, mod_gi_extra, festival].filter(Boolean).length;
  if (modalidades === 0) return 0;
  if (modalidades === 1) return 100;
  // 2 ou mais modalidades: 100 + (modalidades - 1) * 50
  return 100 + (modalidades - 1) * 50;
}

export async function createParticipant(input: CreateParticipantInput) {
  const sb = supabaseAdmin();

  const isFestival = input.age < 8;

  const athletePhone = formatPhoneBRFromParts(input.area_code, input.phone_number);
  const responsavelTelefone = input.responsavel_telefone?.trim()
    ? formatPhoneBR(input.responsavel_telefone)
    : undefined;

  const valor = calcFee({
    mod_gi: input.mod_gi,
    mod_nogi: input.mod_nogi,
    mod_gi_extra: input.mod_gi_extra,
    festival: isFestival,
  });

  const payload = {
    created_at: new Date().toISOString(),
    nome: normalizeFullNameUppercase(input.full_name),
    cpf: input.cpf,
    phone_number: athletePhone.formatted,
    area_code: athletePhone.areaCode,
    idade: input.age,
    academia: input.academy ?? null,
    ...(isFestival ? {} : { categoria: input.category, peso: input.weight_kg }),
    faixa: input.belt_color ?? null,
    sexo: input.gender ?? null,
    mod_gi: input.mod_gi,
    mod_nogi: input.mod_nogi,
    mod_gi_extra: input.mod_gi_extra,
    festival: isFestival,
    valor_inscricao: valor,
    ...(isFestival
      ? {
          responsavel_name: input.responsavel_name?.trim()
            ? normalizeFullNameUppercase(input.responsavel_name)
            : null,
          responsavel_cpf: input.responsavel_cpf ?? null,
          responsavel_telefone: responsavelTelefone ?? null,
        }
      : {}),
  };

  const { data, error } = await sb
    .from("participantes")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("createParticipant insert error:", {
      isFestival,
      error,
      payload,
    });
    throw new Error(error?.message ?? "Erro ao criar inscrição");
  }

  return data.id as string;
}


