"use client";

import Image from "next/image";
import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  MapPin,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const teamStats = [
  {
    value: "10+",
    label: "edições de aprendizado",
    description: "Cada evento soma experiência real em organização, ritmo e cuidado com o atleta.",
  },
  {
    value: "500+",
    label: "histórias vividas",
    description: "Inscrições, chamadas e lutas que transformam preparo em memória de campeonato.",
  },
  {
    value: "10",
    label: "equipes presentes",
    description: "Academias reunidas por um mesmo objetivo: competir com honra e evoluir juntas.",
  },
  {
    value: "98%",
    label: "energia aprovada",
    description: "Público, professores e atletas reconhecem quando o evento respeita o tatame.",
  },
];

const galleryItems = [
  {
    title: "Final adulto faixa preta",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/ROBERTO%20CYBORG%20ABREU%202009%20BJJ%20Championships.jpg",
  },
  {
    title: "Armbar em disputa",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20Gi%20Competition-Armbar.jpg",
  },
  {
    title: "No gi de alto nivel",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/IBJJF%20World%20No%20Gi%20Championship%202019.jpg",
  },
  {
    title: "Pan americano em acao",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lucas%20Leite%202009%20BJJ%20Championships.jpg",
  },
  {
    title: "Disputa por triangulo",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/GABRIEL%20VELLA%20vs%20ROMINHO%2051.jpg",
  },
  {
    title: "Luta ouro da competicao",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Summer%20Scramble%202.jpg",
  },
  {
    title: "Abertura com publico",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20at%20PSU.jpg",
  },
  {
    title: "Atletas em transicao",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jiu-jitsu%20tournament%20with%20local%20Australians%2C%20U.S.%20Marine%20150725-M-BX631-117.jpg",
  },
  {
    title: "Takedown em campeonato",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Looking%20for%20the%20takedown.jpg",
  },
  {
    title: "Luta masters",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Masters%20seniors.jpg",
  },
  {
    title: "No gi em destaque",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nicholas%20Moraes%20At%20the%20Pan%20Ams%20No%20Gi%20-%20Silver%20medalist%20black%20belt%20light%20weight%20division%20-%20Ibjjf%202014-06-29%2003-42.jpg",
  },
  {
    title: "Competicao em alto ritmo",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/XIICLD.jpg",
  },
  {
    title: "Equipe em aquecimento",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20training%20with%20CJTF-HOA%20and%20French%20Partners%20%289406536%29.jpg",
  },
  {
    title: "Disputa em pe",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jiu-jitsu%20tournament%20with%20local%20Australians%2C%20U.S.%20Marine%20150725-M-BX631-152.jpg",
  },
  {
    title: "Combate tecnico",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jiu-jitsu%20tournament%20with%20local%20Australians%2C%20U.S.%20Marine%20150725-M-BX631-078.jpg",
  },
  {
    title: "Momento decisivo",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jiu-jitsu%20tournament%20with%20local%20Australians%2C%20U.S.%20Marine%20150725-M-BX631-085.jpg",
  },
  {
    title: "Chamada para a luta",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/ROBERTO%20CYBORG%20ABREU%202009%20BJJ%20Championships.jpg",
  },
  {
    title: "Queda e controle",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20Gi%20Competition-Armbar.jpg",
  },
  {
    title: "Equipe em destaque",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Summer%20Scramble%202.jpg",
  },
  {
    title: "Troca intensa de pegadas",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/GABRIEL%20VELLA%20vs%20ROMINHO%2051.jpg",
  },
  {
    title: "Plateia acompanhando",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brazilian%20Jiu-Jitsu%20at%20PSU.jpg",
  },
  {
    title: "Faixa preta em acao",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lucas%20Leite%202009%20BJJ%20Championships.jpg",
  },
  {
    title: "No gi em intensidade",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/IBJJF%20World%20No%20Gi%20Championship%202019.jpg",
  },
  {
    title: "Finalizacao e resposta",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Looking%20for%20the%20takedown.jpg",
  },
];

const nextEventHighlights = [
  {
    icon: CalendarDays,
    title: "Data oficial",
    subtitle: "07/06/2026",
    description: "Data oficial do próximo campeonato de Jiu-Jitsu",
  },
  {
    icon: MapPin,
    title: "Local",
    subtitle: "Escola Paineira",
    description: "R. São Pedro - Balneário, São Pedro da Aldeia - RJ, 28940-000",
  },
  {
    icon: Medal,
    title: "Categorias",
    description: "Divisões organizadas para valorizar técnica, equilíbrio e merecimento em cada chave.",
  },
  {
    icon: ShieldCheck,
    title: "Estrutura",
    description: "Credenciamento, chamadas e suporte pensados para deixar o foco onde importa: na luta.",
  },
];

const eventDetails = [
  { icon: Clock3, label: "Inscrições", value: "Fácil inscrição e chaveamento automático de acordo com idade e peso." },
  { icon: Users, label: "Ambiente", value: "Um encontro entre atletas, famílias, equipes e quem respeita o esporte." },
  { icon: Trophy, label: "Premiação", value: "Reconhecimento para quem sobe no tatame disposto a dar o melhor." },
  { icon: Flag, label: "Organização", value: "Uma equipe comprometida com seriedade, ritmo e boa experiência." },
];

const sponsors = [
  { name: "Patrocinador Master", tag: "Marca em destaque nesta edicao", initials: "PM" },
  { name: "Apoiador Oficial", tag: "Espaco para parceiro institucional", initials: "AO" },
  { name: "Marca Esportiva", tag: "Ideal para kimono, no-gi ou acessorios", initials: "ME" },
  { name: "Parceiro de Performance", tag: "Suplementacao, recovery ou servico especializado", initials: "PP" },
  { name: "Estrutura do Evento", tag: "Montagem, arena, audio ou operacao local", initials: "EE" },
];

function chunkGallery<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export default function HomeShowcase() {
  const [itemsPerPage, setItemsPerPage] = React.useState(12);
  const galleryPages = React.useMemo(
    () => chunkGallery(galleryItems, itemsPerPage),
    [itemsPerPage]
  );
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4);
        return;
      }

      if (window.innerWidth < 1280) {
        setItemsPerPage(6);
        return;
      }

      setItemsPerPage(12);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  React.useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(galleryPages.length - 1, 0)));
  }, [galleryPages.length]);

  React.useEffect(() => {
    if (galleryPages.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentPage((page) => (page + 1) % galleryPages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [galleryPages.length]);

  const goToPrevious = () => {
    setCurrentPage((page) => (page - 1 + galleryPages.length) % galleryPages.length);
  };

  const goToNext = () => {
    setCurrentPage((page) => (page + 1) % galleryPages.length);
  };

  return (
    <>
      <section className="bg-transparent py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-100">
                <Sparkles className="h-4 w-4" />
                Black Belt BJJ
              </div>

              <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Um campeonato marcante nasce de detalhes bem feitos e de respeito por quem compete.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:mt-5 sm:text-base">
                A proposta desta página é apresentar o evento com presença, clareza e verdade.
                O atleta sente isso no primeiro clique: informação objetiva, identidade forte e
                um convite real para viver uma grande edicao dentro do tatame.
              </p>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                {teamStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-zinc-800 bg-black/60 p-4 transition-colors hover:border-red-500/40 hover:bg-red-500/5 sm:p-5"
                  >
                    <div className="text-2xl font-bold text-red-500 sm:text-3xl">{item.value}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                      {item.label}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.22),transparent_50%)]" />
              <Image
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Lucas%20Leite%202009%20BJJ%20Championships.jpg"
                alt="Atletas em luta de jiu-jitsu"
                width={1200}
                height={1520}
                unoptimized
                className="h-full min-h-[360px] w-full object-cover opacity-45 sm:min-h-[520px]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
                <div className="max-w-md rounded-[1.75rem] border border-white/10 bg-black/65 p-5 backdrop-blur-sm sm:p-6">
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-red-300">
                    Espírito da competição
                  </div>
                  <p className="mt-3 text-xl font-semibold text-white sm:mt-4 sm:text-2xl">
                    Mais do que um torneio, um dia para testar preparo, caráter e vontade de vencer.
                  </p>
                  <p className="mt-4 text-sm leading-6 text-zinc-300">
                    Campeonato pensado para reunir atletas para uma competição justa. O tatame chama quem se prepara.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
                Galeria
              </div>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Imagens que traduzem a intensidade de quem vive o jiu-jitsu de verdade.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Galeria de eventos da Black Belt BJJ.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-4 sm:p-5 md:p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
              {(galleryPages[currentPage] ?? []).map((item) => (
                <figure
                  key={`${item.title}-${item.image}`}
                  className="group relative h-36 overflow-hidden rounded-[1.25rem] border border-zinc-800 bg-black sm:h-52 sm:rounded-[1.5rem]"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-zinc-100 sm:p-4 sm:text-sm">
                    {item.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              className="hover:text-white cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition"
              aria-label="Pagina anterior da galeria"
            >
              <ChevronLeft className="cursor-pointer h-4 w-4" />
            </button>

            {galleryPages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPage(index)}
                className={[
                  "h-2.5 cursor-pointer rounded-full transition-all",
                  currentPage === index ? "w-10 bg-red-500" : "w-2.5 bg-zinc-700 hover:bg-zinc-500",
                ].join(" ")}
                aria-label={`Ir para a pagina ${index + 1} da galeria`}
              />
            ))}

            <button
              type="button"
              onClick={goToNext}
              className="hover:text-white cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition"
              aria-label="Proxima pagina da galeria"
            >
              <ChevronRight className="cursor-pointer h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-transparent py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-5 sm:p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
                Próximo campeonato
              </div>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Informações principais do próximos campeonato que será realizado pela Equipe Black Belt Eventos - BJJ.
              </h2>
              <p className="mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
                Campeonato de Jiu-Jitsu, dedicado a crianças e adultos, mulheres e homens, de todas as idades.
              </p>

              <div className="mt-8 space-y-4">
                {eventDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-3xl border border-zinc-800 bg-black/60 p-4 transition-colors hover:border-red-500/40 hover:bg-red-500/5 sm:gap-4"
                    >
                      <div className="rounded-2xl bg-red-500/15 p-3 text-red-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-200">
                          {item.label}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {nextEventHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/70 p-5 transition-colors hover:border-red-500/40 hover:bg-red-500/5 sm:p-6"
                  >
                    <div className="inline-flex rounded-2xl bg-red-500/15 p-3 text-red-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                    <h3 className="text-2xl font-semibold text-white">{item.subtitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </article>
                );
              })}

              <article className="overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-950 sm:col-span-2">
                <div className="grid gap-0 md:grid-cols-[1fr_0.9fr]">
                  <div className="p-5 sm:p-6 md:p-8">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
                      Mensagem central
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                      Cada inscrição representa uma escolha: entrar preparado para competir em alto nível.
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
                      Inscrições: 1º lote: até 15/05 - R$ 80,00
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
                      Inscrições: 2º lote: de 15/05 até 31/05 - R$ 100,00
                    </p>
                  </div>

                  <div className="relative hidden min-h-[280px] md:block">
                    <Image
                      src="https://commons.wikimedia.org/wiki/Special:FilePath/IBJJF%20World%20No%20Gi%20Championship%202019.jpg"
                      alt="Atletas durante campeonato de jiu-jitsu"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-linear-to-l from-black/20 via-black/35 to-black" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-red-300">
              Patrocinadores
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Marcas que caminham ao lado de um evento construído com seriedade.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Os apoiadores não entram apenas como exposição. Eles fortalecem uma experiência
              que valoriza atleta, equipe, público e a imagem do campeonato.
            </p>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 xl:grid-cols-5">
            {sponsors.map((sponsor) => (
              <article
                key={sponsor.name}
                className="min-w-[240px] snap-center rounded-[1.75rem] border border-zinc-800 bg-zinc-950/75 p-6 text-center transition-colors hover:border-red-500/40 hover:bg-red-500/5 md:min-w-0"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-red-500/20 bg-red-500/10 text-2xl font-bold text-red-200">
                  {sponsor.initials}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{sponsor.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{sponsor.tag}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
