import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";

if (!process.env.APP_URL) throw new Error("APP_URL não definida");
if (!/^https?:\/\/.+/.test(process.env.APP_URL)) throw new Error("APP_URL inválida");

const notificationUrl = `${process.env.APP_URL}/api/webhooks/mercadopago`;

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export const paymentClient = new Payment(client);

interface CreatePixPaymentInput {
  amount: number;
  reference: string;
  name: string;
  areaCode?: string;
  phoneNumber?: string;
}

export async function createPixPayment({ amount, reference, name, areaCode, phoneNumber }: CreatePixPaymentInput) {
  const payment = await paymentClient.create({
    body: {
      transaction_amount: amount,
      description: "Inscrição campeonato",
      payment_method_id: "pix",
      notification_url: notificationUrl,
      external_reference: reference,
      payer: { 
        email: "pagador@teste.com", 
        first_name: name,
        phone: { area_code: "11", number: "999999999" },
      },
    },
    requestOptions: { idempotencyKey: crypto.randomUUID() },
  });

  const transactionData = payment.point_of_interaction?.transaction_data;

  console.log("Payment completo Mercado Pago:", JSON.stringify(payment, null, 2));

  if (!transactionData) {
    console.error("Resposta completa MP:", payment);
    throw new Error(`PIX não gerado. Status: ${payment.status || "undefined"}`);
  }

  return {
    paymentId: payment.id,
    status: payment.status,
    qrCode: transactionData.qr_code,
    qrCodeBase64: transactionData.qr_code_base64,
    pixCopyPaste: transactionData.qr_code,
    expiresAt: payment.date_of_expiration,
  };
}

export async function getPaymentStatus(paymentId: number) {
  const result = await paymentClient.get({ id: paymentId });
  return result;
}

export async function getPaymentById(paymentId: number) {
  const result = await paymentClient.get({ id: paymentId });
  return {
    id: result.id,
    status: result.status,
  };
}