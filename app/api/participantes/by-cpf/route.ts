import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { cpf } = await req.json();

    if (!cpf) {
      return NextResponse.json(
        { error: "CPF não informado" },
        { status: 400 }
      );
    }

    const normalizedCpf = cpf.replace(/\D/g, "");

    const { data, error } = await supabase
      .from("participantes")
      .select("*")
      .eq("cpf", normalizedCpf)
      .maybeSingle();

    if (error) {
      console.error("Erro Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao consultar CPF" },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? null, { status: 200 });
  } catch (err) {
    console.error("Erro API CPF:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

