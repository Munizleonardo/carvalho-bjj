"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { createParticipant } from "@/app/_lib/actions/createParticipante";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { ArrowLeft } from "lucide-react";

import {
  categoryEnum,
  beltEnum,
  genderEnum,
  type Category,
} from "@/app/_lib/types";

// -------------------- SCHEMA ZOD --------------------
const formSchema = z.object({
  full_name: z.string().min(3, { message: "Informe o nome completo" }),
  whatsapp: z.string().min(8, { message: "Informe um WhatsApp válido" }),

  age: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    },
    z
      .number({ message: "Idade inválida" }) // aqui substituí invalid_type_error por message
      .int({ message: "Idade deve ser um número inteiro" })
      .min(4, { message: "Idade mínima é 4 anos" })
      .max(90, { message: "Idade máxima é 90 anos" })
  ),

  academy: z.string().optional(),

  mod_gi: z.boolean(),
  mod_nogi: z.boolean(),
  mod_gi_extra: z.boolean(),
  festival: z.boolean(),

  category: z.enum(categoryEnum),

  weight_kg: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    },
    z
      .number({ message: "Peso inválido" }) // aqui também
      .min(10, { message: "Peso mínimo é 10kg" })
      .max(300, { message: "Peso máximo é 300kg" })
  ),

  belt_color: z.enum(beltEnum),
  gender: z.enum(genderEnum),
  terms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos para continuar",
  }),
}).superRefine((data, ctx) => {
  if (data.category === "FESTIVAL") {
    if (!data.festival) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["festival"],
        message: "Selecione a modalidade Festival",
      });
    }
  } else {
    if (!data.mod_gi && !data.mod_nogi) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mod_gi"],
        message: "Selecione pelo menos uma modalidade",
      });
    }
  }

  
});

export type FormValues = z.infer<typeof formSchema>;

// -------------------- OPTIONS --------------------
const beltOptions = [
  { label: "Cinza", value: "CINZA" },
  { label: "Amarela", value: "AMARELA" },
  { label: "Laranja", value: "LARANJA" },
  { label: "Verde", value: "VERDE" },
  { label: "Branca", value: "BRANCA" },
  { label: "Azul", value: "AZUL" },
  { label: "Roxa", value: "ROXA" },
  { label: "Marrom", value: "MARROM" },
  { label: "Preta", value: "PRETA" },
];

const genderOptions = [
  { label: "Masculino", value: "M" },
  { label: "Feminino", value: "F" },
];

const categoryOptions: Array<{ label: string; value: Category }> = [
  { label: "Festival (Até 8 anos)", value: "FESTIVAL" },
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
export default function InscricaoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
  shouldUnregister: true,
  defaultValues: {
    mod_gi: false,
    mod_nogi: false,
    mod_gi_extra: false,
    festival: false,
    terms: false,
  },
});

  const selectedCategory =
    (form.watch("category") as Category | undefined) ?? undefined;

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);

    try {
      const id = await createParticipant({
        full_name: values.full_name.trim(),
        whatsapp: values.whatsapp.trim(),
        age: values.age,
        academy: values.academy?.trim(),
        category: values.category,
        weight_kg: values.weight_kg,
        belt_color: values.belt_color,
        gender: values.gender,
        mod_gi: values.mod_gi,
        mod_nogi: values.mod_nogi,
        mod_gi_extra: values.mod_gi_extra,
        festival: values.festival,
      });

      router.push(`/cash?id=${encodeURIComponent(id)}`);
    } catch {
      setServerError("Não foi possível concluir sua inscrição.");
    } finally {
      setSubmitting(false);
    }
  }

  const age = form.watch("age");
  const category = form.watch("category");
  const isFestivalAge = typeof age === "number" && age <= 8;

  const filteredCategoryOptions = React.useMemo(() => {
    if (typeof age === "number" && age > 8) {
      return categoryOptions.filter((c) => c.value !== "FESTIVAL");
    }
    return categoryOptions;
  }, [age]);

  React.useEffect(() => {
    if (isFestivalAge) {
      if (category !== "FESTIVAL") {
        form.setValue("category", "FESTIVAL");
      }
    } else if (category === "FESTIVAL" && typeof age === "number" && age > 8) {
      form.setValue("category", "" as any);
    }
  }, [isFestivalAge, category, age, form]);

  React.useEffect(() => {
    if (category === "FESTIVAL") {
      form.setValue("mod_gi", false);
      form.setValue("mod_nogi", false);
      form.setValue("mod_gi_extra", false);
    } else {
      form.setValue("festival", false);
    }
  }, [category, form]);

  const giSelected = form.watch("mod_gi");

  React.useEffect(() => {
    if (!giSelected) {
      form.setValue("mod_gi_extra", false, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  }, [giSelected, form]);

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-black text-zinc-100 px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-xl">
        <Link
          className="inline-flex items-center gap-2 text-xl text-zinc-400 hover:text-zinc-100 mb-8 transition-colors"
          href="/"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar para o início
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-zinc-100">Inscrição</h1>
          <p className="mt-1 text-lg text-zinc-400">
            Preencha os dados do atleta. Após enviar, você verá o PIX e as
            instruções de pagamento.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 flex flex-col gap-5 shadow-sm backdrop-blur">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">
              Formulário de Inscrição
            </h2>
            <p className="mt-1 text-lg text-zinc-400 mb-2">
              Preencha todos os campos para concluir.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col md:flex md:flex-col gap-8 "
            >
              {/* Nome */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-zinc-200">
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do Atleta"
                        {...field}
                        className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp */}
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-zinc-200">
                      Telefone (WhatsApp)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(DD) 9XXXX-XXXX"
                        {...field}
                        className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row gap-4">
                {/* Idade */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">
                        Idade
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="w-full rounded-xl bg-black/40 border-zinc-800 text-zinc-100 focus-visible:ring-red-500/30"
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

                {/* Categoria */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">
                        Categoria
                      </FormLabel>
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={isFestivalAge}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                          {filteredCategoryOptions.map((b) => (
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
                          className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Peso */}
                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Peso</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          className="rounded-xl bg-black/40 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-red-500/30"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          {beltOptions.map((b) => (
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

              {/* Modalidades */}
              <div className="flex flex-wrap gap-6 w-full">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4 w-full flex flex-col ">
                  <p className="text-lg text-zinc-200 font-medium mb-3 justify-center flex">
                    Seleção de Modalidades
                  </p>

                  <div className="grid  gap-3">
                    {category === "FESTIVAL" ? (
                      <FormField
                        control={form.control}
                        name="festival"
                        render={({ field }) => (
                          <FormItem className="flex items-start gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="grid gap-1 leading-none">
                              <FormLabel className="text-zinc-100 cursor-pointer">
                                Festival
                              </FormLabel>
                              <p className="text-sm text-zinc-400">
                                Modalidade participativa para crianças.
                              </p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <>
                        {/* GI */}
                    <FormField
                      control={form.control}
                      name="mod_gi"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>

                          <div className="grid gap-1 leading-none">
                            <FormLabel className="text-zinc-100 cursor-pointer">
                              Gi (com kimono)
                            </FormLabel>
                            <p className="text-sm text-zinc-400">
                              Inclui a inscrição na modalidade tradicional.
                            </p>

                            {giSelected && (
                              <div className="mt-3 pl-1">
                                <FormField
                                  control={form.control}
                                  name="mod_gi_extra"
                                  render={({ field: extraField }) => (
                                    <FormItem className="flex items-start gap-3 space-y-0 rounded-xl border border-zinc-800 bg-black/30 p-3">
                                      <FormControl>
                                        <Checkbox
                                          checked={extraField.value}
                                          onCheckedChange={extraField.onChange}
                                          className="mt-1"
                                        />
                                      </FormControl>

                                      <div className="grid gap-1 leading-none">
                                        <FormLabel className="text-zinc-100 cursor-pointer">
                                          Absoluto
                                        </FormLabel>
                                        <p className="text-sm text-zinc-400">
                                          Inclui a inscrição no Absoluto, campeão dos campeões.
                                        </p>
                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* NOGI */}
                    <FormField
                      control={form.control}
                      name="mod_nogi"
                      render={({ field }) => (
                        <FormItem className="flex items-start gap-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>

                          <div className="grid gap-1 leading-none">
                            <FormLabel className="cursor-pointer text-zinc-100">
                              NoGi (sem kimono)
                            </FormLabel>
                            <p className="text-sm text-zinc-400">
                              Inclui a inscrição na modalidade sem kimono.
                            </p>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0 rounded-xl border border-zinc-800 bg-black/30 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>

                    <div className="grid gap-1 leading-none">
                      <FormLabel className="text-zinc-100 cursor-pointer">
                        Declaro que li e aceito os{" "}
                        <a
                          href="/termo-de-autorização.pdf"
                          className="text-white hover:text-red-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Termos de Inscrição
                        </a>
                      </FormLabel>
                      <p className="text-sm text-zinc-400">
                        Ao prosseguir, confirmo que as informações fornecidas são verdadeiras
                        e estou ciente das regras do evento.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-center gap-4">
                <Button
                  className="h-12 rounded-xl cursor-pointer px-8 bg-red-600 hover:bg-red-500"
                  disabled={submitting || !form.watch("terms")}
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