import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const paymentClient = new Payment(client);

export async function createPixPayment({ amount, reference }: {
  amount: number;
  reference: string;
}) {
  const payment = await paymentClient.create({
    body: {
      transaction_amount: amount,
      description: "Inscrição campeonato",
      payment_method_id: "pix",
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      payer: {
        email: "pagador@teste.com",
        first_name: "Inscrição",
        last_name: "Atleta",
      },
      external_reference: reference,
    },
  });
  
  
  const data = payment.point_of_interaction?.transaction_data;

  if (!data) {
    throw new Error("Dados PIX não retornados pelo Mercado Pago");
  }

  return {
    id: payment.id!,
    qr_code: data.qr_code!,
    qr_code_base64: data.qr_code_base64!,
  };
}

export async function getPaymentStatus(paymentId: string) {
  const payment = new Payment(client);
  const res = await payment.get({ id: paymentId });
  return res;
}

export async function getPaymentById(paymentId: string) {
  const payment = new Payment(client);

  const result = await payment.get({ id: paymentId });

  return {
    id: result.id,
    status: result.status,
  };
}