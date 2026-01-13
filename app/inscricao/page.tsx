"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const belts = ["Branca", "Azul", "Roxa", "Marrom", "Preta"];
const genders = ["Masculino", "Feminino"];

const schema = z.object({
  full_name: z.string().min(3, "Informe o nome completo"),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido"),
  age: z.coerce.number().int().min(4).max(90),
  academy: z.string().optional(),
  weight_kg: z.coerce.number().min(10).max(300),
  belt_color: z.enum(belts),
  gender: z.enum(genders),
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
      belt_color: "",
      gender: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: values.full_name.trim(),
        whatsapp: values.whatsapp.trim(),
        age: values.age,
        academy: values.academy?.trim() || null,
        weight_kg: values.weight_kg,
        belt_color: values.belt_color,
        gender: values.gender,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setServerError(data?.error ?? "Não foi possível concluir sua inscrição.");
      setSubmitting(false);
      return;
    }

    router.push(`/pagamento/${data.id}`);
  }

  return (
    <div className=" bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <Link
          className=" inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          href="/"
        >
           <ArrowLeft />
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
            <p className="mt-1 text-sm text-zinc-600 mb-2 ">
              Preencha todos os campos para concluir.
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
                          <SelectTrigger className="w-full rounded-xl border-zinc-200 cursor-pointer">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {belts.map((b) => (
                            <SelectItem key={b} value={b} className="cursor-pointer">
                              {b}
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
                          <SelectTrigger className=" cursor-pointer w-full rounded-xl border-zinc-200">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {genders.map((g) => (
                            <SelectItem key={g} value={g} className="cursor-pointer">
                              {g}
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
              <Link href="/cash">
                <Button className="h-12 rounded-xl cursor-pointer" disabled={submitting} type="submit" >
                  {submitting ? "Enviando..." : "Concluir inscrição"}
                </Button>
              </Link>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
