"use server";

import type { Category, BeltColor, Gender } from "@/app/_lib/types";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

type CreateParticipantInput = {
  full_name: string;
  whatsapp: string;
  age: number;
  academy?: string;
  
  category: Category;
  weight_kg: number;
  belt_color: BeltColor;
  gender: Gender;

  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;
  festival: boolean;
}

function calcFee({ mod_gi, mod_nogi, mod_gi_extra, festival }: Pick<CreateParticipantInput, "mod_gi" | "mod_nogi" | "mod_gi_extra" | "festival">) {
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

  const valor = calcFee(input);

  const { data, error } = await sb
    .from("participantes")
    .insert({
      nome: input.full_name,
      wpp: input.whatsapp,
      idade: input.age,
      academia: input.academy ?? null,
      categoria: input.category ?? null,
      peso: input.weight_kg ?? null,
      faixa: input.belt_color ?? null,
      sexo: input.gender ?? null,
      mod_gi: input.mod_gi,
      mod_nogi: input.mod_nogi,
      mod_gi_extra: input.mod_gi_extra,
      festival: input.festival,
      valor_inscricao: valor,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}