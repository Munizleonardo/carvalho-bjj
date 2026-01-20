export const runtime = "nodejs";
import { getPaymentById } from "@/app/_lib/mercadopago";
import { supabaseAdmin } from "@/app/_lib/supabase/admin";
import { NextResponse } from "next/server";

type MercadoPagoWebhookPayload = {
  action?: string;
  data?: {
    id?: string;
  };
  type?: string;
};

export async function GET() {
  return new Response("OK", { status: 200 });
}

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
  const payment = await getPaymentById(Number(paymentId));

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
    .select("id, registration_id")
    .eq("gateway_payment_id", paymentId)
    .single();

  if (!localPayment) {
    return NextResponse.json(
      { error: "Pagamento não registrado localmente" },
      { status: 404 }
    );
  }

  if (status === "approved") {
    await sb
      .from("participantes")
      .update({
        status: "paid",
      })
      .eq("id", localPayment.registration_id);

      await sb
      .from("payments")
      .update({
        status,
        paid_at: new Date().toISOString(),
      })
      .eq("id", localPayment.id);
  }

  return NextResponse.json({ ok: true });
}
