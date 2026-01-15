"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { createParticipant } from "@/app/actions/createParticipante";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
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

const beltOptions = [
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

const categoryEnum = [
  "GALO",
  "PLUMA",
  "PENA",
  "LEVE",
  "MEDIO",
  "MEIO_PESADO",
  "PESADO",
  "SUPER_PESADO",
  "PESADISSIMO",
] as const;

type Category = (typeof categoryEnum)[number];

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

const categoryWeightRange: Record<
  Category,
  { min: number; max: number; step?: number }
> = {
  GALO: { min: 52, max: 57, step: 1 },
  PLUMA: { min: 58, max: 64, step: 1 },
  PENA: { min: 65, max: 70, step: 1 },
  LEVE: { min: 71, max: 76, step: 1 },
  MEDIO: { min: 77, max: 82, step: 1 },
  MEIO_PESADO: { min: 83, max: 88, step: 1 },
  PESADO: { min: 89, max: 94, step: 1 },
  SUPER_PESADO: { min: 95, max: 100, step: 1 },
  PESADISSIMO: { min: 101, max: 120, step: 1 },
};

function rangeLabel(category: Category) {
  const r = categoryWeightRange[category];
  return `${r.min}–${r.max} kg`;
}

function buildWeightOptions(category?: Category) {
  if (!category) return [];
  const { min, max, step = 1 } = categoryWeightRange[category];
  const out: Array<{ label: string; value: string; n: number }> = [];
  for (let w = min; w <= max; w += step) {
    out.push({ label: `${w} kg`, value: String(w), n: w });
  }
  return out;
}

const genderEnum = ["M", "F"] as const;
const beltEnum = ["BRANCA", "AZUL", "ROXA", "MARROM", "PRETA"] as const;

const schema = z
  .object({
    full_name: z.string().min(3, "Informe o nome completo"),
    whatsapp: z.string().min(8, "Informe um WhatsApp válido"),
    age: z.coerce.number().int().min(4).max(90),
    academy: z.string().optional(),

    mod_gi: z.boolean().default(false),
    mod_nogi: z.boolean().default(false),

    category: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(categoryEnum, { message: "Selecione a categoria" })
    ),

    weight_kg: z.preprocess(
      (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
      z.number().min(10).max(300).optional()
    ),

    belt_color: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(beltEnum, { message: "Selecione uma faixa" })
    ),

    gender: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(genderEnum, { message: "Selecione o sexo" })
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.category) return;

    const range = categoryWeightRange[data.category];
    if (!range) return;
  
    if (data.weight_kg === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weight_kg"],
        message: "Selecione o peso do atleta",
      });
      return;
    }

    if (data.weight_kg < range.min || data.weight_kg > range.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weight_kg"],
        message: `Para ${data.category}, o peso deve ficar entre ${range.min} e ${range.max} kg`,
      });
    }

    if (!data.mod_gi && !data.mod_nogi){
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mod_gi"],
        message: "Selecione pelo menos uma opção",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const itemInteractiveClass =
  "cursor-pointer focus:outline-none data-[highlighted]:bg-zinc-900 data-[highlighted]:text-zinc-100 hover:bg-zinc-900/60";

export default function InscricaoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [weightOpen, setWeightOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      full_name: "",
      whatsapp: "",
      age: 0,
      academy: "",
      category: undefined,
      weight_kg: undefined,
      belt_color: undefined,
      gender: undefined,
      mod_gi: false,
      mod_nogi: false,
    },
    mode: "onSubmit",
  });

  const selectedCategory =
    (form.watch("category") as Category | undefined) ?? undefined;

  const weightOptions = React.useMemo(
    () => buildWeightOptions(selectedCategory),
    [selectedCategory]
  );

  React.useEffect(() => {
    if (!selectedCategory) {
      form.setValue("weight_kg", undefined, { shouldValidate: false });
      setWeightOpen(false);
      return;
    }
    form.setValue("weight_kg", undefined, { shouldValidate: true });
  }, [selectedCategory, form]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);

    try {
      await createParticipant({
        full_name: values.full_name.trim(),
        whatsapp: values.whatsapp.trim(),
        age: values.age,
        academy: values.academy?.trim(),
        category: values.category,
        weight_kg: values.weight_kg,
        belt_color: values.belt_color,
        gender: values.gender,
      });

      router.push("/cash");
    } catch {
      setServerError("Não foi possível concluir sua inscrição.");
    } finally {
      setSubmitting(false);
    }
  }

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
            Preencha os dados do atleta. Após enviar, você verá o PIX e as instruções de pagamento.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 flex flex-col gap-5 shadow-sm backdrop-blur">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100">Formulário de Inscrição</h2>
            <p className="mt-1 text-lg text-zinc-400 mb-2">
              Preencha todos os campos para concluir.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 ">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-zinc-200">Nome Completo</FormLabel>
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

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-zinc-200">Telefone (WhatsApp)</FormLabel>
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

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Idade</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full rounded-xl bg-black/40 border-zinc-800 text-zinc-100 focus-visible:ring-red-500/30"
                          inputMode="numeric"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Categoria</FormLabel>

                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => {
                          field.onChange(v as Category);
                          form.setValue("weight_kg", undefined, { shouldValidate: true });
                          setWeightOpen(true);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer">
                            <SelectValue placeholder="Selecione (ex: Leve 71–76 kg)" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                          {categoryOptions.map((c) => (
                            <SelectItem
                              key={c.value}
                              value={c.value}
                              className={itemInteractiveClass}
                            >
                              <div className="flex w-full items-center justify-between gap-4">
                                <span className="text-zinc-100">{c.label}</span>
                                <span className="text-xs text-zinc-400">
                                  {rangeLabel(c.value)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 w-full">
                <FormField
                  control={form.control}
                  name="academy"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Academia</FormLabel>
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

                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-lg text-zinc-200">Peso (kg)</FormLabel>

                      <Select
                        open={weightOpen}
                        onOpenChange={setWeightOpen}
                        value={field.value === undefined ? "" : String(field.value)}
                        onValueChange={(v) => {
                          field.onChange(v === "" ? undefined : Number(v));
                          setWeightOpen(false);
                        }}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-2xl border-zinc-800 bg-black/40 text-zinc-100 cursor-pointer disabled:opacity-50">
                            <SelectValue
                              placeholder={
                                selectedCategory
                                  ? "Selecione o peso"
                                  : "Selecione a categoria primeiro"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                          {weightOptions.map((w) => (
                            <SelectItem key={w.value} value={w.value} className={itemInteractiveClass}>
                              {w.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
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
                            <SelectItem key={b.value} value={b.value} className={itemInteractiveClass}>
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
                            <SelectItem key={g.value} value={g.value} className={itemInteractiveClass}>
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

              {serverError && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                  {serverError}
                </div>
              )}
              <div className="flex flex-wrap gap-6 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4 w-full flex flex-col ">
                <p className="text-lg text-zinc-200 font-medium mb-3 justify-center flex">Seleção de Modalidades</p>

                <div className="grid  gap-3">

                  <FormField
                    control={form.control}
                    name="mod_gi"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="grid gap-1 leading-none">
                          <FormLabel className="text-zinc-100 cursor-pointer">Gi (com kimono)</FormLabel>
                          <p className="text-sm text-zinc-400">Inclui a inscrição na modalidade tradicional.</p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mod_nogi"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="grid gap-1 leading-none">
                          <FormLabel className="text-zinc-100 cursor-pointer">NoGi (sem kimono)</FormLabel>
                          <p className="text-sm text-zinc-400">Inclui a inscrição na modalidade sem kimono.</p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  className="h-12 rounded-xl cursor-pointer px-8 bg-red-600 hover:bg-red-500"
                  disabled={submitting}
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
