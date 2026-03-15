import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  BookOpenText,
  GitBranch,
  LockKeyhole,
  MessageCircleIcon,
  PlayCircle,
  Trophy,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-start justify-center overflow-hidden bg-transparent lg:items-center"
    >
      <Image
        src="https://commons.wikimedia.org/wiki/Special:FilePath/ROBERTO%20CYBORG%20ABREU%202009%20BJJ%20Championships.jpg"
        alt="Luta de jiu-jitsu em campeonato"
        fill
        unoptimized
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/70 via-black/80 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.18),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative container mx-auto px-4 py-10 sm:py-16 md:py-24">
        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div className="max-w-3xl text-center text-zinc-100 lg:text-left">
            <div className="mb-5 grid grid-cols-1 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-700 bg-red-600 px-4 text-sm font-medium text-zinc-200 hover:bg-red-600 hover:text-white sm:w-auto sm:bg-black"
              >
                <Link href="/edital-camp.pdf" target="_blank">
                  <BookOpenText className="h-4 w-4" />
                  Edital do Campeonato
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white sm:w-auto sm:bg-black"
              >
                <Link href="/chaveamento">
                  <GitBranch className="h-4 w-4" />
                  Ver Chaveamento
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-700 bg-white px-4 text-sm font-medium text-black hover:bg-white hover:text-black sm:w-auto sm:bg-transparent sm:text-zinc-200"
              >
                <Link href="/login">
                  <LockKeyhole className="h-4 w-4" />
                  Área Administrativa
                </Link>
              </Button>

              <p className="flex h-11 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white sm:hidden">
                AGUARDE A ABERTURA DAS INSCRIÇÕES
              </p>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl border-zinc-700 bg-green-600 px-4 text-sm font-medium text-zinc-200 hover:bg-green-600 hover:text-white sm:hidden"
              >
                <Link href="https://wa.me/5522999809455" target="_blank">
                  <MessageCircleIcon className="h-4 w-4" />
                  Contate a Organização
                </Link>
              </Button>
            </div>

            <div className="mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur lg:justify-start">
              <Trophy className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-zinc-200">Campeonato - Black Belt BJJ</span>
              <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-200">
                2026
              </span>
            </div>

            <h1 className="mb-4 text-[2rem] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Onde a disciplina encontra o desafio e cada atleta entra para marcar o seu nome.
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-300 sm:text-lg md:text-xl lg:mx-0 lg:leading-8">
              Este campeonato foi pensado para reunir competição, respeito e superação em um
              ambiente que valoriza o atleta do aquecimento ao pódium. 
            </p>

            <div className="mt-6 hidden flex-wrap justify-center gap-3 text-sm text-zinc-300 sm:flex lg:justify-start">
              <div className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2">
                Energia de campeonato do início ao fim!
              </div>
              <div className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2">
                Estrutura pensada para atletas e equipes.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-3 sm:hidden">
              <div className="flex items-center justify-center gap-3">
                <div className=" flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Edição</div>
                  <div className="mt-2 text-lg font-bold text-white">06 - 2026</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Status</div>
                  <div className="mt-2 text-lg font-bold text-white">Em Breve</div>
                </div>
              </div>
            </div>

            <div className="mt-6 hidden flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <p className="flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:px-8 sm:text-base">
                AGUARDE A ABERTURA DAS INSCRIÇÕES
              </p>

              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-xl border-zinc-700 bg-green-600 px-6 text-sm font-medium text-zinc-200 hover:bg-green-600 hover:text-white sm:h-14 sm:w-auto sm:bg-black sm:px-8 sm:text-base"
              >
                <Link href="https://wa.me/5522999809455" target="_blank">
                  <MessageCircleIcon className="h-5 w-5" />
                  Contate a Organização
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-xl lg:block lg:max-w-none">
            <div className="absolute -inset-6 rounded-[2rem] bg-red-600/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-black/60 p-4 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-800">
                <Image
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20Gi%20Competition-Armbar.jpg"
                  alt="Atletas de jiu-jitsu em competicao"
                  width={1200}
                  height={1520}
                  unoptimized
                  className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute left-3 right-3 top-3 flex justify-center sm:left-5 sm:right-auto sm:justify-start">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-center text-xs text-white backdrop-blur-sm sm:text-sm">
                    <PlayCircle className="h-4 w-4 text-red-400" />
                    O tatame chama quem se prepara.
                  </div>
                </div>
                <div className="flex items-center justify-center sm:absolute sm:inset-x-0 sm:bottom-0 sm:block sm:p-5">
                  <div className="flex gap-3 sm:flex-wrap sm:justify-between">
                    <div className="flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Edição</div>
                      <div className="mt-2 text-2xl font-bold text-white">06 - 2026</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Status</div>
                      <div className="mt-2 text-2xl font-bold text-white">Em Breve</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:hidden">
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Edição</div>
                  <div className="mt-2 text-xl font-bold text-white">2026</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Status</div>
                  <div className="mt-2 text-xl font-bold text-white">Em Breve</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
