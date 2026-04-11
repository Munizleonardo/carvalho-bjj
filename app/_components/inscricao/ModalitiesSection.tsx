"use client";

import type { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { isFestivalAthlete } from "@/app/_components/inscricao/constants";
import type { FormValues } from "@/app/inscricao/form-schema";

export function ModalitiesSection({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const festivalAthlete = isFestivalAthlete(form.watch("age"));

  return (
    <div className="flex w-full flex-wrap gap-6">
      <div className="flex w-full flex-col rounded-2xl border border-zinc-800 bg-black/30 p-4">
        <p className="mb-3 flex justify-center text-base font-medium text-zinc-200 sm:text-lg">
          Seleção de Modalidades
        </p>

        <div className="grid gap-3">
          {!festivalAthlete ? (
            <>
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
                      <FormLabel className="cursor-pointer text-zinc-100">
                        Gi (com kimono)
                      </FormLabel>
                      <p className="text-sm text-zinc-400">
                        Para quem quer competir na essencia do jiu-jitsu e medir
                        tecnica, ritmo e controle.
                      </p>

                      {field.value && (
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
                                  <FormLabel className="cursor-pointer text-zinc-100">
                                    Absoluto
                                  </FormLabel>
                                  <p className="text-sm text-zinc-400">
                                    Um desafio extra para quem quer ir alem da propria
                                    categoria e buscar destaque absoluto.
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
                        No-Gi (sem kimono)
                      </FormLabel>
                      <p className="text-sm text-zinc-400">
                        Ideal para atletas que querem velocidade, pressao e leitura
                        rapida de combate.
                      </p>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Atletas abaixo de 8 anos participarao da modalidade{" "}
              <strong>Festival</strong>, com foco em vivencia esportiva e
              desenvolvimento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
