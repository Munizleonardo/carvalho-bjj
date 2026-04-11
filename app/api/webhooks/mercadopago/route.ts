import { NextResponse } from "next/server";
import { paymentClient } from "@/app/_lib/mercadopago";

export async function POST(req: Request) {

  const body = await req.json();

  if (body.type === "payment") {

    const payment = await paymentClient.get({ id: Number(body.data.id) });

    if (payment.status === "approved") {

      const registrationId = payment.external_reference ?? payment.metadata?.registration_id;

      // atualizar inscrição como paga
      // ex: supabase update payments

    }
  }

  return NextResponse.json({ received: true });
}