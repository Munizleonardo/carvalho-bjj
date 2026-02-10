import crypto from "crypto";
import { MercadoPagoConfig, Payment } from "mercadopago";

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
  if (!process.env.APP_URL) throw new Error("APP_URL não definida");
  if (!/^https?:\/\/.+/.test(process.env.APP_URL)) throw new Error("APP_URL inválida");

  // Mercado Pago não aceita localhost - só envia notification_url se for URL pública
  const isLocalhost = process.env.APP_URL.includes("localhost") || process.env.APP_URL.includes("127.0.0.1");
  const notificationUrl = isLocalhost 
    ? undefined 
    : `${process.env.APP_URL}/api/webhooks/mercadopago`;

  const digitsOnly = (value?: string) => (value ?? "").replace(/\D/g, "");

  const areaDigits = digitsOnly(areaCode);
  const phoneDigitsRaw = digitsOnly(phoneNumber);
  const phoneHasDdd = phoneDigitsRaw.length === 10 || phoneDigitsRaw.length === 11;

  const payerAreaCode =
    phoneHasDdd ? phoneDigitsRaw.slice(0, 2) : areaDigits.length === 2 ? areaDigits : "11";
  const payerNumber =
    phoneHasDdd
      ? phoneDigitsRaw.slice(2)
      : phoneDigitsRaw.length === 8 || phoneDigitsRaw.length === 9
        ? phoneDigitsRaw
        : "999999999";

  const paymentBody: {
    transaction_amount: number;
    description: string;
    payment_method_id: string;
    external_reference: string;
    notification_url?: string;
    payer: { 
      email: string; 
      first_name: string;
      phone: { area_code: string; number: string };
    };
  } = {
    transaction_amount: amount,
    description: "Inscrição campeonato",
    payment_method_id: "pix",
    external_reference: reference,
    payer: { 
      email: "pagador@teste.com", 
      first_name: name,
      phone: { area_code: payerAreaCode, number: payerNumber },
    },
  };

  // Só adiciona notification_url se não for localhost
  if (notificationUrl) {
    paymentBody.notification_url = notificationUrl;
  }

  const payment = await paymentClient.create({
    body: paymentBody,
    requestOptions: { idempotencyKey: crypto.randomUUID() },
  });

  const transactionData = payment.point_of_interaction?.transaction_data;


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
    external_reference: result.external_reference,
  };
}
