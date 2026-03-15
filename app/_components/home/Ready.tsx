"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

type FAQKey =
  | "evento"
  | "local"
  | "valores"
  | "pagamento"
  | "premiacoes"
  | "categorias"
  | "absoluto"
  | "regras"
  | "imagem"
  | "inscricao";

const faqs: Array<{
  key: FAQKey;
  title: string;
  answer: string;
}> = [
  {
    key: "evento",
    title: "Sobre o Evento",
    answer:
      "Este campeonato foi idealizado para oferecer uma experiencia competitiva seria, organizada e inspiradora. A cada luta, o objetivo e valorizar o preparo do atleta e o respeito pelo tatame.",
  },
  {
    key: "local",
    title: "Local do Evento",
    answer:
      "O endereco oficial pode ser atualizado neste bloco sempre que a edicao for confirmada. A recomendacao e chegar com antecedencia para credenciamento, aquecimento e orientacoes iniciais.",
  },
  {
    key: "valores",
    title: "Valores de Inscricoes",
    answer:
      "Os valores podem variar conforme as modalidades escolhidas. O sistema apresenta o total final com clareza para que o atleta conclua a inscricao com seguranca.",
  },
  {
    key: "pagamento",
    title: "Formas de Pagamento",
    answer:
      "O pagamento e realizado por PIX, de forma pratica e objetiva. Depois da inscricao, o atleta recebe as instrucoes para finalizar a etapa e garantir sua vaga.",
  },
  {
    key: "premiacoes",
    title: "Premiacoes",
    answer:
      "A premiacao reconhece desempenho, entrega e merito esportivo. Os detalhes oficiais de cada edicao podem ser ajustados aqui conforme a proposta do campeonato.",
  },
  {
    key: "categorias",
    title: "Categorias",
    answer:
      "As categorias seguem criterios de faixa, idade e peso para manter o chaveamento equilibrado. Isso fortalece disputas mais justas e valoriza o nivel tecnico do evento.",
  },
  {
    key: "absoluto",
    title: "Absoluto",
    answer:
      "Quando estiver disponivel, o Absoluto amplia o desafio para quem busca ir alem da propria categoria. As regras e condicoes podem ser personalizadas conforme a edicao.",
  },
  {
    key: "regras",
    title: "Regras",
    answer:
      "O regulamento define pontuacao, condutas e orientacoes do evento. A ideia e garantir competitividade com disciplina, transparencia e respeito em todas as areas da competicao.",
  },
  {
    key: "imagem",
    title: "Direito de Imagem",
    answer:
      "A participacao no evento pode envolver captacao de fotos e videos para comunicacao oficial do campeonato. Havendo alguma restricao especifica, a organizacao deve ser avisada com antecedencia.",
  },
  {
    key: "inscricao",
    title: "Confirmacao da Inscricao",
    answer:
      "A inscricao so e considerada concluida apos a etapa de pagamento ser confirmada. Depois disso, o atleta segue com mais seguranca para a preparacao e acompanhamento das informacoes do evento.",
  },
];

function FAQCard({
  title,
  answer,
  isOpen,
  onToggle,
}: {
  title: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={[
        "group rounded-2xl border border-zinc-800 bg-black/40",
        "transition-colors hover:border-red-500/40 hover:bg-red-500/10",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center rounded-2xl p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/30 group-hover:bg-red-500/10"
        aria-expanded={isOpen}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-zinc-100">{title}</span>
            <span className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
              Clique para ver
            </span>
          </div>
          <span
            className={[
              "text-base text-zinc-400 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
            aria-hidden
          >
            v
          </span>
        </div>
      </button>

      <div
        className={[
          "overflow-hidden px-4 pb-4 transition-all duration-200",
          isOpen ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-200 transition-colors group-hover:border-red-500/30 group-hover:bg-black/80">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function Ready() {
  const [openKey, setOpenKey] = React.useState<FAQKey | null>(null);
  const leftColumn = faqs.slice(0, 5);
  const rightColumn = faqs.slice(5);

  return (
    <section className="bg-transparent py-14 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-sm sm:p-6">
          <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-red-500/15 blur-3xl" />

          <div className="relative">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-100 md:text-3xl">
                Duvidas frequentes
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
                No celular, cada bloco abre de forma individual para facilitar a leitura sem
                poluir a tela.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <div className="space-y-4">
                {leftColumn.map((item) => {
                  const isOpen = openKey === item.key;

                  return (
                    <FAQCard
                      key={item.key}
                      title={item.title}
                      answer={item.answer}
                      isOpen={isOpen}
                      onToggle={() =>
                        setOpenKey((previous) => (previous === item.key ? null : item.key))
                      }
                    />
                  );
                })}
              </div>

              <div className="space-y-4">
                {rightColumn.map((item) => {
                  const isOpen = openKey === item.key;

                  return (
                    <FAQCard
                      key={item.key}
                      title={item.title}
                      answer={item.answer}
                      isOpen={isOpen}
                      onToggle={() =>
                        setOpenKey((previous) => (previous === item.key ? null : item.key))
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-10 text-center text-sm text-zinc-400">
              Se ainda restar alguma duvida, fale com a organizacao e receba a orientacao
              certa antes de entrar no tatame.
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border-zinc-700 bg-green-600 text-sm font-medium text-zinc-200 transition-colors hover:bg-green-500 hover:text-white sm:h-14 sm:w-auto sm:bg-black sm:text-base sm:hover:bg-green-600"
            >
              <Link href="https://wa.me/5522999809455" target="_blank">
                <MessageCircleIcon className="h-5 w-5" />
                Contate a Organizacao
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
