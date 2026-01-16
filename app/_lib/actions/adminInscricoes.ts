"use server";

import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import type { ParticipantAdmin, BeltColor } from "@/app/_lib/types";

type ParticipanteRow = {
  id: string;
  nome: string;
  wpp: string;
  idade: number;
  academia: string | null;
  peso: number;
  faixa: Belt;
  sexo: "M" | "F";
  categoria: string | null;

  mod_gi: boolean;
  mod_nogi: boolean;
  mod_abs: boolean;

  created_at: string;
};

export async function listParticipantsAdmin(): Promise<ParticipantAdmin[]> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("participantes")
    .select("id,nome,wpp,idade,academia,peso,faixa,sexo,categoria,mod_gi,mod_nogi,mod_abs,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as ParticipanteRow[];

  return rows.map((r) => ({
    id: r.id,
    full_name: r.nome,
    whatsapp: r.wpp,
    age: r.idade,
    weight_kg: r.peso,
    belt_color: r.faixa,
    category: r.categoria ?? "",
    academy: r.academia,
    mod_gi: Boolean(r.mod_gi),
    mod_nogi: Boolean(r.mod_nogi),
    mod_abs: Boolean(r.mod_abs),
    created_at: r.created_at,
  }));
}

export async function deleteParticipantAdmin(id: string): Promise<void> {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("participantes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
