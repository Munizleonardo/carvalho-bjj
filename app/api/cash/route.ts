export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("participantes")
    .select("id, nome, wpp, valor_inscricao, mod_gi, mod_nogi, mod_gi_extra")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Participante não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    nome: data.nome,
    wpp: data.wpp,
    valor: data.valor_inscricao,
    mods: { gi: data.mod_gi, nogi: data.mod_nogi, abs: data.mod_gi_extra },
  });
}
