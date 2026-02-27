import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

export async function GET() {
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("participantes")
    .select("id, nome, idade, peso, faixa, categoria, status")
    .eq("status", "paid")
    .order("nome", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
