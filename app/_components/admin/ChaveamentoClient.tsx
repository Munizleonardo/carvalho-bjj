"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/app/_lib/auth";
import { Button } from "@/app/_components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { Menu, Trash2, X } from "lucide-react";

type Athlete = {
  id: string;
  nome: string;
  idade: number;
  peso: number | null;
  faixa: string;
  categoria: string | null;
  status: "paid" | "pending";
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
  fights: Fight[];
};

export default function ChaveamentoClient() {
  const router = useRouter();
  const [athletes, setAthletes] = React.useState<Athlete[]>([]);
  const [brackets, setBrackets] = React.useState<Bracket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeBracketId, setActiveBracketId] = React.useState<string | null>(null);

  const activeBracket = React.useMemo(
    () => brackets.find((b) => b.id === activeBracketId),
    [brackets, activeBracketId]
  );

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/chaveamento");
      const json = await res.json();
      setAthletes(json);
      setLoading(false);
    })();
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  function createBracket() {
    setBrackets((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Chave ${prev.length + 1}`,
        fights: [],
      },
    ]);
  }

  function addFight(bracketId: string) {
    setBrackets((prev) =>
      prev.map((b) =>
        b.id === bracketId
          ? {
              ...b,
              fights: [
                ...b.fights,
                { id: crypto.randomUUID() },
              ],
            }
          : b
      )
    );
  }

  function updateFight(
    bracketId: string,
    fightId: string,
    data: Partial<Fight>
  ) {
    setBrackets((prev) =>
      prev.map((b) =>
        b.id === bracketId
          ? {
              ...b,
              fights: b.fights.map((f) =>
                f.id === fightId ? { ...f, ...data } : f
              ),
            }
          : b
      )
    );
  }

  function removeFight(bracketId: string, fightId: string) {
    setBrackets((prev) =>
      prev.map((b) =>
        b.id === bracketId
          ? {
              ...b,
              fights: b.fights.filter((f) => f.id !== fightId),
            }
          : b
      )
    );
  }

  function removeBracket(bracketId: string) {
    setBrackets((prev) => prev.filter((b) => b.id !== bracketId));
    if (activeBracketId === bracketId) {
      setActiveBracketId(null);
    }
  }

  if (loading) {
    return <div className="p-6 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Chaveamento</h1>
            <p className="text-sm text-zinc-400">
              Crie chaves e configure as lutas manualmente
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              asChild
              variant="outline"
              className="h-8 cursor-pointer rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white"
            >
              <Link href="/admin/painel">Painel</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-8 cursor-pointer rounded-xl border-zinc-800 bg-zinc-950/40 hover:bg-white"
            >
              <Link href="/admin/categorias">Categorias</Link>
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
                <Button
                  variant="ghost"
                  className="h-9 w-9 cursor-pointer rounded-xl p-0 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-zinc-800 bg-zinc-950 text-zinc-100"
              >
                <Link href="/admin/painel"><DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Painel</DropdownMenuItem></Link>
                <Link href="/admin/categorias"><DropdownMenuItem className="cursor-pointer data-highlighted:bg-white">Categorias</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:text-red-700 data-highlighted:bg-white">Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="flex justify-end">
          <Button onClick={createBracket} className="bg-red-600 hover:bg-red-500 cursor-pointer">
            Criar nova chave
          </Button>
        </div>

        {brackets.map((bracket) => (
          <div
            key={bracket.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{bracket.name}</h2>
              <Button
              className="cursor-pointer"
                variant="destructive"
                size="icon"
                onClick={() => removeBracket(bracket.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-zinc-400">
              {bracket.fights.length} luta(s) configurada(s)
            </div>

            <Button
            
              variant="outline"
              onClick={() => setActiveBracketId(bracket.id)}
              className="w-full text-black cursor-pointer"
            >
              Adicionar Luta
            </Button>
          </div>
        ))}
      </main>

      {/* Modal de Chaveamento */}
      {activeBracket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-zinc-950 z-10 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-2xl font-bold">{activeBracket.name}</h2>
                <p className="text-zinc-400 text-sm">
                  Gerencie as lutas desta chave
                </p>
              </div>
              <Button
              className="cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={() => setActiveBracketId(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-4">
              {activeBracket.fights.map((fight, idx) => (
              <div
                key={fight.id}
                className="rounded-xl border border-zinc-800 p-4 space-y-3"
              >
                <div className="text-sm text-zinc-400">
                  Luta {idx + 1}
                </div>

                {(["a", "b"] as const).map((side) => (
                  <select
                    key={side}
                    className="w-full cursor-pointer rounded-md border border-zinc-800 bg-black p-2 text-zinc-100"
                    value={fight[side]?.id?.toString() ?? ""}
                    onChange={(e) => {
                      const athlete = athletes.find(
                        (a) => String(a.id) === e.target.value
                      );
                      updateFight(activeBracket.id, fight.id, {
                        [side]: athlete,
                      });
                    }}
                  >
                    <option value="">Selecionar atleta</option>
                    {athletes.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.nome} • {a.faixa} •{" "}
                        {a.peso ? `${a.peso}kg` : "-"} •{" "}
                        {a.categoria ? a.categoria : "-"}
                      </option>
                    ))}
                  </select>
                ))}

                <div className="flex gap-2">
                  <Button
                  className="cursor-pointer"
                    size="sm"
                    onClick={() =>
                      updateFight(activeBracket.id, fight.id, { winner: "a" })
                    }
                  >
                    Vencedor A
                  </Button>
                  <Button
                  className="cursor-pointer"
                    size="sm"
                    onClick={() =>
                      updateFight(activeBracket.id, fight.id, { winner: "b" })
                    }
                  >
                    Vencedor B
                  </Button>
                  <Button
                  className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFight(activeBracket.id, fight.id)}
                  >
                    Remover luta
                  </Button>
                </div>

                {fight.winner && (
                  <div className="text-emerald-400 text-sm">
                    Vencedor:{" "}
                    {fight.winner === "a"
                      ? fight.a?.nome
                      : fight.b?.nome}
                  </div>
                )}
              </div>
            ))}

              <Button
              
                variant="outline"
                onClick={() => addFight(activeBracket.id)}
                className="w-full py-8 border-dashed text-black cursor-pointer"
              >
                + Adicionar nova luta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
