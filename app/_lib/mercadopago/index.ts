import { MercadoPagoConfig, Payment } from "mercadopago"
import crypto from "crypto"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export const paymentClient = new Payment(client)

interface CreatePixPaymentInput {
  amount: number
  reference: string
}

export async function createPixPayment({
  amount,
  reference,
}: CreatePixPaymentInput) {
  const payment = await paymentClient.create({
    body: {
      transaction_amount: amount,
      description: "Inscrição campeonato",
      payment_method_id: "pix",
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
      external_reference: reference,
      payer: {
        email: "pagador@teste.com",
      },
    },
    
    requestOptions: {
      idempotencyKey: crypto.randomUUID(),
    },
  })

  const transactionData =
    payment.point_of_interaction?.transaction_data

  if (!transactionData) {
    console.error("Resposta completa MP:", payment)
    throw new Error(
      `PIX não gerado. Status: ${payment.status}`
    )
  }

  return {
    paymentId: payment.id, // number
    status: payment.status,
    qrCode: transactionData.qr_code,
    qrCodeBase64: transactionData.qr_code_base64,
    expiresAt: transactionData.qr_code_expiration_date,
  }
}

export async function getPaymentStatus(paymentId: number) {
  const payment = new Payment(client)
  return await payment.get({ id: paymentId })
}

export async function getPaymentById(paymentId: number) {
  const payment = new Payment(client)
  const result = await payment.get({ id: paymentId })

  return {
    id: result.id,
    status: result.status,
  }
}