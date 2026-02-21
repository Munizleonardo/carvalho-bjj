"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";

type Participante = {
  id: string;
  nome: string;
  cpf: string;
  faixa: string;
  categoria?: string;
  peso?: number;
  mod_gi: boolean;
  mod_nogi: boolean;
  mod_gi_extra: boolean;
  status: "paid" | "pending";
};

export default function CheckCpfPage() {
  const router = useRouter();

  const [cpf, setCpf] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [participante, setParticipante] = React.useState<Participante | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const normalizedCpf = cpf.replace(/\D/g, "");

  async function handleCheckCpf() {
    setLoading(true);
    setError(null);
    setParticipante(null);

    try {
      const res = await fetch("/api/participantes/by-cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: normalizedCpf }),
      });

      if (!res.ok) throw new Error("Erro ao consultar CPF");

      const data: Participante | null = await res.json();

      if (!data?.id) {
        window.location.href = `/inscricao?cpf=${encodeURIComponent(normalizedCpf)}`;
        return;
      }

      setParticipante(data);
    } catch {
      setError("Erro ao consultar CPF.");
    } finally {
      setLoading(false);
    }
  }

  function goToPayment() {
    if (!participante) return;
    router.push(`/cash?id=${encodeURIComponent(participante.id)}`);
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-sm backdrop-blur">
          {!participante ? (
            <>
              <h1 className="text-3xl font-semibold mb-2">Verificacao de Inscricao</h1>
              <p className="text-zinc-400 mb-6">
                Informe o CPF do atleta para localizar sua inscricao.
              </p>

              <Input
                placeholder="CPF do atleta"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mb-4 rounded-xl bg-black/40 border-zinc-800"
              />

              {error && (
                <div className="mb-3 rounded-xl border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button
                className="cursor-pointer w-full h-12 rounded-xl bg-red-600 hover:bg-red-500"
                disabled={loading || normalizedCpf.length !== 11}
                onClick={handleCheckCpf}
              >
                {loading ? "Consultando..." : "Continuar"}
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Dados da inscricao</h2>

              <div className="space-y-2 text-sm text-zinc-300">
                <p>
                  <strong>Nome:</strong> {participante.nome}
                </p>
                <p>
                  <strong>CPF:</strong> {participante.cpf}
                </p>
                <p>
                  <strong>Faixa:</strong> {participante.faixa}
                </p>
                <p>
                  <strong>Categoria:</strong> {participante.categoria ?? "-"}
                </p>
                <p>
                  <strong>Peso:</strong> {participante.peso ?? "-"}
                </p>
                <p>
                  <strong>Modalidades:</strong>{" "}
                  {[
                    participante.mod_gi ? "Gi" : null,
                    participante.mod_nogi ? "NoGi" : null,
                    participante.mod_gi_extra ? "Absoluto" : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>
                  <strong>Status:</strong> {participante.status === "paid" ? "PAGO" : "PENDENTE"}
                </p>
              </div>

              {participante.status === "paid" ? (
                <div className="mt-5 rounded-xl bg-green-900/30 p-3 text-green-300 text-sm">
                  Esta inscricao ja foi paga e esta confirmada.
                </div>
              ) : (
                <Button
                  className="cursor-pointer mt-6 w-full h-12 rounded-xl bg-red-600 hover:bg-red-500"
                  onClick={goToPayment}
                >
                  Pagar Inscricao
                </Button>
              )}
            </>
          )}

          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button className="cursor-pointer bg-red-600/10 text-white hover:bg-red-600/20">
                Voltar para o inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

