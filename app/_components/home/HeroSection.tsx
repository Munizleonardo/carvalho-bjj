import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Trophy } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950 via-black to-black" />
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center text-zinc-100">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur">
            <Trophy className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-zinc-200">
              Inscrições Abertas
            </span>
            <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-200">
              2026
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Campeonato de
            <span className="mt-2 block text-red-500">Jiu-Jitsu 2026</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-zinc-300 md:text-xl">
            Participe do maior evento de Jiu-Jitsu da Região dos Lagos. <br/>
            Inscreva-se agora e mostre todo o seu potencial no tatame.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="h-14 w-full rounded-xl px-8 text-base font-medium sm:w-auto bg-red-600 hover:bg-red-500"
            >
              <Link href="/inscricao">Fazer Inscrição</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-14 w-full rounded-xl px-8 text-base font-medium sm:w-auto border-zinc-700 bg-transparent text-zinc-200 hover:bg-white hover:text-black"
            >
              <Link href="/login">Área Administrativa</Link>
            </Button>
            
          </div>
          <div className="flex justify-center mt-5">
            <Button
                asChild
                variant="outline"
                className="h-14 w-full rounded-xl px-8 text-base font-medium sm:w-auto border-zinc-700 bg-black text-zinc-200 hover:bg-red-600 hover:text-white"
              >
                <Link href="/edital-camp.pdf" target="_blank">Edital do Campeonato</Link>
              </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
