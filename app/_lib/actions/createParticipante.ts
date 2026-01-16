"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type CreateParticipantInput = {
  full_name: string;
  whatsapp: string;
  age: number;
  academy?: string;
  category: string;
  weight_kg: number | undefined,
  belt_color: string;
  gender: "M" | "F";
};

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
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}