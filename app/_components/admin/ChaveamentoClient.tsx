"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Trash2 } from "lucide-react";

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

type Athlete = {
  id: string;
  nome: string;
  idade: number;
  peso: number | null;
  faixa: string;
  categoria: string | null;
  status: string;
};

type Fight = {
  id: string;
  a?: Athlete;
  b?: Athlete;
  winner?: "a" | "b";
};

type Bracket = {
  id: string;
  name: string;
  athleteIds: string[];
  fights: Fight[];
};

type AthleteApiRow = Omit<Athlete, "id"> & {
  id: string | number;
};

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

  const [activeBracketId, setActiveBracketId] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chaveamento", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Erro ${res.status}`);
        }

        const json = await res.json();
        setAthletes(
          Array.isArray(json)
            ? (json as AthleteApiRow[]).map((athlete) => ({
                ...athlete,
                id: String(athlete.id),
              }))
            : []
        );
      } catch {
        setFetchError("Nao foi possivel carregar os atletas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const paidAthletes = React.useMemo(
    () => athletes.filter((athlete) => (athlete.status ?? "").toLowerCase() === "paid"),
    [athletes]
  );

  const athletesById = React.useMemo(() => {
    return new Map(paidAthletes.map((athlete) => [athlete.id, athlete]));
  }, [paidAthletes]);

  const activeBracket = React.useMemo(
    () => brackets.find((bracket) => bracket.id === activeBracketId),
    [brackets, activeBracketId]
  );

  const activeBracketAthletes = React.useMemo(() => {
    if (!activeBracket) return [];

    return activeBracket.athleteIds
      .map((id) => athletesById.get(id))
      .filter((athlete): athlete is Athlete => Boolean(athlete));
  }, [activeBracket, athletesById]);

  const minAge = parseOptionalNumber(filterMinAge);
  const maxAge = parseOptionalNumber(filterMaxAge);
  const minWeight = parseOptionalNumber(filterMinWeight);
  const maxWeight = parseOptionalNumber(filterMaxWeight);

  const filteredAthletesForCreation = React.useMemo(() => {
    return paidAthletes.filter((athlete) => {
      if (minAge !== undefined && athlete.idade < minAge) return false;
      if (maxAge !== undefined && athlete.idade > maxAge) return false;
      if (minWeight !== undefined && (athlete.peso === null || athlete.peso < minWeight)) {
        return false;
      }
      if (maxWeight !== undefined && (athlete.peso === null || athlete.peso > maxWeight)) {
        return false;
      }
      return true;
    });
  }, [paidAthletes, minAge, maxAge, minWeight, maxWeight]);

  React.useEffect(() => {
    const allowedIds = new Set(filteredAthletesForCreation.map((athlete) => athlete.id));
    setSelectedAthleteIds((current) => current.filter((id) => allowedIds.has(id)));
  }, [filteredAthletesForCreation]);

  const selectedAthleteIdsSet = React.useMemo(
    () => new Set(selectedAthleteIds),
    [selectedAthleteIds]
  );

  const totalFights = React.useMemo(
    () => brackets.reduce((sum, bracket) => sum + bracket.fights.length, 0),
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
  }

  function openCreateModal() {
    resetCreateModal();
    setCreateOpen(true);
  }

  function closeCreateModal(open: boolean) {
    setCreateOpen(open);
    if (!open) {
      resetCreateModal();
    }
  }

  function toggleAthleteSelection(athleteId: string) {
    setSelectedAthleteIds((current) => {
      if (current.includes(athleteId)) {
        return current.filter((id) => id !== athleteId);
      }
      return [...current, athleteId];
    });
  }

  function createBracketFromSelection() {
    if (selectedAthleteIds.length === 0) return;

    const nextBracket: Bracket = {
      id: crypto.randomUUID(),
      name: `Chave ${brackets.length + 1}`,
      athleteIds: [...selectedAthleteIds],
      fights: [],
    };

    setBrackets((current) => [...current, nextBracket]);
    closeCreateModal(false);
    setActiveBracketId(nextBracket.id);
  }

  function addFight(bracketId: string) {
    setBrackets((current) =>
      current.map((bracket) =>
        bracket.id === bracketId
          ? {
              ...bracket,
              fights: [...bracket.fights, { id: crypto.randomUUID() }],
            }
          : bracket
      )
    );
  }

  function updateFight(bracketId: string, fightId: string, data: Partial<Fight>) {
    setBrackets((current) =>
      current.map((bracket) =>
        bracket.id === bracketId
          ? {
              ...bracket,
              fights: bracket.fights.map((fight) =>
                fight.id === fightId ? { ...fight, ...data } : fight
              ),
            }
          : bracket
      )
    );
  }

  function removeFight(bracketId: string, fightId: string) {
    setBrackets((current) =>
      current.map((bracket) =>
        bracket.id === bracketId
          ? {
              ...bracket,
              fights: bracket.fights.filter((fight) => fight.id !== fightId),
            }
          : bracket
      )
    );
  }

  function removeBracket(bracketId: string) {
    setBrackets((current) => current.filter((bracket) => bracket.id !== bracketId));
    if (activeBracketId === bracketId) {
      setActiveBracketId(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">Chaveamento</h1>
              <p className="text-sm text-zinc-400">
                Atletas pagos: {paidAthletes.length} • Chaves: {brackets.length} • Lutas:{" "}
                {totalFights}
              </p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
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
                <Link href="/admin/categorias">Categorias</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-8 rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white"
              >
                <Link href="/admin/cashback">Cashback</Link>
              </Button>

              <Button
                variant="ghost"
                className="cursor-pointer h-9 rounded-xl px-3 text-zinc-300 hover:bg-zinc-900 hover:text-red-700"
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
                <DropdownMenuContent
                  align="end"
                  className="border-zinc-800 bg-zinc-950 text-zinc-100"
                >
                  <Link href="/admin/painel">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">
                      Painel
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/categorias">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">
                      Categorias
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/cashback">
                    <DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">
                      Cashback
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer hover:text-red-700 data-highlighted:bg-white"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-8">
        <section className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="text-sm text-zinc-400">
              Crie uma chave filtrando idade e peso, depois selecione os atletas pagos para
              montar as lutas.
            </div>

            <Button
              onClick={openCreateModal}
              className="w-full cursor-pointer bg-white text-black hover:bg-zinc-200 md:w-auto"
            >
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
          brackets.map((bracket) => (
            <section
              key={bracket.id}
              className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-100">{bracket.name}</h2>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeBracket(bracket.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2 text-sm text-zinc-400">
                Atletas na chave: {bracket.athleteIds.length} • Lutas configuradas:{" "}
                {bracket.fights.length}
              </div>

              <Button
                variant="outline"
                onClick={() => setActiveBracketId(bracket.id)}
                className="mt-4 w-full cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800 md:w-auto"
              >
                Montar lutas
              </Button>
            </section>
          ))
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar nova chave</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Filtre por idade e peso. Apenas atletas com status pago sao exibidos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="mb-2 text-xs text-zinc-400">Idade</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="De"
                    value={filterMinAge}
                    onChange={(e) => setFilterMinAge(e.target.value)}
                    className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                  />
                  <Input
                    inputMode="numeric"
                    placeholder="Ate"
                    value={filterMaxAge}
                    onChange={(e) => setFilterMaxAge(e.target.value)}
                    className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-black/40 p-3">
                <p className="mb-2 text-xs text-zinc-400">Peso (kg)</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="De"
                    value={filterMinWeight}
                    onChange={(e) => setFilterMinWeight(e.target.value)}
                    className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                  />
                  <Input
                    inputMode="decimal"
                    placeholder="Ate"
                    value={filterMaxWeight}
                    onChange={(e) => setFilterMaxWeight(e.target.value)}
                    className="h-9 rounded-lg border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-zinc-300">
              Atletas encontrados: {filteredAthletesForCreation.length} • Selecionados:{" "}
              {selectedAthleteIds.length}
            </div>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-zinc-800 bg-black/40 p-3">
              {filteredAthletesForCreation.length === 0 ? (
                <div className="py-6 text-center text-sm text-zinc-400">
                  Nenhum atleta pago encontrado para os filtros informados.
                </div>
              ) : (
                filteredAthletesForCreation.map((athlete) => (
                  <label
                    key={athlete.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2 hover:bg-zinc-900/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAthleteIdsSet.has(athlete.id)}
                      onChange={() => toggleAthleteSelection(athlete.id)}
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
                onClick={() => closeCreateModal(false)}
                className="cursor-pointer border-zinc-700 bg-zinc-900/20 text-zinc-100 hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={createBracketFromSelection}
                disabled={selectedAthleteIds.length === 0}
                className="cursor-pointer bg-white text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Criar chave com selecionados
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeBracket)} onOpenChange={(open) => !open && setActiveBracketId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-5xl">
          {activeBracket ? (
            <>
              <DialogHeader>
                <DialogTitle>{activeBracket.name}</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Selecione atletas desta chave para montar as lutas.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {activeBracketAthletes.length === 0 ? (
                  <div className="rounded-xl border border-zinc-800 bg-black/40 p-4 text-sm text-zinc-400">
                    Esta chave nao possui atletas vinculados.
                  </div>
                ) : null}

                {activeBracket.fights.map((fight, idx) => (
                  <div key={fight.id} className="space-y-3 rounded-xl border border-zinc-800 p-4">
                    <div className="text-sm text-zinc-400">Luta {idx + 1}</div>

                    {(["a", "b"] as const).map((side) => (
                      <select
                        key={side}
                        className="w-full cursor-pointer rounded-md border border-zinc-800 bg-black p-2 text-zinc-100"
                        value={fight[side]?.id ?? ""}
                        onChange={(e) => {
                          const athlete = activeBracketAthletes.find((a) => a.id === e.target.value);
                          updateFight(activeBracket.id, fight.id, { [side]: athlete });
                        }}
                      >
                        <option value="">Selecionar atleta</option>
                        {activeBracketAthletes.map((athlete) => (
                          <option key={athlete.id} value={athlete.id}>
                            {formatAthleteLabel(athlete)}
                          </option>
                        ))}
                      </select>
                    ))}

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        className="w-full cursor-pointer sm:w-auto"
                        size="sm"
                        onClick={() => updateFight(activeBracket.id, fight.id, { winner: "a" })}
                      >
                        Vencedor A
                      </Button>
                      <Button
                        className="w-full cursor-pointer sm:w-auto"
                        size="sm"
                        onClick={() => updateFight(activeBracket.id, fight.id, { winner: "b" })}
                      >
                        Vencedor B
                      </Button>
                      <Button
                        className="w-full cursor-pointer sm:w-auto"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFight(activeBracket.id, fight.id)}
                      >
                        Remover luta
                      </Button>
                    </div>

                    {fight.winner ? (
                      <div className="text-sm text-emerald-400">
                        Vencedor: {fight.winner === "a" ? fight.a?.nome : fight.b?.nome}
                      </div>
                    ) : null}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() => addFight(activeBracket.id)}
                  className="w-full cursor-pointer border-dashed border-zinc-700 bg-zinc-900/20 py-6 text-zinc-100 hover:bg-zinc-800 md:py-8"
                >
                  + Adicionar nova luta
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
