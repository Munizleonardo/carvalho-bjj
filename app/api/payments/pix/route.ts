export const runtime = "nodejs";
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
    .from("participantes")
    .select("id, valor_inscricao, nome, area_code, phone_number")
    .eq("id", registrationId)
    .single();

  if (error || !registration) {
    console.error("Erro ao buscar inscrição (Supabase):", error);
    return NextResponse.json(
      { error: "Inscrição não encontrada" },
      { status: 404 }
    );
  }

  console.log(`${process.env.APP_URL}/api/webhooks/mercadopago`);

  const { data: openPayment } = await sb
    .from("payments")
    .select("*")
    .eq("registration_id", registrationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (openPayment) {
    // retorna PIX existente
    return NextResponse.json({
      pixCopyPaste: openPayment.pix_copy_paste,
      qrCodeBase64: openPayment.qr_code_base64,
      status: openPayment.status,
    });
  }

  const payment = await createPixPayment({
    amount: registration.valor_inscricao,
    reference: registration.id,
    name: registration.nome,
    areaCode: registration.area_code || undefined,
    phoneNumber: registration.phone_number || undefined,
  });

  const { error: insertError } = await sb.from("payments").insert({
    registration_id: registration.id,
    gateway: "mercadopago",
    gateway_payment_id: payment.paymentId,
    amount_cents: Math.round(registration.valor_inscricao * 100),
    status: "pending",
    pix_qr_code_base64: payment.qrCodeBase64,
    pix_copy_paste: payment.qrCode,
  });

  if (insertError) {
    console.error("Erro ao salvar pagamento no banco:", insertError);
    return NextResponse.json(
      { error: "Erro ao registrar pagamento" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    qrCodeBase64: payment.qrCodeBase64,
    pixCopyPaste: payment.qrCode,
    status: payment.status,
  });
}