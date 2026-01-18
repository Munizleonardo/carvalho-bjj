export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import { getPaymentById } from "@/app/_lib/mercadopago";

type MercadoPagoWebhookPayload = {
  action?: string;
  data?: {
    id?: string;
  };
  type?: string;
};

export async function POST(req: Request) {
  let payload: MercadoPagoWebhookPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }

  const paymentId = payload?.data?.id;

  if (!paymentId) {
    // Mercado Pago envia vários eventos irrelevantes
    return NextResponse.json({ ok: true });
  }

  const sb = supabaseAdmin();

  // Busca pagamento direto no Mercado Pago (fonte da verdade)
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    return NextResponse.json(
      { error: "Pagamento não encontrado no gateway" },
      { status: 404 }
    );
  }

  const status = payment.status; // approved | pending | cancelled | rejected

  // Busca o pagamento no banco
  const { data: localPayment } = await sb
    .from("payments")
    .select("id, registration_id, status")
    .eq("gateway_payment_id", paymentId)
    .single();

  if (!localPayment) {
    return NextResponse.json(
      { error: "Pagamento não registrado localmente" },
      { status: 404 }
    );
  }

  // Atualiza status do pagamento
  await sb
    .from("payments")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", localPayment.id);

  // Se aprovado, marca inscrição como paga
  if (status === "approved") {
    await sb
      .from("registrations")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("id", localPayment.registration_id);
  }

  return NextResponse.json({ ok: true });
}
