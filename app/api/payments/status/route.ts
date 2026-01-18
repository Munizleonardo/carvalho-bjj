import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const registrationId = searchParams.get("registrationId");

  if (!registrationId) {
    return NextResponse.json(
      { error: "registrationId é obrigatório" },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("payments")
    .select("status")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Pagamento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: data.status, // pending | approved | rejected | cancelled
  });
}
