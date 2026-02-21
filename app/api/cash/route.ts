export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id obrigatorio" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("participantes")
    .select(
      "id, nome, phone_number, area_code, valor_inscricao, mod_gi, mod_nogi, mod_gi_extra, festival"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Participante nao encontrado" }, { status: 404 });
  }

  const wpp = formatPhoneBR(data.area_code, data.phone_number) ?? data.phone_number ?? "-";

  return NextResponse.json({
    id: data.id,
    nome: data.nome,
    wpp,
    valor: data.valor_inscricao,
    mods: {
      gi: Boolean(data.mod_gi),
      nogi: Boolean(data.mod_nogi),
      abs: Boolean(data.mod_gi_extra),
      festival: Boolean(data.festival),
    },
  });
}