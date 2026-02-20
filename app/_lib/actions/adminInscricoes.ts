"use server";

import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import type { BeltColor, Category, ParticipantAdmin } from "@/app/_lib/types";

type ParticipanteRow = {
  id: string;
  cpf: string;
  nome: string;
  wpp?: string | null; // legacy column
  area_code?: string | null;
  phone_number?: string | null;
  responsavel_name?: string | null;
  responsavel_area_code?: string | null;
  responsavel_phone_number?: string | null;
  idade: number;
  academia: string | null;
  peso: number | null;
  faixa: BeltColor;
  sexo: "M" | "F";
  categoria: Category | null;
  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;
  festival: boolean;
  created_at: string;
  status: string;
};

function digitsOnly(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function formatPhoneBR(areaCodeRaw?: string | null, phoneRaw?: string | null) {
  const areaCode = digitsOnly(areaCodeRaw);
  const phone = digitsOnly(phoneRaw);

  if (areaCode.length === 2 && (phone.length === 8 || phone.length === 9)) {
    return phone.length === 9
      ? `(${areaCode}) ${phone.slice(0, 5)}-${phone.slice(5)}`
      : `(${areaCode}) ${phone.slice(0, 4)}-${phone.slice(4)}`;
  }

  const merged = digitsOnly(`${areaCodeRaw ?? ""}${phoneRaw ?? ""}`);
  if (merged.length === 11) {
    return `(${merged.slice(0, 2)}) ${merged.slice(2, 7)}-${merged.slice(7)}`;
  }
  if (merged.length === 10) {
    return `(${merged.slice(0, 2)}) ${merged.slice(2, 6)}-${merged.slice(6)}`;
  }

  return null;
}

export async function listParticipantsAdmin(): Promise<ParticipantAdmin[]> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("participantes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as ParticipanteRow[];

  return rows.map((r) => {
    const athletePhone =
      formatPhoneBR(r.area_code, r.phone_number) ??
      formatPhoneBR(null, r.wpp) ??
      r.wpp ??
      "-";

    const responsavelPhone = formatPhoneBR(
      r.responsavel_area_code,
      r.responsavel_phone_number
    );

    return {
      id: r.id,
      cpf: r.cpf,
      full_name: r.nome,
      responsavel_name: r.responsavel_name?.trim() || null,
      responsavel_phone: responsavelPhone,
      phone_number: athletePhone,
      whatsapp: athletePhone,
      area_code: r.area_code ?? null,
      age: r.idade,
      weight_kg: r.peso,
      belt_color: r.faixa,
      gender: r.sexo,
      category: r.categoria,
      academy: r.academia,
      mod_gi: Boolean(r.mod_gi),
      mod_nogi: Boolean(r.mod_nogi),
      mod_abs: Boolean(r.mod_gi_extra), // mod_gi_extra no banco = mod_abs na aplicacao
      festival: Boolean(r.festival),
      created_at: r.created_at,
      status: r.status,
    };
  });
}

export async function deleteParticipantAdmin(id: string): Promise<void> {
  const supabase = supabaseAdmin();

  const { error } = await supabase.from("participantes").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
