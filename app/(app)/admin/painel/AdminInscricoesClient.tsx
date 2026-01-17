"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

import { deleteParticipantAdmin } from "@/app/_lib/actions/adminInscricoes";
import { logout } from "@/app/_lib/auth";

import type { BeltColor, ModalityFilter, ParticipantAdmin } from "@/app/_lib/types";
import { beltDotClasses, beltLabel } from "@/app/_lib/types";

import { ArrowLeft, FileDown, Info, MoreHorizontal, SlidersHorizontal, Trash2, Users } from "lucide-react";

type Props = {
  initialParticipants: ParticipantAdmin[];
};

const beltOptions: Array<{ label: string; value: "ALL" | BeltColor }> = [
  { label: "Todas as faixas", value: "ALL" },
  { label: "Branca", value: "BRANCA" },
  { label: "Azul", value: "AZUL" },
  { label: "Roxa", value: "ROXA" },
  { label: "Marrom", value: "MARROM" },
  { label: "Preta", value: "PRETA" },
];

const modalityOptions: Array<{ label: string; value: ModalityFilter }> = [
  { label: "Todas as modalidades", value: "ALL" },
  { label: "Modalidade Gi", value: "GI" },
  { label: "Modalidade NoGi", value: "NOGI" },
  { label: "Modalidade Absoluto", value: "ABS" },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function includesText(p: ParticipantAdmin, q: string) {
  if (!q) return true;
  const n = normalize(q);
  return (
    normalize(p.full_name).includes(n) ||
    normalize(p.whatsapp).includes(n) ||
    normalize(p.academy ?? "").includes(n)
  );
}

function passesModality(p: ParticipantAdmin, mod: ModalityFilter) {
  if (mod === "ALL") return true;
  if (mod === "GI") return Boolean(p.mod_gi);
  if (mod === "NOGI") return Boolean(p.mod_nogi);
  if (mod === "ABS") return Boolean(p.mod_abs);
  return true;
}

function passesBelt(p: ParticipantAdmin, belt: "ALL" | BeltColor) {
  if (belt === "ALL") return true;
  return p.belt_color === belt;
}

function passesWeight(p: ParticipantAdmin, minW?: number, maxW?: number) {
  if (minW !== undefined && p.weight_kg < minW) return false;
  if (maxW !== undefined && p.weight_kg > maxW) return false;
  return true;
}

function countByModality(list: ParticipantAdmin[]) {
  let gi = 0;
  let nogi = 0;
  let abs = 0;

  for (const p of list) {
    if (p.mod_gi) gi += 1;
    if (p.mod_nogi) nogi += 1;
    if (p.mod_abs) abs += 1;
  }

  return { gi, nogi, abs };
}

export default function AdminInscricoesClient({ initialParticipants }: Props) {
  const router = useRouter();

  const [participants, setParticipants] = React.useState<ParticipantAdmin[]>(
    initialParticipants
  );

  const [search, setSearch] = React.useState("");
  const [belt, setBelt] = React.useState<"ALL" | BeltColor>("ALL");
  const [modality, setModality] = React.useState<ModalityFilter>("ALL");

  const [minWeight, setMinWeight] = React.useState<string>("");
  const [maxWeight, setMaxWeight] = React.useState<string>("");

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsItem, setDetailsItem] = React.useState<ParticipantAdmin | null>(null);

  const minW = minWeight.trim() === "" ? undefined : Number(minWeight);
  const maxW = maxWeight.trim() === "" ? undefined : Number(maxWeight);

  const filtered = React.useMemo(() => {
    return participants
      .filter((p) => includesText(p, search))
      .filter((p) => passesBelt(p, belt))
      .filter((p) => passesModality(p, modality))
      .filter((p) => passesWeight(p, minW, maxW));
  }, [participants, search, belt, modality, minW, maxW]);

  const counts = React.useMemo(() => countByModality(filtered), [filtered]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  function openDetails(p: ParticipantAdmin) {
    setDetailsItem(p);
    setDetailsOpen(true);
  }

  async function removeParticipant(id: string) {
    const ok = window.confirm("Confirma remover a inscrição deste atleta?");
    if (!ok) return;

    try {
      await deleteParticipantAdmin(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Não foi possível remover a inscrição. Tente novamente.");
    }
  }

  function exportPdf() {
    const params = new URLSearchParams();

    if (search.trim()) params.set("q", search.trim());
    if (belt !== "ALL") params.set("belt", belt);
    if (modality !== "ALL") params.set("mod", modality);

    if (minW !== undefined && !Number.isNaN(minW)) params.set("minW", String(minW));
    if (maxW !== undefined && !Number.isNaN(maxW)) params.set("maxW", String(maxW));

    window.open(`/admin/inscricoes/export-pdf?${params.toString()}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/60 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Painel Administrativo</h1>
              <p className="text-sm text-zinc-400">Gerenciamento de inscrições</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="cursor-pointer h-9 rounded-xl px-3 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>

              <Link href="/admin/categorias">
                <Button
                  variant="outline"
                  className="cursor-pointer h-9 rounded-xl px-3 border-zinc-800 bg-transparent text-zinc-100 hover:bg-white hover:text-black"
                >
                  Categorias
                </Button>
              </Link>

              <Button
                variant="ghost"
                className="cursor-pointer h-9 rounded-xl px-3 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
                type="button"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-zinc-900 p-3">
                <Users className="h-5 w-5 text-zinc-100" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{counts.gi}</p>
                <p className="text-sm text-zinc-400">Inscritos Modalidade Gi</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-zinc-900 p-3">
                <Users className="h-5 w-5 text-zinc-100" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{counts.nogi}</p>
                <p className="text-sm text-zinc-400">Inscritos Modalidade NoGi</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-zinc-900 p-3">
                <Users className="h-5 w-5 text-zinc-100" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{counts.abs}</p>
                <p className="text-sm text-zinc-400">Inscritos Modalidade Absoluto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm text-zinc-300">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm text-zinc-400">Buscar</label>
              <Input
                className="h-10 rounded-xl border-zinc-800 bg-black/40 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                placeholder="Buscar por nome ou WhatsApp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full md:w-48">
              <label className="mb-2 block text-sm text-zinc-400">Faixa</label>
              <Select
                value={belt}
                onValueChange={(v) => {
                  const validValue = beltOptions.find((opt) => opt.value === v)?.value;
                  if (validValue) setBelt(validValue);
                }}
              >
                <SelectTrigger className="cursor-pointer h-10 rounded-xl border-zinc-800 bg-black/40 text-zinc-100">
                  <SelectValue placeholder="Todas as faixas" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                  {beltOptions.map((b) => (
                    <SelectItem
                      key={b.value}
                      value={b.value}
                      className="cursor-pointer data-[highlighted]:bg-white"
                    >
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-60">
              <label className="mb-2 block text-sm text-zinc-400">Modalidade</label>
              <Select value={modality} onValueChange={(v) => setModality(v as ModalityFilter)}>
                <SelectTrigger className="cursor-pointer h-10 rounded-xl border-zinc-800 bg-black/40 text-zinc-100">
                  <SelectValue placeholder="Todas as modalidades" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
                  {modalityOptions.map((m) => (
                    <SelectItem
                      key={m.value}
                      value={m.value}
                      className="cursor-pointer data-highlighted:bg-white"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-56">
              <label className="mb-2 block text-sm text-zinc-400">Peso (kg)</label>
              <div className="flex gap-2">
                <Input
                  inputMode="decimal"
                  placeholder="de"
                  value={minWeight}
                  onChange={(e) => setMinWeight(e.target.value)}
                  className="h-10 w-full rounded-xl border-zinc-800 bg-black/40 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                />
                <Input
                  inputMode="decimal"
                  placeholder="até"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(e.target.value)}
                  className="h-10 w-full rounded-xl border-zinc-800 bg-black/40 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-700"
                />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Button
                type="button"
                onClick={exportPdf}
                className="cursor-pointer h-10 w-full rounded-xl bg-white text-black hover:bg-zinc-200 md:w-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">Inscrições ({filtered.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-zinc-900">
                  <TableHead className="text-zinc-400">Atleta (Nome e Telefone)</TableHead>
                  <TableHead className="text-zinc-400">Idade</TableHead>
                  <TableHead className="text-zinc-400">Peso</TableHead>
                  <TableHead className="text-zinc-400">Faixa</TableHead>
                  <TableHead className="text-zinc-400">Categoria</TableHead>
                  <TableHead className="text-zinc-400">Academia</TableHead>
                  <TableHead className="text-right text-zinc-400">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/40"
                  >
                    <TableCell className="py-4">
                      <div>
                        <p className="font-medium text-zinc-100">{p.full_name}</p>
                        <p className="text-sm text-zinc-400">{p.whatsapp}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-zinc-100">{p.age}</TableCell>
                    <TableCell className="text-zinc-100">{p.weight_kg} kg</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                      <div className={`h-3.5 w-3.5 rounded-full border ${beltDotClasses[p.belt_color]}`} />
                        <span className="text-sm text-zinc-100">{beltLabel[p.belt_color]}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-zinc-100">{p.category || "-"}</TableCell>
                    <TableCell className="text-zinc-100">{p.academy ?? "-"}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="cursor-pointer h-9 w-9 rounded-xl p-0 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="border-zinc-800 bg-zinc-950 text-zinc-100"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer data-highlighted:bg-white"
                            onClick={() => openDetails(p)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            Inscrição
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer text-red-300 data-highlighted:bg-white hover:text-white"
                            onClick={() => removeParticipant(p.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow className="border-0">
                    <TableCell colSpan={7} className="py-10 text-center text-zinc-400">
                      Nenhuma inscrição encontrada com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Inscrição</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Informações gerais do atleta e modalidades selecionadas.
            </DialogDescription>
          </DialogHeader>

          {detailsItem && (
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Atleta</span>
                    <span className="text-zinc-100 font-medium">{detailsItem.full_name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">WhatsApp</span>
                    <span className="text-zinc-100">{detailsItem.whatsapp}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Idade</span>
                    <span className="text-zinc-100">{detailsItem.age}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Peso</span>
                    <span className="text-zinc-100">{detailsItem.weight_kg} kg</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Categoria</span>
                    <span className="text-zinc-100">{detailsItem.category || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Academia</span>
                    <span className="text-zinc-100">{detailsItem.academy ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-zinc-400">Faixa</span>
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full border ${beltDotClasses[detailsItem.belt_color]}`} />
                      <span className="text-zinc-100">{beltLabel[detailsItem.belt_color]}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                <p className="mb-2 text-sm font-medium text-zinc-200">Modalidades</p>
                <div className="flex flex-wrap gap-2">
                  {detailsItem.mod_gi && (
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100">
                      Gi
                    </span>
                  )}
                  {detailsItem.mod_nogi && (
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100">
                      NoGi
                    </span>
                  )}
                  {detailsItem.mod_abs && (
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100">
                      Absoluto
                    </span>
                  )}
                  {!detailsItem.mod_gi && !detailsItem.mod_nogi && !detailsItem.mod_abs && (
                    <span className="text-sm text-zinc-400">Nenhuma modalidade registrada.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
