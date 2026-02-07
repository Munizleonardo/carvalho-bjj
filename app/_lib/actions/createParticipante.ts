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

  const valor = calcFee({
    mod_gi: input.mod_gi,
    mod_nogi: input.mod_nogi,
    mod_gi_extra: input.mod_gi_extra,
    festival: isFestival,
  });

  const payload = {
    created_at: new Date().toISOString(),
    nome: input.full_name,
    cpf: input.cpf,
    phone_number: input.phone_number,
    area_code: input.area_code,
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
          responsavel_name: input.responsavel_name ?? null,
          responsavel_cpf: input.responsavel_cpf ?? null,
          responsavel_telefone: input.responsavel_telefone ?? null,
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


