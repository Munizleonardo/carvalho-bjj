"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Textarea } from "@/app/_components/ui/textarea";

// muito importante pro banco entender qual valor ta sendo enviado, tanto pra faixa quanto pro sexo

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

const genderEnum = ["M", "F"] as const;
const beltEnum = ["BRANCA", "AZUL", "ROXA", "MARROM", "PRETA"] as const;

const schema = z.object({
  full_name: z.string().min(3, "Informe o nome completo"),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido"),
  age: z.coerce.number().int().min(4).max(90),
  academy: z.string().optional(),
  weight_kg: z.coerce.number().min(10).max(300),
  belt_color: z.preprocess(
      (v) => (v === "" ? undefined : v),
      z.enum(beltEnum, { message: "Selecione uma faixa" })
  ),
  
  gender: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(genderEnum, { message: "Selecione o sexo" })
  ),

});

type FormValues = z.infer<typeof schema>;

export default function InscricaoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      full_name: "",
      whatsapp: "",
      age: 0,
      academy: "",
      weight_kg: 0,
      belt_color: undefined,
      gender: undefined, // pro select iniciar sem nada selecionado
    },
    mode: "onSubmit",
  });

async function onSubmit(values: FormValues) {
  setSubmitting(true);
  setServerError(null);

  try {
    const id = await createParticipant({
      full_name: values.full_name.trim(),
      whatsapp: values.whatsapp.trim(),
      age: values.age,
      academy: values.academy?.trim(),
      weight_kg: values.weight_kg,
      belt_color: values.belt_color,
      gender: values.gender,
    });

    router.push("/cash");
  } catch (err) {
    setServerError("Não foi possível concluir sua inscrição.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div className=" bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <Link
          className=" inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          href="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar para o início
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-zinc-900">Inscrição</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Preencha os dados do atleta. Após enviar, você verá o PIX e as instruções de pagamento.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 gap-5 shadow-sm">
          <div className="gap-5">
            <h2 className="text-lg font-semibold text-zinc-900 gap-3">Formulário de Inscrição</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Preencha todos os campos obrigatórios para concluir.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do Atleta" {...field} />
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
                    <FormLabel>Telefone (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input placeholder="(DD) X XXXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 ">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Idade</FormLabel>
                      <FormControl>
                        <Input className="w-full" inputMode="numeric" type="number" {...field} />
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
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input className="w-full" inputMode="decimal" type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="academy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academia</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 ">
                <FormField
                  control={form.control}
                  name="belt_color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Faixa</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl border-zinc-200">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                          <SelectContent>
                            {beltOptions.map((b) => (
                              <SelectItem key={b.value} value={b.value}>
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
                    <FormLabel>Gênero</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-xl border-zinc-200">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {genderOptions.map((g) => (
                          <SelectItem
                            key={g.value}
                            value={g.value}
                            className="cursor-pointer"
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

              {serverError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <Button className="h-12 rounded-xl" disabled={submitting} type="submit">
                {submitting ? "Enviando..." : "Concluir inscrição"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}