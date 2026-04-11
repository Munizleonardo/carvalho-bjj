"use client";

import { CardPaymentForm } from "@/app/_components/CardPaymentForm";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { AthleteDetailsSection } from "@/app/_components/inscricao/AthleteDetailsSection";
import { AthleteInfoSection } from "@/app/_components/inscricao/AthleteInfoSection";
import {
  categoryEnum,
  beltEnum,
  type BeltColor,
  type Category,
} from "@/app/_lib/types";

import { phoneMask } from "@/app/_lib/utils";
import { isValidBrazilianCellPhone } from "@/app/_lib/utils";

/** Faixas exclusivas de infantil (até 15 anos); a partir de 16 não se aplicam. */
const YOUTH_ONLY_BELTS: BeltColor[] = ["CINZA", "AMARELA", "LARANJA", "VERDE"];

// -------------------- SCHEMA ZOD --------------------
const formSchema = z.object({
  full_name: z.string().min(3, { message: "Informe o nome completo" }),
  cpf: z.string().min(11, { message: "Informe um CPF válido" }),
  phone: z
    .string()
    .nonempty({ message: "Informe um telefone para contato" })
    .refine(isValidBrazilianCellPhone, {
      message: "Informe um telefone válido com DDD (ex: (11) 98765-4321)",
    }),

  age: z
    .number({ message: "Idade inválida" })
    .int({ message: "Idade deve ser um número inteiro" })
    .min(4, { message: "Idade mínima é 4 anos" })
    .max(90, { message: "Idade máxima é 90 anos" }),

  academy: z.string().optional(),

  mod_gi: z.boolean(),
  mod_nogi: z.boolean(),
  mod_gi_extra: z.boolean(),

  category: z.enum(categoryEnum).nullable(),

  weight_kg: z
    .number({ message: "Peso inválido" })
    .min(10, { message: "Peso mínimo é 10kg" })
    .max(300, { message: "Peso máximo é 300kg" })
    .nullable(),

  belt_color: z.enum(beltEnum),
  gender: z.enum(genderEnum),

  responsavel_name: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),

  terms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos para continuar",
  }),
  }).superRefine((data, ctx) => {
    const isFestivalAge = typeof data.age === "number" && data.age < 8;

    if (!isFestivalAge && !data.mod_gi && !data.mod_nogi) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mod_gi"],
        message: "Selecione pelo menos uma modalidade",
      });
    }

    const isMinor = typeof data.age === "number" && data.age < 18;
    if (isMinor) {
      if (!data.responsavel_name || data.responsavel_name.trim().length < 3) {
        ctx.addIssue({
          path: ["responsavel_name"],
          message: "Informe o nome do responsável legal",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.responsavel_cpf || data.responsavel_cpf.trim().length < 11) {
        ctx.addIssue({
          path: ["responsavel_cpf"],
          message: "Informe o CPF do responsável legal",
          code: z.ZodIssueCode.custom,
        });
      }

      if (
        !data.responsavel_telefone ||
        !isValidBrazilianCellPhone(data.responsavel_telefone)
      ) {
        ctx.addIssue({
          path: ["responsavel_telefone"],
          message:
            "Informe um telefone válido do responsável (ex: (11) 98765-4321)",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (
      typeof data.age === "number" &&
      data.age >= 16 &&
      YOUTH_ONLY_BELTS.includes(data.belt_color)
    ) {
      ctx.addIssue({
        path: ["belt_color"],
        message:
          "Faixas cinza, amarela, laranja e verde são apenas para atletas com menos de 16 anos",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type FormValues = z.infer<typeof formSchema>;

// -------------------- OPTIONS --------------------
const beltOptions = [
  { label: "Cinza", value: "CINZA" as const },
  { label: "Amarela", value: "AMARELA" as const },
  { label: "Laranja", value: "LARANJA" as const },
  { label: "Verde", value: "VERDE" as const },
  { label: "Branca", value: "BRANCA" as const },
  { label: "Azul", value: "AZUL" as const },
  { label: "Roxa", value: "ROXA" as const },
  { label: "Marrom", value: "MARROM" as const },
  { label: "Preta", value: "PRETA" as const },
];

const genderOptions = [
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
];

const categoryOptions: Array<{ label: string; value: Category }> = [
  { label: "Galo", value: "GALO" },
  { label: "Pluma", value: "PLUMA" },
  { label: "Pena", value: "PENA" },
  { label: "Leve", value: "LEVE" },
  { label: "Médio", value: "MEDIO" },
  { label: "Meio Pesado", value: "MEIO_PESADO" },
  { label: "Pesado", value: "PESADO" },
  { label: "Super Pesado", value: "SUPER_PESADO" },
  { label: "Pesadíssimo", value: "PESADISSIMO" },
];

const itemInteractiveClass =
  "cursor-pointer focus:outline-none data-[highlighted]:bg-zinc-900 data-[highlighted]:text-zinc-100 hover:bg-zinc-900/60";

  

// -------------------- COMPONENT --------------------
  isFestivalAthlete,
  splitPhoneParts,
  const cpfFromQuery = searchParams.get("cpf");
  const [registrationId, setRegistrationId] = React.useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<"pix" | "card" | null>(null);
  const [pixData, setPixData] = React.useState<any>(null);

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
      const isFestivalAge = values.age < 8;
      const phoneClean = values.phone.replace(/\D/g, "");
      const area_code = phoneClean.slice(0, 2);
      const phone_number = phoneClean.slice(2);

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
      setServerError(e instanceof Error ? e.message : "Não foi possível concluir sua inscrição.");
    } finally {
      setSubmitting(false);
    }
  }

  const age = form.watch("age");
  const isFestivalAge = typeof age === "number" && age < 8;
  const isMinor = typeof age === "number" && age < 18;

  React.useEffect(() => {
    if (isFestivalAge) {
      form.setValue("category", null);
      form.setValue("mod_gi", false);
      form.setValue("mod_nogi", false);
      form.setValue("mod_gi_extra", false);
      form.setValue("weight_kg", null);
    }
  }, [isFestivalAge, form]);

  React.useEffect(() => {
    if (typeof age !== "number" || age < 16) return;
    const current = form.getValues("belt_color");
    if (current && YOUTH_ONLY_BELTS.includes(current)) {
      form.setValue("belt_color", "BRANCA", { shouldValidate: true });
    }
  }, [age, form]);

  const giSelected = form.watch("mod_gi");

  React.useEffect(() => {
    if (!giSelected) {
      form.setValue("mod_gi_extra", false, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [giSelected, form]);

  // ---------------- PIX GENERATION ----------------
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

  // -------------------- RENDER --------------------

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
          Voltar para o in�cio
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">
            Inscri��o
          </h1>
          <p className="mt-1 text-base text-zinc-400 sm:text-lg">
            Preencha os dados do atleta com atencao. <br />
            Cada detalhe certo aproxima voce de uma grande atuacao no campeonato.
          </p>
        </div>

        <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-sm backdrop-blur sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100 sm:text-xl">
              Formul�rio de Inscri��o
            </h2>
            <p className="mb-2 mt-1 text-base text-zinc-400 sm:text-lg">
              Finalize este cadastro para seguir ao pagamento e garantir sua vaga
              no evento.
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

                {/* phone_number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel className="text-lg text-zinc-200">
                        Telefone (WhatsApp)
                      </FormLabel>
                      <FormControl>
                        <Input
                          inputMode="numeric"
                          placeholder="(22) 9 9999-9999"
                          {...field}
                          className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                          maxLength={15}
                          onChange={(e) => {
                            const value = phoneMask(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Idade */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg w-full flex md:flex-row md:flex text-zinc-200">
                        Idade
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="w-full rounded-xl bg-black/40 border-zinc-800 text-zinc-100 flex focus-visible:ring-red-500/30"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? undefined : Number(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AVISO FESTIVAL */}
                {isFestivalAge && (
                  <div className="flex items-center justify-center rounded-xl border border-yellow-600/50 bg-yellow-950/30 p-4 text-yellow-200">
                    <div className="text-sm">
                      <span className="font-bold text-lg block mb-1">⚠️ Categoria Festival</span>
                      Atletas abaixo de 8 anos participam automaticamente no Festival.
                    </div>
                  </div>
                )}
                {isMinor && (
                  <div className="flex flex-col w-full gap-6 rounded-2xl border border-zinc-700 bg-zinc-950/50 p-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      Dados do Responsável Legal
                    </h3>
                    <p className="text-sm text-zinc-400 -mt-2">
                      Obrigatório para atletas menores de 18 anos.
                    </p>

                    {/* Nome do Responsável */}
                    <FormField
                      control={form.control}
                      name="responsavel_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">
                            Nome do Responsável
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Nome completo do responsável"
                              className="rounded-xl bg-black/40 w-full border-zinc-800 text-zinc-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CPF do Responsável */}
                    <FormField
                      control={form.control}
                      name="responsavel_cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">
                            CPF do Responsável
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="CPF do responsável"
                              className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone do Responsável */}
                    <FormField
                      control={form.control}
                      name="responsavel_telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-200">
                            Telefone do Responsável
                          </FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              {...field}
                              value={field.value ?? ""}
                              placeholder="(22) 9 9999-9999"
                              className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100"
                              maxLength={15}
                              onChange={(e) => {
                                const value = phoneMask(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {/* Categoria */}
                {!isFestivalAge && (
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-lg w-full flex md:flex-row md:flex text-zinc-200">Categoria</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full flex rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                            {categoryOptions.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-8">
                {/* Academia */}
                <FormField
                  control={form.control}
                  name="academy"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">
                        Academia
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Peso */}
                {!isFestivalAge && (
                  <FormField
                    control={form.control}
                    name="weight_kg"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-lg text-zinc-200">Peso</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Faixa e Gênero */}
              <div className="flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name="belt_color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Faixa</FormLabel>
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                          {beltOptions
                            .filter((b) => {
                              if (isFestivalAge) {
                                return [...YOUTH_ONLY_BELTS, "BRANCA"].includes(b.value);
                              }
                              if (typeof age === "number" && age >= 16) {
                                return !YOUTH_ONLY_BELTS.includes(b.value);
                              }
                              return true;
                            })
                            .map((b) => (
                            <SelectItem
                              key={b.value}
                              value={b.value}
                              className={itemInteractiveClass}
                            >
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Gênero</FormLabel>
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                          {genderOptions.map((g) => (
                            <SelectItem
                              key={g.value}
                              value={g.value}
                              className={itemInteractiveClass}
                            >
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Server Error */}
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
                  {submitting ? "Enviando..." : "Concluir inscri��o"}
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
