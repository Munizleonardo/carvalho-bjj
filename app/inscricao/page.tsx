"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { CardPaymentForm } from "@/app/_components/CardPaymentForm";
import { AthleteDetailsSection } from "@/app/_components/inscricao/AthleteDetailsSection";
import { AthleteInfoSection } from "@/app/_components/inscricao/AthleteInfoSection";
import { ModalitiesSection } from "@/app/_components/inscricao/ModalitiesSection";
import { TermsSection } from "@/app/_components/inscricao/TermsSection";
import { Button } from "@/app/_components/ui/button";
import { Form } from "@/app/_components/ui/form";
import {
  isFestivalAthlete,
  splitPhoneParts,
} from "@/app/_components/inscricao/constants";
import { createParticipant } from "@/app/_lib/actions/createParticipante";
import {
  getDivisionLabel,
  resolveCategoryByAgeGenderWeight,
} from "@/app/_lib/weight-categories";
import {
  formSchema,
  getDefaultFormValues,
  type FormValues,
} from "@/app/inscricao/form-schema";

function InscricaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cpfFromQuery = searchParams.get("cpf");

  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [registrationId, setRegistrationId] = React.useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<"pix" | "card" | null>(null);
  const [pixData, setPixData] = React.useState<{
    qrCodeBase64?: string | null;
    pixCopyPaste?: string | null;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
    defaultValues: getDefaultFormValues(cpfFromQuery),
  });

  const age = form.watch("age");
  const gender = form.watch("gender");
  const weight = form.watch("weight_kg");
  const termsAccepted = form.watch("terms");
  const giSelected = form.watch("mod_gi");
  const festivalAthlete = isFestivalAthlete(age);

  const resolvedCategory = React.useMemo(
    () =>
      festivalAthlete
        ? null
        : resolveCategoryByAgeGenderWeight({
            age,
            gender,
            weight,
          }),
    [age, festivalAthlete, gender, weight]
  );

  const divisionLabel = React.useMemo(
    () =>
      festivalAthlete ? "Festival Infantil" : getDivisionLabel(age, gender),
    [age, festivalAthlete, gender]
  );

  React.useEffect(() => {
    if (festivalAthlete) {
      form.setValue("category", null);
      form.setValue("mod_gi", false);
      form.setValue("mod_nogi", false);
      form.setValue("mod_gi_extra", false);
      form.setValue("weight_kg", null);
      return;
    }

    form.setValue("category", resolvedCategory, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [festivalAthlete, form, resolvedCategory]);

  React.useEffect(() => {
    if (!giSelected) {
      form.setValue("mod_gi_extra", false, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [form, giSelected]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);

    try {
      const athleteIsFestival = isFestivalAthlete(values.age);
      const athletePhone = splitPhoneParts(values.phone);
      const needsGuardian = values.age < 18;
      const responsavelPhoneClean = needsGuardian
        ? values.responsavel_telefone?.replace(/\D/g, "") ?? ""
        : "";
      const responsavel_area_code = needsGuardian
        ? responsavelPhoneClean.slice(0, 2)
        : undefined;
      const responsavel_phone_number = needsGuardian
        ? responsavelPhoneClean.slice(2)
        : undefined;

      const id = await createParticipant({
        full_name: values.full_name.trim(),
        cpf: values.cpf.trim(),
        phone_number: athletePhone.phoneNumber,
        area_code: athletePhone.areaCode,
        age: values.age,
        academy: values.academy?.trim(),
        category: athleteIsFestival ? null : values.category,
        weight_kg: athleteIsFestival ? null : values.weight_kg,
        belt_color: values.belt_color,
        gender: values.gender,
        mod_gi: values.mod_gi,
        mod_nogi: values.mod_nogi,
        mod_gi_extra: values.mod_gi_extra,
        responsavel_name: needsGuardian ? values.responsavel_name?.trim() : undefined,
        responsavel_cpf: needsGuardian ? values.responsavel_cpf?.trim() : undefined,
        responsavel_area_code: needsGuardian ? responsavel_area_code : undefined,
        responsavel_phone_number: needsGuardian ? responsavel_phone_number : undefined,
      });

      setRegistrationId(id);
    } catch (e) {
      console.error(e);
      setServerError(
        e instanceof Error ? e.message : "Não foi possível concluir sua inscrição."
      );
    } finally {
      setSubmitting(false);
    }
  }

  React.useEffect(() => {
    if (paymentMethod !== "pix" || !registrationId) return;

    async function gerarPix() {
      try {
        const res = await fetch("/api/payments/pix", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationId }),
        });

        const data = await res.json();
        setPixData(data);
      } catch (err) {
        console.error("Erro ao gerar PIX:", err);
      }
    }

    gerarPix();
  }, [paymentMethod, registrationId]);

  const [cardPaymentLoading, setCardPaymentLoading] = React.useState(false);
  const [registrationValor, setRegistrationValor] = React.useState(120);

  React.useEffect(() => {
    if (!registrationId || paymentMethod !== "card") return;
    fetch(`/api/cash?id=${encodeURIComponent(registrationId)}`)
      .then((r) => r.json())
      .then((d) => typeof d?.valor === "number" && setRegistrationValor(d.valor))
      .catch(() => {});
  }, [registrationId, paymentMethod]);

  const handleCardSubmit = React.useCallback(
    async (formData: {
      token: string;
      paymentMethodId: string;
      issuerId: string;
      cardholderEmail: string;
      installments: number;
    }) => {
      if (!registrationId) return;
      setCardPaymentLoading(true);
      try {
        const res = await fetch("/api/payments/card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId,
            token: formData.token,
            paymentMethodId: formData.paymentMethodId,
            issuerId: formData.issuerId,
            email: formData.cardholderEmail,
            installments: formData.installments,
          }),
        });
        const result = await res.json();
        if (result.status === "approved") {
          router.push(`/confirmacao?id=${registrationId}`);
        } else {
          alert("Erro no pagamento. Tente novamente.");
        }
      } catch {
        alert("Erro no pagamento. Tente novamente.");
      } finally {
        setCardPaymentLoading(false);
      }
    },
    [registrationId, router]
  );

  if (registrationId && !paymentMethod) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Inscrição realizada!</h2>
          <p className="text-zinc-400 mb-6">Escolha a forma de pagamento para finalizar:</p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 space-y-3">
            <Button
              className="cursor-pointer w-full h-12 rounded-xl bg-red-600 hover:bg-red-500"
              onClick={() => setPaymentMethod("pix")}
            >
              PIX
            </Button>
            <Button
              className="cursor-pointer w-full h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white"
              onClick={() => setPaymentMethod("card")}
            >
              Cartão de Crédito (até 3x)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === "card") {
    return (
      <div className="min-h-screen bg-black text-zinc-100 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Pagamento com cartão</h2>
          <p className="text-zinc-400 mb-6">Preencha os dados do cartão para finalizar</p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 space-y-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => setPaymentMethod(null)}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Trocar forma de pagamento
            </button>
            <CardPaymentForm
              formId="card-form-inscricao"
              amount={registrationValor}
              onSubmit={handleCardSubmit}
              isLoading={cardPaymentLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === "pix") {
    return (
      <div className="min-h-screen bg-black text-zinc-100 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Pagamento com PIX</h2>
          <p className="text-zinc-400 mb-6">Escaneie o QR Code ou copie o código para pagar</p>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 space-y-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300"
              onClick={() => setPaymentMethod(null)}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Trocar forma de pagamento
            </button>
            {pixData?.qrCodeBase64 ? (
              <>
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="rounded-xl bg-white p-2 w-52 h-52"
                  />
                </div>
                <div>
                  <span className="text-sm text-zinc-400 block mb-2">PIX Copia e Cola</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.pixCopyPaste ?? ""}
                      className="flex-1 rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-100"
                    />
                    <Button
                      className="cursor-pointer bg-red-600 hover:bg-red-500"
                      onClick={() =>
                        pixData?.pixCopyPaste &&
                        navigator.clipboard.writeText(pixData.pixCopyPaste)
                      }
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-zinc-500">Gerando QR Code...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-zinc-100 sm:py-10">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-xl">
        <Link
          className="mb-6 inline-flex items-center gap-2 text-base text-zinc-400 transition-colors hover:text-zinc-100 sm:mb-8 sm:text-xl"
          href="/"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar para o início
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Inscrição</h1>
          <p className="mt-1 text-base text-zinc-400 sm:text-lg">
            Preencha os dados do atleta com atenção. <br />
            Cada detalhe certo aproxima você de uma grande atuação no campeonato.
          </p>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-sm backdrop-blur sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
              Formulário de Inscrição
            </h2>
            <p className="mb-2 mt-1 text-base text-zinc-400 sm:text-lg">
              Finalize este cadastro para seguir ao pagamento e garantir sua vaga no evento.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 sm:gap-8"
            >
              <AthleteInfoSection
                divisionLabel={divisionLabel}
                form={form}
                resolvedCategory={resolvedCategory}
              />

              <AthleteDetailsSection form={form} />

              {serverError && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                  {serverError}
                </div>
              )}

              <ModalitiesSection form={form} />

              <TermsSection form={form} />

              <div className="flex justify-center gap-4">
                <Button
                  className="h-12 cursor-pointer rounded-xl bg-red-600 px-8 hover:bg-red-500"
                  disabled={submitting || !termsAccepted}
                  type="submit"
                >
                  {submitting ? "Enviando..." : "Concluir inscrição"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function InscricaoPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-100">
          Carregando...
        </div>
      }
    >
      <InscricaoContent />
    </React.Suspense>
  );
}
