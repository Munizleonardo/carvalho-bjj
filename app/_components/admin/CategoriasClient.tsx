"use client";

import * as React from "react";
import Link from "next/link";

import type { ParticipantAdmin, BeltColor } from "@/app/_lib/types";
import { beltLabel } from "@/app/_lib/types";
import { useRouter } from "next/navigation";
import { logout } from "@/app/_lib/auth";
import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Menu } from "lucide-react";

type ViewMode = "cat" | "cat_belt" | "belt" | "cat_age";

type Group = {
  key: string;
  title: string;
  subtitle: string;
  athletes: ParticipantAdmin[];
  category?: string;
  minW?: number;
  maxW?: number;
  belt?: BeltColor;
  ageBand?: string;
};

const WEIGHT_CLUSTER_MAX_SPAN = 5.9;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function normalizeCategory(cat?: string | null) {
  const c = (cat ?? "").trim();
  return c ? c : "Sem categoria";
}

function beltDotClass(belt: BeltColor) {
  switch (belt) {
    case "BRANCA":
      return "bg-white border-zinc-300";
    case "AZUL":
      return "bg-blue-600 border-blue-600";
    case "ROXA":
      return "bg-violet-600 border-violet-600";
    case "MARROM":
      return "bg-amber-800 border-amber-800";
    case "PRETA":
      return "bg-zinc-950 border-zinc-950";
    default:
      return "bg-zinc-700 border-zinc-700";
  }
}

function clusterByWeight(list: ParticipantAdmin[]) {
  const sorted = [...list].sort((a, b) => (a.weight_kg ?? 0) - (b.weight_kg ?? 0));

  const clusters: Array<{ min: number; max: number; athletes: ParticipantAdmin[] }> = [];
  let current: { min: number; max: number; athletes: ParticipantAdmin[] } | null = null;

  for (const a of sorted) {
    const w = a.weight_kg ?? 0;

    if (!current) {
      current = { min: w, max: w, athletes: [a] };
      continue;
    }

    const proposedMin = Math.min(current.min, w);
    const proposedMax = Math.max(current.max, w);

    if (proposedMax - proposedMin <= WEIGHT_CLUSTER_MAX_SPAN) {
      current.min = proposedMin;
      current.max = proposedMax;
      current.athletes.push(a);
    } else {
      clusters.push(current);
      current = { min: w, max: w, athletes: [a] };
    }
  }

  if (current) clusters.push(current);
  return clusters;
}

/** VIEW 1: categoria -> clusters por peso */
function buildGroupsCategory(list: ParticipantAdmin[]): Group[] {
  const byCategory = new Map<string, ParticipantAdmin[]>();

  for (const p of list) {
    const cat = normalizeCategory(p.category);
    const arr = byCategory.get(cat) ?? [];
    arr.push(p);
    byCategory.set(cat, arr);
  }

  const groups: Group[] = [];

  for (const [category, athletes] of byCategory.entries()) {
    const clusters = clusterByWeight(athletes);
    clusters.forEach((c, idx) => {
      groups.push({
        key: `cat:${category}:${c.min}:${c.max}:${idx}`,
        title: category,
        subtitle: `Peso: ${round1(c.min)}kg até ${round1(c.max)}kg • ${c.athletes.length} atleta(s)`,
        athletes: c.athletes,
        category,
        minW: c.min,
        maxW: c.max,
      });
    });
  }

  groups.sort((a, b) => {
    const ca = a.category ?? "";
    const cb = b.category ?? "";
    if (ca !== cb) return ca.localeCompare(cb);
    return (a.minW ?? 0) - (b.minW ?? 0);
  });

  return groups;
}

/** VIEW 2: categoria -> faixa -> clusters por peso */
function buildGroupsCategoryBelt(list: ParticipantAdmin[]): Group[] {
  const byCategory = new Map<string, ParticipantAdmin[]>();

  for (const p of list) {
    const cat = normalizeCategory(p.category);
    const arr = byCategory.get(cat) ?? [];
    arr.push(p);
    byCategory.set(cat, arr);
  }

  const groups: Group[] = [];

  for (const [category, athletes] of byCategory.entries()) {
    const byBelt = new Map<BeltColor, ParticipantAdmin[]>();

    for (const p of athletes) {
      const belt = p.belt_color;
      const arr = byBelt.get(belt) ?? [];
      arr.push(p);
      byBelt.set(belt, arr);
    }

    for (const [belt, beltAthletes] of byBelt.entries()) {
      const clusters = clusterByWeight(beltAthletes);
      clusters.forEach((c, idx) => {
        groups.push({
          key: `cat_belt:${category}:${belt}:${c.min}:${c.max}:${idx}`,
          title: `${category} • ${beltLabel[belt]}`,
          subtitle: `Peso: ${round1(c.min)}kg até ${round1(c.max)}kg • ${c.athletes.length} atleta(s)`,
          athletes: c.athletes,
          category,
          belt,
          minW: c.min,
          maxW: c.max,
        });
      });
    }
  }

  groups.sort((a, b) => {
    const ca = a.category ?? "";
    const cb = b.category ?? "";
    if (ca !== cb) return ca.localeCompare(cb);

    const ba = a.belt ?? "BRANCA";
    const bb = b.belt ?? "BRANCA";
    if (ba !== bb) return ba.localeCompare(bb);

    return (a.minW ?? 0) - (b.minW ?? 0);
  });

  return groups;
}

/** VIEW 3: somente faixa */
function buildGroupsBeltOnly(list: ParticipantAdmin[]): Group[] {
  const byBelt = new Map<BeltColor, ParticipantAdmin[]>();

  for (const p of list) {
    const arr = byBelt.get(p.belt_color) ?? [];
    arr.push(p);
    byBelt.set(p.belt_color, arr);
  }

  const belts: BeltColor[] = ["BRANCA", "AZUL", "ROXA", "MARROM", "PRETA"];

  return belts
    .filter((b) => (byBelt.get(b)?.length ?? 0) > 0)
    .map((belt) => {
      const athletes = (byBelt.get(belt) ?? []).sort((a, b) => (a.weight_kg ?? 0) - (b.weight_kg ?? 0));
      return {
        key: `belt:${belt}`,
        title: beltLabel[belt],
        subtitle: `${athletes.length} atleta(s)`,
        athletes,
        belt,
      };
    });
}

/** --- NOVO: VIEW 4: categoria -> idade -> clusters por peso --- */
type AgeBand = { key: string; label: string; min: number; max: number };

const AGE_BANDS: AgeBand[] = [
  { key: "04-06", label: "4–6", min: 4, max: 6 },
  { key: "07-09", label: "7–9", min: 7, max: 9 },
  { key: "10-12", label: "10–12", min: 10, max: 12 },
  { key: "13-15", label: "13–15", min: 13, max: 15 },
  { key: "16-17", label: "16–17", min: 16, max: 17 },
  { key: "18-29", label: "18–29", min: 18, max: 29 },
  { key: "30-39", label: "30–39", min: 30, max: 39 },
  { key: "40+", label: "40+", min: 40, max: 200 },
];

function ageBandLabel(age: number) {
  const band = AGE_BANDS.find((b) => age >= b.min && age <= b.max);
  return band ? band.label : "—";
}

function buildGroupsCategoryAge(list: ParticipantAdmin[]): Group[] {
  const byCategory = new Map<string, ParticipantAdmin[]>();

  for (const p of list) {
    const cat = normalizeCategory(p.category);
    const arr = byCategory.get(cat) ?? [];
    arr.push(p);
    byCategory.set(cat, arr);
  }

  const groups: Group[] = [];

  for (const [category, athletes] of byCategory.entries()) {
    for (const band of AGE_BANDS) {
      const bandAthletes = athletes.filter((p) => p.age >= band.min && p.age <= band.max);
      if (bandAthletes.length === 0) continue;

      const clusters = clusterByWeight(bandAthletes);
      clusters.forEach((c, idx) => {
        groups.push({
          key: `cat_age:${category}:${band.key}:${c.min}:${c.max}:${idx}`,
          title: `${category} • Idade ${band.label}`,
          subtitle: `Peso: ${round1(c.min)}kg até ${round1(c.max)}kg • ${c.athletes.length} atleta(s)`,
          athletes: c.athletes,
          category,
          ageBand: band.label,
          minW: c.min,
          maxW: c.max,
        });
      });
    }
  }

  groups.sort((a, b) => {
    const ca = a.category ?? "";
    const cb = b.category ?? "";
    if (ca !== cb) return ca.localeCompare(cb);

    // ordena por faixa etária seguindo a lista
    const ia = AGE_BANDS.findIndex((x) => x.label === a.ageBand);
    const ib = AGE_BANDS.findIndex((x) => x.label === b.ageBand);
    if (ia !== ib) return ia - ib;

    return (a.minW ?? 0) - (b.minW ?? 0);
  });

  return groups;
}

function viewLabel(view: ViewMode) {
  if (view === "cat") return "Categorias + Peso";
  if (view === "cat_belt") return "Categoria + Peso + Faixa";
  if (view === "belt") return "Somente Faixa";
  return "Peso + Categoria + Idade";
}

function buildCategoryCards(all: ParticipantAdmin[]) {
  const map = new Map<string, number>();
  for (const p of all) {
    const cat = normalizeCategory(p.category);
    map.set(cat, (map.get(cat) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export default function CategoriesClient({ all }: { all: ParticipantAdmin[] }) {
  
  const router = useRouter();
  
  function handleLogout() {
    logout();
    router.push("/");
  };

  const [view, setView] = React.useState<ViewMode>("cat");

  const categoryCards = React.useMemo(() => buildCategoryCards(all), [all]);

  const groups = React.useMemo(() => {
    if (view === "cat") return buildGroupsCategory(all);
    if (view === "cat_belt") return buildGroupsCategoryBelt(all);
    if (view === "belt") return buildGroupsBeltOnly(all);
    return buildGroupsCategoryAge(all);
  }, [all, view]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Categorias</h1>
              <p className="text-sm text-zinc-400">
                Visão atual: {viewLabel(view)} • Total atletas: {all.length} • Grupos: {groups.length}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white"
              >
                <Link href="/admin/painel">Painel</Link>
              </Button>
              <Button
              asChild
              variant="outline"
              className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white"
            >
              <Link href="/admin/chaveamento">Chaveamento(Em breve)</Link>
            </Button>

            <Button
                  variant="ghost"
                  className="cursor-pointer h-9 rounded-xl px-3 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
                  type="button"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
            </div>
            
            <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="cursor-pointer h-9 w-9 rounded-xl p-0 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-950 text-zinc-100">
                    <Link href="/admin/painel"><DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Painel</DropdownMenuItem></Link>
                    <Link href="/admin/chaveamento"><DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Chaveamento(Em breve)</DropdownMenuItem></Link>
                    <Link href="/"><DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Sair</DropdownMenuItem></Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards no topo: quantidade por categoria */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {categoryCards.map((c) => (
            <div
              key={c.category}
              className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4"
            >
              <div className="text-xs text-zinc-400">Categoria</div>
              <div className="mt-1 text-sm font-semibold text-zinc-100 truncate">
                {c.category}
              </div>
              <div className="mt-3 text-2xl font-bold text-zinc-100">{c.count}</div>
              <div className="text-xs text-zinc-500">inscrito(s)</div>
            </div>
          ))}
        </div>

        {/* Botões abaixo dos cards, centralizados */}
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-2">
            <Button
              type="button"
              onClick={() => setView("cat")}
              className={[
                "h-9 rounded-xl cursor-pointer",
                view === "cat"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900",
              ].join(" ")}
            >
              Categorias + Peso
            </Button>

            <Button
              type="button"
              onClick={() => setView("cat_belt")}
              className={[
                "h-9 rounded-xl cursor-pointer",
                view === "cat_belt"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900",
              ].join(" ")}
            >
              Categoria + Peso + Faixa
            </Button>

            <Button
              type="button"
              onClick={() => setView("belt")}
              className={[
                "h-9 rounded-xl cursor-pointer",
                view === "belt"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900",
              ].join(" ")}
            >
              Somente Faixa
            </Button>

            <Button
              type="button"
              onClick={() => setView("cat_age")}
              className={[
                "h-9 rounded-xl cursor-pointer",
                view === "cat_age"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900",
              ].join(" ")}
            >
              Categoria + Idade + Peso
            </Button>
          </div>
        </div>

        {/* Tabelas / grupos */}
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 text-center text-zinc-400">
            Nenhuma inscrição encontrada para gerar categorias.
          </div>
        ) : (
          groups.map((g) => (
            <section
              key={g.key}
              className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 mb-6"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  {g.belt && (
                    <span
                      className={["h-3.5 w-3.5 rounded-full border", beltDotClass(g.belt)].join(" ")}
                      aria-hidden
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">{g.title}</h3>
                    <p className="text-sm text-zinc-400">{g.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-900">
                      <TableHead className="text-zinc-400">Atleta</TableHead>
                      <TableHead className="text-zinc-400">Idade</TableHead>
                      <TableHead className="text-zinc-400">Peso</TableHead>
                      <TableHead className="text-zinc-400">Faixa</TableHead>
                      <TableHead className="text-zinc-400">Categoria</TableHead>
                      <TableHead className="text-zinc-400">Academia</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {g.athletes.map((p) => (
                      <TableRow key={p.id} className="border-zinc-900 hover:bg-zinc-900/20">
                        <TableCell className="py-4">
                          <div className="font-medium text-zinc-100">{p.full_name}</div>
                          <div className="text-sm text-zinc-400">{p.whatsapp}</div>
                        </TableCell>

                        <TableCell className="text-zinc-100">
                          {p.age}
                          {view === "cat_age" ? (
                            <span className="ml-2 text-xs text-zinc-500">({ageBandLabel(p.age)})</span>
                          ) : null}
                        </TableCell>

                    <TableCell className="text-zinc-100">{round1(p.weight_kg ?? 0)} kg</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "h-3.5 w-3.5 rounded-full border",
                                beltDotClass(p.belt_color),
                              ].join(" ")}
                              aria-hidden
                            />
                            <span className="text-zinc-100">{beltLabel[p.belt_color]}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-zinc-100">{normalizeCategory(p.category)}</TableCell>

                        <TableCell className="text-zinc-100">{p.academy ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
