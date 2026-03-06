"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Menu, Pencil, Trash2 } from "lucide-react";

import { logout } from "@/app/_lib/auth";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import {
  buildBracketRounds,
  buildBracketName,
  createEmptyWinnerSelections,
  hydrateBrackets,
  serializeBrackets,
  type Athlete,
  type Bracket,
  type MatchSide,
} from "@/app/_lib/chaveamento";

type BracketMatch = Bracket["rounds"][number]["matches"][number];

function parseOptionalNumber(value: string): number | undefined {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function formatAthleteLabel(athlete: Athlete) {
  return `${athlete.nome} - ${athlete.faixa} - ${
    athlete.peso !== null ? `${athlete.peso}kg` : "-"
  } - ${athlete.categoria ?? "-"}`;
}

function formatRangeLabel(label: string, min?: number, max?: number, unit = "") {
  if (min === undefined && max === undefined) return `${label}: todos`;
  if (min !== undefined && max !== undefined) return `${label}: ${min}${unit} a ${max}${unit}`;
  if (min !== undefined) return `${label}: a partir de ${min}${unit}`;
  return `${label}: ate ${max}${unit}`;
}

function getSlotIndicesForMatch(matchIndex: number) {
  return { top: matchIndex * 2, bottom: matchIndex * 2 + 1 };
}

function getDirectAdvanceSlotIndex(slotCount: number) {
  return slotCount % 2 === 1 ? slotCount - 1 : null;
}

function MatchNode({ match, isFinalRound }: { match: BracketMatch; isFinalRound: boolean }) {
  return (
    <div className="relative min-w-[240px]">
      <div className="relative space-y-3">
        {([match.top, match.bottom] as const).map((slot, index) => {
          const isWinner = match.winnerSide === (index === 0 ? "top" : "bottom");

          return (
            <div key={`${match.id}-${index}`} className="relative">
              <div
                className={`rounded-2xl border px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.35)] ${
                  isWinner
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-zinc-700 bg-zinc-950/90"
                }`}
              >
                <div className="truncate text-sm font-medium text-zinc-100">{slot.label}</div>
              </div>

              {!isFinalRound ? (
                <div className="absolute -right-4 top-1/2 h-px w-4 -translate-y-1/2 bg-zinc-700" />
              ) : null}
            </div>
          );
        })}

        {!isFinalRound ? (
          <>
            <div className="absolute -right-4 top-[25%] h-[50%] w-px bg-zinc-700" />
            <div className="absolute -right-12 top-1/2 h-px w-8 -translate-y-1/2 bg-zinc-700" />
          </>
        ) : null}
      </div>

      <div className="mt-2 text-center text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        Luta {match.number}
      </div>
    </div>
  );
}

function BracketVisualization({ bracket, athletesCount }: { bracket: Bracket; athletesCount: number }) {
  const champion = bracket.rounds.at(-1)?.matches[0]?.resolvedWinner ?? null;

  return (
    <div className="rounded-[28px] border border-zinc-800 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%),linear-gradient(180deg,_rgba(24,24,27,0.94),_rgba(9,9,11,0.98))] p-5">
      <div className="mb-6 flex flex-col gap-3 border-b border-zinc-800 pb-4 text-center">
        <div className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">Black Belt Eventos</div>
        <div className="text-2xl font-semibold text-zinc-50">{bracket.name}</div>
        <div className="text-sm text-zinc-400">{bracket.description}</div>
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          {athletesCount} atletas selecionados
        </div>
        {champion ? (
          <div className="mx-auto rounded-full border border-emerald-500/60 bg-emerald-950/40 px-4 py-1 text-sm text-emerald-300">
            Campeão: {champion.nome}
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-start gap-12 px-2">
          {bracket.rounds.map((round, roundIndex) => {
            const gap = roundIndex === 0 ? 16 : Math.pow(2, roundIndex) * 28;
            const paddingTop = roundIndex === 0 ? 0 : Math.pow(2, roundIndex - 1) * 28;

            return (
              <div
                key={`${bracket.id}-${round.title}-${roundIndex}`}
                className="flex min-w-[240px] flex-col"
                style={{ paddingTop }}
              >
                <div className="mb-4 text-center text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {round.title}
                </div>

                <div className="flex flex-col" style={{ rowGap: gap }}>
                  {round.matches.map((match) => (
                    <MatchNode
                      key={match.id}
                      match={match}
                      isFinalRound={roundIndex === bracket.rounds.length - 1}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ChaveamentoClient() {
  const router = useRouter();

  const [athletes, setAthletes] = React.useState<Athlete[]>([]);
  const [brackets, setBrackets] = React.useState<Bracket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [filterMinAge, setFilterMinAge] = React.useState("");
  const [filterMaxAge, setFilterMaxAge] = React.useState("");
  const [filterMinWeight, setFilterMinWeight] = React.useState("");
  const [filterMaxWeight, setFilterMaxWeight] = React.useState("");
  const [selectedAthleteIds, setSelectedAthleteIds] = React.useState<string[]>([]);
  const [newBracketName, setNewBracketName] = React.useState("");
  const [activeBracketId, setActiveBracketId] = React.useState<string | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingBracketId, setEditingBracketId] = React.useState<string | null>(null);
  const [editingBracketName, setEditingBracketName] = React.useState("");
  const [editingAthleteIds, setEditingAthleteIds] = React.useState<string[]>([]);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const readyToPersistRef = React.useRef(false);
  const lastSavedPayloadRef = React.useRef("[]");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chaveamento", { cache: "no-store" });
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const json = await res.json();
        const nextAthletes = Array.isArray(json?.athletes) ? (json.athletes as Athlete[]) : [];
        const athletesMap = new Map(nextAthletes.map((athlete) => [athlete.id, athlete]));
        const nextBrackets = Array.isArray(json?.brackets)
          ? hydrateBrackets(json.brackets, athletesMap)
          : [];

        setAthletes(nextAthletes);
        setBrackets(nextBrackets);
        lastSavedPayloadRef.current = JSON.stringify(serializeBrackets(nextBrackets));
        setFetchError(null);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Nao foi possivel carregar os atletas."
        );
      } finally {
        readyToPersistRef.current = true;
        setLoading(false);
      }
    })();
  }, []);

  const paidAthletes = React.useMemo(
    () => athletes.filter((athlete) => (athlete.status ?? "").toLowerCase() === "paid"),
    [athletes]
  );

  const athletesById = React.useMemo(
    () => new Map(paidAthletes.map((athlete) => [athlete.id, athlete])),
    [paidAthletes]
  );

  const activeBracket = React.useMemo(
    () => brackets.find((bracket) => bracket.id === activeBracketId) ?? null,
    [brackets, activeBracketId]
  );

  const activeBracketAthletes = React.useMemo(() => {
    if (!activeBracket) return [];
    return activeBracket.athleteIds
      .map((id) => athletesById.get(id))
      .filter((athlete): athlete is Athlete => Boolean(athlete));
  }, [activeBracket, athletesById]);

  const editingBracket = React.useMemo(
    () => brackets.find((bracket) => bracket.id === editingBracketId) ?? null,
    [brackets, editingBracketId]
  );

  const editingAthleteIdsSet = React.useMemo(
    () => new Set(editingAthleteIds),
    [editingAthleteIds]
  );

  const minAge = parseOptionalNumber(filterMinAge);
  const maxAge = parseOptionalNumber(filterMaxAge);
  const minWeight = parseOptionalNumber(filterMinWeight);
  const maxWeight = parseOptionalNumber(filterMaxWeight);

  const filteredAthletesForCreation = React.useMemo(() => {
    return paidAthletes.filter((athlete) => {
      if (minAge !== undefined && athlete.idade < minAge) return false;
      if (maxAge !== undefined && athlete.idade > maxAge) return false;
      if (minWeight !== undefined && (athlete.peso === null || athlete.peso < minWeight)) return false;
      if (maxWeight !== undefined && (athlete.peso === null || athlete.peso > maxWeight)) return false;
      return true;
    });
  }, [paidAthletes, minAge, maxAge, minWeight, maxWeight]);

  React.useEffect(() => {
    const allowedIds = new Set(filteredAthletesForCreation.map((athlete) => athlete.id));
    setSelectedAthleteIds((current) => current.filter((id) => allowedIds.has(id)));
  }, [filteredAthletesForCreation]);

  React.useEffect(() => {
    setBrackets((current) =>
      current.map((bracket) => ({
        ...bracket,
        rounds: buildBracketRounds(bracket.slotAthleteIds, athletesById, bracket.winnerSelections),
      }))
    );
  }, [athletesById]);

  React.useEffect(() => {
    if (!readyToPersistRef.current || loading) return;

    const payload = JSON.stringify(serializeBrackets(brackets));
    if (payload === lastSavedPayloadRef.current) return;

    let cancelled = false;
    setSaveState("saving");
    setSaveError(null);

    (async () => {
      try {
        const res = await fetch("/api/chaveamento", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brackets: JSON.parse(payload) }),
        });

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(
            typeof json?.error === "string" ? json.error : `Erro ${res.status} ao salvar chaveamento.`
          );
        }

        if (cancelled) return;
        lastSavedPayloadRef.current = payload;
        setSaveState("saved");
      } catch (error) {
        if (cancelled) return;
        setSaveState("error");
        setSaveError(
          error instanceof Error ? error.message : "Nao foi possivel salvar o chaveamento."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brackets, loading]);

  const selectedAthleteIdsSet = React.useMemo(() => new Set(selectedAthleteIds), [selectedAthleteIds]);
  const totalFights = React.useMemo(
    () => brackets.reduce((sum, bracket) => sum + bracket.rounds.reduce((roundSum, round) => roundSum + round.matches.length, 0), 0),
    [brackets]
  );

  function handleLogout() {
    logout();
    router.push("/");
  }

  function resetCreateModal() {
    setFilterMinAge("");
    setFilterMaxAge("");
    setFilterMinWeight("");
    setFilterMaxWeight("");
    setSelectedAthleteIds([]);
    setNewBracketName("");
  }

  function openCreateModal() {
    resetCreateModal();
    setCreateOpen(true);
  }

  function closeCreateModal(open: boolean) {
    setCreateOpen(open);
    if (!open) resetCreateModal();
  }

  function openEditModal(bracketId: string) {
    const bracket = brackets.find((item) => item.id === bracketId);
    if (!bracket) return;

    setEditingBracketId(bracket.id);
    setEditingBracketName(bracket.name);
    setEditingAthleteIds(bracket.athleteIds);
    setEditOpen(true);
  }

  function closeEditModal(open: boolean) {
    setEditOpen(open);
    if (!open) {
      setEditingBracketId(null);
      setEditingBracketName("");
      setEditingAthleteIds([]);
    }
  }

  function toggleAthleteSelection(athleteId: string) {
    setSelectedAthleteIds((current) =>
      current.includes(athleteId) ? current.filter((id) => id !== athleteId) : [...current, athleteId]
    );
  }

  function toggleEditingAthleteSelection(athleteId: string) {
    setEditingAthleteIds((current) =>
      current.includes(athleteId) ? current.filter((id) => id !== athleteId) : [...current, athleteId]
    );
  }

  function createBracketFromSelection() {
    if (selectedAthleteIds.length === 0) return;

    const selectedAthletes = selectedAthleteIds
      .map((id) => athletesById.get(id))
      .filter((athlete): athlete is Athlete => Boolean(athlete));
    const slotAthleteIds = Array.from({ length: selectedAthletes.length }, () => null as string | null);
    const winnerSelections = createEmptyWinnerSelections(selectedAthletes.length);
    const description = [
      formatRangeLabel("Idade", minAge, maxAge),
      formatRangeLabel("Peso", minWeight, maxWeight, "kg"),
    ].join(" • ");

    const nextBracket: Bracket = {
      id: crypto.randomUUID(),
      name: newBracketName.trim() || buildBracketName(selectedAthletes),
      athleteIds: [...selectedAthleteIds],
      description,
      slotAthleteIds,
      winnerSelections,
      rounds: buildBracketRounds(slotAthleteIds, athletesById, winnerSelections),
    };

    setBrackets((current) => [...current, nextBracket]);
    closeCreateModal(false);
    setActiveBracketId(nextBracket.id);
  }

  function updateBracketName(bracketId: string, name: string) {
    setBrackets((current) =>
      current.map((bracket) => (bracket.id === bracketId ? { ...bracket, name } : bracket))
    );
  }

  function updateBracketSlot(bracketId: string, slotIndex: number, athleteId: string | null) {
    setBrackets((current) =>
      current.map((bracket) => {
        if (bracket.id !== bracketId) return bracket;

        const nextSlotAthleteIds = bracket.slotAthleteIds.map((currentId, index) => {
          if (index === slotIndex) return athleteId;
          if (athleteId && currentId === athleteId) return null;
          return currentId;
        });

        const nextWinnerSelections = bracket.winnerSelections.map((roundSelections) =>
          roundSelections.map(() => null)
        );

        return {
          ...bracket,
          slotAthleteIds: nextSlotAthleteIds,
          winnerSelections: nextWinnerSelections,
          rounds: buildBracketRounds(nextSlotAthleteIds, athletesById, nextWinnerSelections),
        };
      })
    );
  }

  function updateMatchWinner(
    bracketId: string,
    roundIndex: number,
    matchIndex: number,
    winnerSide: MatchSide | null
  ) {
    setBrackets((current) =>
      current.map((bracket) => {
        if (bracket.id !== bracketId) return bracket;

        const nextWinnerSelections = bracket.winnerSelections.map((roundSelections, currentRoundIndex) =>
          currentRoundIndex < roundIndex
            ? roundSelections
            : currentRoundIndex === roundIndex
              ? roundSelections.map((currentWinner, currentMatchIndex) =>
                  currentMatchIndex === matchIndex ? winnerSide : currentWinner
                )
              : roundSelections.map(() => null)
        );

        return {
          ...bracket,
          winnerSelections: nextWinnerSelections,
          rounds: buildBracketRounds(bracket.slotAthleteIds, athletesById, nextWinnerSelections),
        };
      })
    );
  }

  function removeBracket(bracketId: string) {
    setBrackets((current) => current.filter((bracket) => bracket.id !== bracketId));
    if (activeBracketId === bracketId) setActiveBracketId(null);
  }

  function saveBracketEdit() {
    if (!editingBracketId || editingAthleteIds.length === 0) return;

    setBrackets((current) =>
      current.map((bracket) => {
        if (bracket.id !== editingBracketId) return bracket;

        const allowedAthleteIds = new Set(editingAthleteIds);
        const nextSlotAthleteIds = bracket.slotAthleteIds
          .filter((_, index) => index < editingAthleteIds.length)
          .map((athleteId) => (athleteId && allowedAthleteIds.has(athleteId) ? athleteId : null));

        while (nextSlotAthleteIds.length < editingAthleteIds.length) {
          nextSlotAthleteIds.push(null);
        }

        const nextWinnerSelections = createEmptyWinnerSelections(editingAthleteIds.length);

        return {
          ...bracket,
          name: editingBracketName.trim() || bracket.name,
          athleteIds: editingAthleteIds,
          slotAthleteIds: nextSlotAthleteIds,
          winnerSelections: nextWinnerSelections,
          rounds: buildBracketRounds(nextSlotAthleteIds, athletesById, nextWinnerSelections),
        };
      })
    );

    closeEditModal(false);
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Chaveamento</h1>
              <p className="text-sm text-zinc-400">
                Atletas pagos: {paidAthletes.length} • Chaves: {brackets.length} • Confrontos: {totalFights}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Pagina publica: /chaveamento
                {saveState === "saving" ? " • salvando..." : null}
                {saveState === "saved" ? " • alteracoes publicadas" : null}
                {saveState === "error" ? " • erro ao publicar" : null}
              </p>
              {saveError ? <p className="mt-1 text-xs text-red-400">{saveError}</p> : null}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Button asChild variant="outline" className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white">
                <Link href="/admin/painel">Painel</Link>
              </Button>
              <Button asChild variant="outline" className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white">
                <Link href="/admin/categorias">Categorias</Link>
              </Button>
              <Button asChild variant="outline" className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white">
                <Link href="/admin/cashback">Cashback</Link>
              </Button>
              <Button
                variant="ghost"
                className="h-9 cursor-pointer rounded-xl px-3 text-zinc-300 hover:bg-zinc-900 hover:text-red-700"
                type="button"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 cursor-pointer rounded-xl p-0 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-950 text-zinc-100">
                  <Link href="/admin/painel">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Painel</DropdownMenuItem>
                  </Link>
                  <Link href="/admin/categorias">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Categorias</DropdownMenuItem>
                  </Link>
                  <Link href="/admin/cashback">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Cashback</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-red-700 data-highlighted:bg-white">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-4 ${activeBracket ? "space-y-4 py-4" : "space-y-6 py-8"}`}>
        {activeBracket ? (
          <>
            <section className="rounded-3xl border border-zinc-900 bg-zinc-950/50 p-4">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setActiveBracketId(null)}
                    className="cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800"
                  >
                    Voltar para chaveamento
                  </Button>

                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Edicao da chave</div>
                    <div className="text-sm text-zinc-400">
                      Selecione os atletas das primeiras lutas e avance os vencedores ate a final.
                    </div>
                  </div>
                </div>

                <div className="flex w-full max-w-xl items-center gap-2">
                  <Input
                    value={activeBracket.name}
                    readOnly
                    className="border-zinc-800 bg-zinc-950 text-lg font-semibold text-zinc-100"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => openEditModal(activeBracket.id)}
                    className="shrink-0 cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-4">
                {(activeBracket.rounds[0]?.matches ?? []).map((match, matchIndex) => {
                  const slotIndices = getSlotIndicesForMatch(matchIndex);

                  return (
                    <div key={match.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
                      <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">
                        Luta {match.number}
                      </div>

                      {(
                        [
                          { key: "top", label: "Atleta A", slotIndex: slotIndices.top },
                          { key: "bottom", label: "Atleta B", slotIndex: slotIndices.bottom },
                        ] as const
                      ).map((slot) => {
                        const currentValue = activeBracket.slotAthleteIds[slot.slotIndex] ?? "";
                        const usedAthleteIds = new Set(
                          activeBracket.slotAthleteIds.filter(
                            (athleteId, index): athleteId is string =>
                              Boolean(athleteId) && index !== slot.slotIndex
                          )
                        );

                        return (
                          <div key={`${match.id}-${slot.key}`} className="mb-3 last:mb-0">
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                              {slot.label}
                            </label>
                            <select
                              className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                              value={currentValue}
                              onChange={(e) =>
                                updateBracketSlot(activeBracket.id, slot.slotIndex, e.target.value || null)
                              }
                            >
                              <option value="">Selecionar atleta</option>
                              {activeBracketAthletes
                                .filter(
                                  (athlete) =>
                                    athlete.id === currentValue || !usedAthleteIds.has(athlete.id)
                                )
                                .map((athlete) => (
                                  <option key={athlete.id} value={athlete.id}>
                                    {formatAthleteLabel(athlete)}
                                  </option>
                                ))}
                            </select>
                          </div>
                        );
                      })}

                      <div className="mt-3">
                        <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                          Vencedor
                        </label>
                        <select
                          className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                          value={match.winnerSide ?? ""}
                          onChange={(e) =>
                            updateMatchWinner(
                              activeBracket.id,
                              0,
                              matchIndex,
                              (e.target.value as MatchSide) || null
                            )
                          }
                        >
                          <option value="">Selecionar vencedor</option>
                          <option value="top" disabled={!match.top.athlete}>
                            {match.top.label}
                          </option>
                          <option value="bottom" disabled={!match.bottom.athlete}>
                            {match.bottom.label}
                          </option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              {getDirectAdvanceSlotIndex(activeBracket.slotAthleteIds.length) !== null ? (
                <div className="mt-4 rounded-2xl border border-amber-700/40 bg-amber-950/20 p-3">
                  <div className="mb-2 text-xs uppercase tracking-[0.24em] text-amber-300/80">
                    Classificado direto
                  </div>
                  {(() => {
                    const slotIndex = getDirectAdvanceSlotIndex(activeBracket.slotAthleteIds.length) as number;
                    const currentValue = activeBracket.slotAthleteIds[slotIndex] ?? "";
                    const usedAthleteIds = new Set(
                      activeBracket.slotAthleteIds.filter(
                        (athleteId, index): athleteId is string =>
                          Boolean(athleteId) && index !== slotIndex
                      )
                    );

                    return (
                      <select
                        className="w-full cursor-pointer rounded-xl border border-amber-700/40 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                        value={currentValue}
                        onChange={(e) =>
                          updateBracketSlot(activeBracket.id, slotIndex, e.target.value || null)
                        }
                      >
                        <option value="">Selecionar atleta</option>
                        {activeBracketAthletes
                          .filter(
                            (athlete) => athlete.id === currentValue || !usedAthleteIds.has(athlete.id)
                          )
                          .map((athlete) => (
                            <option key={athlete.id} value={athlete.id}>
                              {formatAthleteLabel(athlete)}
                            </option>
                          ))}
                      </select>
                    );
                  })()}
                </div>
              ) : null}
            </section>

            <section className="rounded-3xl border border-zinc-900 bg-zinc-950/50 p-4">
              <div className="mb-4 text-xs uppercase tracking-[0.28em] text-zinc-500">Progresso</div>
              <div className="grid gap-4 xl:grid-cols-3">
                {activeBracket.rounds.slice(1).map((round, roundIndex) => (
                  <div key={`${activeBracket.id}-${round.title}-${roundIndex + 1}`}>
                    <div className="mb-2 text-sm font-medium text-zinc-200">{round.title}</div>
                    <div className="space-y-3">
                      {round.matches.map((match, matchIndex) => (
                        <div key={match.id} className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
                          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                            Luta {match.number}
                          </div>
                          <div className="mb-3 space-y-2">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
                              {match.top.label}
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
                              {match.bottom.label}
                            </div>
                          </div>
                          <select
                            className="w-full cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                            value={match.winnerSide ?? ""}
                            onChange={(e) =>
                              updateMatchWinner(
                                activeBracket.id,
                                roundIndex + 1,
                                matchIndex,
                                (e.target.value as MatchSide) || null
                              )
                            }
                          >
                            <option value="">Selecionar vencedor</option>
                            <option value="top" disabled={!match.top.athlete}>
                              {match.top.label}
                            </option>
                            <option value="bottom" disabled={!match.bottom.athlete}>
                              {match.bottom.label}
                            </option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-900 bg-zinc-950/50 p-4">
              <div className="mb-4 text-xs uppercase tracking-[0.28em] text-zinc-500">Chaveamento</div>
              <div className="overflow-x-auto">
                <BracketVisualization bracket={activeBracket} athletesCount={activeBracketAthletes.length} />
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="text-sm text-zinc-400">
                  Filtre atletas pagos por idade e peso, crie a chave com nome editavel e monte as lutas ate a final.
                </div>
                <Button onClick={openCreateModal} className="w-full cursor-pointer bg-white text-black hover:bg-zinc-200 md:w-auto">
                  Criar nova chave
                </Button>
              </div>

              {fetchError ? <div className="mt-3 text-sm text-red-400">{fetchError}</div> : null}
            </section>

            {loading ? (
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 text-center text-zinc-400">
                Carregando atletas...
              </div>
            ) : brackets.length === 0 ? (
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 text-center text-zinc-400">
                Nenhuma chave criada ainda.
              </div>
            ) : (
              brackets.map((bracket) => {
                const bracketAthletes = bracket.athleteIds
                  .map((id) => athletesById.get(id))
                  .filter((athlete): athlete is Athlete => Boolean(athlete));

                return (
                  <section key={bracket.id} className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <Input
                          value={bracket.name}
                          onChange={(e) => updateBracketName(bracket.id, e.target.value)}
                          className="max-w-xl border-zinc-800 bg-zinc-950 text-lg font-semibold text-zinc-100"
                        />
                        <div className="mt-2 text-sm text-zinc-400">{bracket.description}</div>
                        <div className="mt-2 text-sm text-zinc-500">Atletas na chave: {bracketAthletes.length}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setActiveBracketId(bracket.id)}
                          className="cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Editar chave
                        </Button>
                        <Button className="cursor-pointer" variant="destructive" size="icon" onClick={() => removeBracket(bracket.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <BracketVisualization bracket={bracket} athletesCount={bracketAthletes.length} />
                  </section>
                );
              })
            )}
          </>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar nova chave</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Filtre por idade e peso e selecione apenas atletas com status pago.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="mb-2 text-xs text-zinc-400">Nome da chave</p>
              <Input
                placeholder="Ex.: Peso Medio Juvenil"
                value={newBracketName}
                onChange={(e) => setNewBracketName(e.target.value)}
                className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="mb-2 text-xs text-zinc-400">Idade</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input inputMode="numeric" placeholder="De" value={filterMinAge} onChange={(e) => setFilterMinAge(e.target.value)} className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" />
                  <Input inputMode="numeric" placeholder="Ate" value={filterMaxAge} onChange={(e) => setFilterMaxAge(e.target.value)} className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="mb-2 text-xs text-zinc-400">Peso (kg)</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input inputMode="decimal" placeholder="De" value={filterMinWeight} onChange={(e) => setFilterMinWeight(e.target.value)} className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" />
                  <Input inputMode="decimal" placeholder="Ate" value={filterMaxWeight} onChange={(e) => setFilterMaxWeight(e.target.value)} className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" />
                </div>
              </div>
            </div>

            <div className="text-sm text-zinc-300">
              Atletas encontrados: {filteredAthletesForCreation.length} • Selecionados: {selectedAthleteIds.length}
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-black/40 p-3">
              {filteredAthletesForCreation.length === 0 ? (
                <div className="py-6 text-center text-sm text-zinc-400">
                  Nenhum atleta pago encontrado para os filtros informados.
                </div>
              ) : (
                filteredAthletesForCreation.map((athlete) => (
                  <label key={athlete.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2 hover:bg-zinc-900/30">
                    <input type="checkbox" checked={selectedAthleteIdsSet.has(athlete.id)} onChange={() => toggleAthleteSelection(athlete.id)} className="h-4 w-4 cursor-pointer accent-white" />
                    <span className="text-sm text-zinc-100">{formatAthleteLabel(athlete)}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => closeCreateModal(false)} className="cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800">
                Cancelar
              </Button>
              <Button type="button" onClick={createBracketFromSelection} disabled={selectedAthleteIds.length === 0} className="cursor-pointer bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50">
                Criar chave com selecionados
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={closeEditModal}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar chave</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Altere o nome da chave e os atletas participantes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
              <p className="mb-2 text-xs text-zinc-400">Nome da chave</p>
              <Input
                placeholder="Ex.: Peso Medio Juvenil"
                value={editingBracketName}
                onChange={(e) => setEditingBracketName(e.target.value)}
                className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="text-sm text-zinc-300">
              Atletas selecionados: {editingAthleteIds.length}
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-black/40 p-3">
              {paidAthletes.length === 0 ? (
                <div className="py-6 text-center text-sm text-zinc-400">
                  Nenhum atleta pago disponivel.
                </div>
              ) : (
                paidAthletes.map((athlete) => (
                  <label
                    key={athlete.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2 hover:bg-zinc-900/30"
                  >
                    <input
                      type="checkbox"
                      checked={editingAthleteIdsSet.has(athlete.id)}
                      onChange={() => toggleEditingAthleteSelection(athlete.id)}
                      className="h-4 w-4 cursor-pointer accent-white"
                    />
                    <span className="text-sm text-zinc-100">{formatAthleteLabel(athlete)}</span>
                  </label>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeEditModal(false)}
                className="cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={saveBracketEdit}
                disabled={!editingBracket || editingAthleteIds.length === 0}
                className="cursor-pointer bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Salvar alteracoes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
