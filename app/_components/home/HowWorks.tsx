import { ClipboardList, CreditCard, MessageSquareShare } from "lucide-react";

export default function HowWorks() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-zinc-100 md:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            Siga os passos abaixo para garantir sua vaga no campeonato
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-950">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-bold text-red-500/10">
              1
            </div>

            <div className="relative pt-6">
              <div className="mb-4 w-fit rounded-xl bg-red-500/15 p-3 text-red-200 transition group-hover:bg-red-500/25">
                <ClipboardList className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                Preencha seus dados
              </h3>
              <p className="text-sm text-zinc-400">
                Insira suas informações pessoais e dados para competição
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-950">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-bold text-red-500/10">
              2
            </div>

            <div className="relative pt-6">
              <div className="mb-4 w-fit rounded-xl bg-red-500/15 p-3 text-red-200 transition group-hover:bg-red-500/25">
                <CreditCard className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                Pague via PIX
              </h3>
              <p className="text-sm text-zinc-400">
                Realize o pagamento usando a chave PIX fornecida
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-950">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 text-8xl font-bold text-red-500/10">
              3
            </div>

            <div className="relative pt-6">
              <div className="mb-4 w-fit rounded-xl bg-red-500/15 p-3 text-red-200 transition group-hover:bg-red-500/25">
                <MessageSquareShare className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                Envie o comprovante
              </h3>
              <p className="text-sm text-zinc-400">
                Mande o comprovante no WhatsApp com seu nome completo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
