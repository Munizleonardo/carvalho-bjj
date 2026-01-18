import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import { createPixPayment } from "@/app/_lib/mercadopago";

export async function POST(req: Request) {
  const { registrationId } = await req.json();

  if (!registrationId) {
    return NextResponse.json(
      { error: "registrationId obrigatório" },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  const { data: registration, error } = await sb
    .from("registrations")
    .select("id, valor")
    .eq("id", registrationId)
    .single();

  if (error || !registration) {
    return NextResponse.json(
      { error: "Inscrição não encontrada" },
      { status: 404 }
    );
  }

  const payment = await createPixPayment({
    amount: registration.valor,
    reference: registration.id,
  });

  await sb.from("payments").insert({
    registration_id: registration.id,
    gateway: "mercadopago",
    gateway_payment_id: payment.id,
    amount_cents: Math.round(registration.valor * 100),
    status: "pending",
    pix_qr_code_base64: payment.qr_code_base64,
    pix_copy_paste: payment.qr_code,
  });

  return NextResponse.json({
    qrCodeBase64: payment.qr_code_base64,
    copyPaste: payment.qr_code,
  });
}
