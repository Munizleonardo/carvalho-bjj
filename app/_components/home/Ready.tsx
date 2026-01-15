import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

export default function Ready() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
          {/* brilho vermelho */}
          <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-red-500/15 blur-3xl" />

          <div className="relative px-6 py-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-zinc-100 md:text-3xl">
              Pronto para competir?
            </h2>

            <p className="mx-auto mb-8 max-w-md text-zinc-400">
              Não perca tempo. As vagas são limitadas. Faça sua inscrição agora e
              garanta sua participação.
            </p>

            <Button
              asChild
              className="h-14 rounded-xl px-8 text-base font-medium bg-red-600 hover:bg-red-500"
            >
              <Link href="/inscricao">Inscrever-se agora</Link>
            </Button>

            <div className="mt-6 text-sm text-zinc-500">
              Pagamento via PIX e confirmação por WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
