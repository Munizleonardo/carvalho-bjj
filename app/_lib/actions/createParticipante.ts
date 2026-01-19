"use server";

import type { Category, BeltColor, Gender } from "@/app/_lib/types";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

type CreateParticipantInput = {
  full_name: string;
  cpf: string;
  phone_number: string;
  area_code: string;
  age: number;
  academy?: string;
  
  category?: Category | null;
  weight_kg?: number | null;
  belt_color: BeltColor;
  gender: Gender;

  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;
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
  const sb = await supabaseAdmin();
  console.log("SB TYPE:", typeof sb, sb);

  const isFestival = input.age <= 8;

  const categoriaFinal = isFestival ? null : input.category;
  const pesoFinal = isFestival ? null : input.weight_kg;

  const valor = calcFee({
    mod_gi: input.mod_gi,
    mod_nogi: input.mod_nogi,
    mod_gi_extra: input.mod_gi_extra,
    festival: isFestival,
  });

  const { data, error } = await sb
    .from("participantes")
    .insert({
      nome: input.full_name,
      cpf: input.cpf,
      phone_number: input.phone_number,
      area_code: input.area_code,
      idade: input.age,
      academia: input.academy ?? null,
      categoria: categoriaFinal,
      peso: pesoFinal,
      faixa: input.belt_color ?? null,
      sexo: input.gender ?? null,
      mod_gi: input.mod_gi,
      mod_nogi: input.mod_nogi,
      mod_gi_extra: input.mod_gi_extra,
      festival: isFestival,
      valor_inscricao: valor,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}