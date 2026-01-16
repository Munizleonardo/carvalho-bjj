"use server";

import { createClient } from "@supabase/supabase-js";
import type { Category, BeltColor, Gender } from "@/app/_lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CreateParticipantInput = {
  full_name: string;
  whatsapp: string;
  age: number;
  academy?: string;
  
  category: Category;
  weight_kg: number;
  belt_color: BeltColor;
  gender: Gender;

console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING"
);

export async function createParticipant(input: CreateParticipantInput) {
  const { data, error } = await supabase
    .from("participantes")
    .insert({
      nome: input.full_name,
      wpp: input.whatsapp,
      idade: input.age,
      academia: input.academy ?? "Não informado",
      categoria: input.category,
      peso: input.weight_kg,
      faixa: input.belt_color,
      sexo: input.gender,
      mod_gi: input.mod_gi,
      mod_nogi: input.mod_nogi,
      mod_gi_extra: input.mod_gi_extra,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}