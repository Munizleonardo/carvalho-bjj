"use client";

import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";

type FAQKey =
  | "evento"
  | "local"
  | "valores"
  | "pagamento"
  | "premiacoes"
  | "categorias"
  | "absoluto"
  | "regras"
  | "imagem";

const faqs: Array<{
  key: FAQKey;
  title: string;
  answer: string;
}> = [
  {
    key: "evento",
    title: "Sobre o Evento",
    answer:
      "Campeonato de Jiu-Jitsu 2026, voltado para atletas da região e convidados. Estrutura com organização, chaveamento e equipe de apoio. Informações finais e comunicados oficiais serão enviados pelos canais do evento.",
  },
  {
    key: "local",
    title: "Local do Evento",
    answer:
      "O local e o endereço completo serão divulgados na página oficial do evento e no WhatsApp informado na inscrição. Recomenda-se chegar com antecedência para credenciamento e aquecimento.",
  },
  {
    key: "valores",
    title: "Valores de Inscrições",
    answer:
      "O valor varia conforme as modalidades selecionadas (Gi, NoGi e/ou Absoluto). O total a pagar é confirmado na etapa de pagamento após concluir a inscrição.",
  },
  {
    key: "pagamento",
    title: "Formas de Pagamento",
    answer:
      "Pagamento via PIX. Após concluir a inscrição, você verá a chave e as instruções. A confirmação ocorre após o envio do comprovante no WhatsApp indicado.",
  },
  {
    key: "premiacoes",
    title: "Premiações",
    answer:
      "Premiações por categoria conforme regulamento do evento. A organização divulga detalhes (itens e critérios) nas comunicações oficiais do campeonato.",
  },
  {
    key: "categorias",
    title: "Categorias",
    answer:
      "As categorias seguem faixa, idade e peso informados no ato da inscrição, visando chaveamentos equilibrados. A seleção de peso é guiada pela categoria escolhida no formulário.",
  },
  {
    key: "absoluto",
    title: "Absoluto",
    answer:
      "O Absoluto é opcional e pode ser selecionado na inscrição, quando disponível. Regras, critérios e formato seguem o regulamento do evento.",
  },
  {
    key: "regras",
    title: "Regras",
    answer:
      "As lutas seguem o regulamento adotado pela organização, incluindo pontuação, tempo e condutas. Orientações finais de pesagem, check-in e chamadas serão informadas antes do evento.",
  },
  {
    key: "imagem",
    title: "Direito de Imagem",
    answer:
      "Ao participar do evento, o atleta autoriza o uso de imagem (foto/vídeo) captada durante a competição para divulgação institucional e mídias do campeonato. Caso exista restrição específica, o responsável deve contatar a organização antes do evento.",
  },
];

function FAQCard({
  title,
  answer,
  isOpen,
  onOpen,
  onToggle,
}: {
  title: string;
  answer: string;
  isOpen: boolean;
  onOpen: (v: boolean) => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-zinc-800 bg-black/40",
        "transition-colors hover:bg-black/55",
      ].join(" ")}
      onMouseEnter={() => onOpen(true)}
      onMouseLeave={() => onOpen(false)}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-red-500/30 rounded-2xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-semibold text-zinc-100">{title}</span>
          <span
            className={[
              "text-sm text-zinc-400 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      <div
        className={[
          "px-4 pb-4",
          "transition-all duration-200",
          isOpen ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function Ready() {
  const [openKey, setOpenKey] = React.useState<FAQKey | null>(null);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
          {/* brilho vermelho */}
          <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-red-500/15 blur-3xl" />

          <div className="relative">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-100 md:text-3xl">
                Dúvidas Frequentes
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {faqs.map((item) => {
                const isOpen = openKey === item.key;
                return (
                  <FAQCard
                    key={item.key}
                    title={item.title}
                    answer={item.answer}
                    isOpen={isOpen}
                    onOpen={(v) => setOpenKey(v ? item.key : null)}
                    onToggle={() =>
                      setOpenKey((prev) => (prev === item.key ? null : item.key))
                    }
                  />
                );
              })}
            </div>

            <div className="mt-10 text-center text-sm text-zinc-400">
              Se ainda restar alguma dúvida, finalize a inscrição e fale com a organização pelo WhatsApp.
            </div>
          </div>
          <div className="flex justify-center mt-5 gap-4 flex-col sm:flex-row">
            <Button
              asChild
              variant="outline"
              className="cursor-pointer flex justify-center items-center mt-3 h-14 sm: w-2xlrounded-xl text-base font-medium border-zinc-700 sm:bg-black bg-green-600 text-zinc-200 hover:bg-green-600 hover:text-white"
            >
              <Link href="https://wa.me/5522999809455" target="_blank" className="cursor-pointer">
              <MessageCircleIcon className="h-5 w-5 cursor-pointer"/>Contate a Organização</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
