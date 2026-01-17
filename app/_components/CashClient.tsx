"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Button } from "../_components/ui/button";

type CashData = {
  id: string;
  nome: string;
  wpp: string;
  valor: number;
  mods: { gi: boolean; nogi: boolean; abs: boolean; festival: boolean };
};

export default function CashClient() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [data, setData] = React.useState<CashData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
  
    React.useEffect(() => {
      if (!id) {
        setError("Inscrição não encontrada. Volte e faça a inscrição novamente.");
        setLoading(false);
        return;
      }
  
      (async () => {
        try {
          const res = await fetch(`/api/cash?id=${encodeURIComponent(id)}`);
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error ?? "Erro ao carregar pagamento");
          setData(json);
        } catch (e: any) {
          setError(e?.message ?? "Erro ao carregar pagamento");
        } finally {
          setLoading(false);
        }
      })();
    }, [id]);
  
    const valorFormatado = React.useMemo(() => {
      if (!data) return "";
      return data.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }, [data]);
  
    const modalidadesLabel = React.useMemo(() => {
      if (!data) return "";
      const arr = [
        data.mods.gi ? "Gi" : null,
        data.mods.nogi ? "NoGi" : null,
        data.mods.abs ? "Absoluto" : null,
        data.mods.festival ? "Festival" : null,
      ].filter(Boolean);
      return arr.join(", ");
    }, [data]);

  return (
    <div className="min-h-screen gap-3 bg-black text-zinc-100 py-10 md:py-16 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
       <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />
    <div className="min-h-screen bg-black gap-3 text-zinc-100 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto gap-3">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Pagamento da Inscrição</h1>
          <p className="text-zinc-400 mb-3">Finalize o pagamento para confirmar sua participação</p>
           {/* Aviso */}
           <div className="flex gap-3 p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/30 text-emerald-200">
             <div className="shrink-0 mt-0.5">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Inscrição registrada com sucesso</h4>
              <div className="text-sm text-emerald-200/90">
                Para confirmar, realize o pagamento via PIX e envie o comprovante no WhatsApp informado, com o nome completo do atleta.
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
              Carregando...
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/40 p-6 text-red-200">
              {error}
            </div>
          )}

          {data && (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <div className="text-sm text-zinc-400">Atleta</div>
                <div className="text-lg font-semibold">{data.nome}</div>
                <div className="text-sm text-zinc-400">{data.wpp}</div>
                <div className="mt-3 text-sm text-zinc-400">
                  Modalidades: <span className="text-zinc-200">{modalidadesLabel || "-"}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Valor:</span>
                  <span className="font-semibold text-lg">{valorFormatado}</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-sm text-zinc-400">Titular:</span>
                   <span className="font-medium text-zinc-200">Federação de Jiu-Jitsu</span>
                 </div>

                <div className="mt-4 border-t border-zinc-800 pt-4">
                  <span className="text-sm text-zinc-400 block mb-2">
                    Chave PIX: <strong>(Telefone)</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/40 px-3 py-2 rounded-lg text-sm font-mono break-all border border-zinc-800">
                      22999809455
                    </code>
                    <Button className="cursor-pointer h-9 rounded-md px-3">
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
                {/* Comprovante */}
           <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl shadow-sm p-6 backdrop-blur">
             <div className="mb-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800">
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-zinc-200"
                  >
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Envio do Comprovante
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Após pagar, envie o comprovante para confirmar sua inscrição
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-200">
                  Envie o comprovante para{" "}
                  <strong>(22) 99980-9455 - Bruno Carvalho</strong> informando o
                  nome completo do atleta.
                </p>

                <div className="border-t border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-400 block mb-2">
                    Mensagem sugerida:
                  </span>
                  <code className="flex-1 flex bg-black/50 px-3 py-2 w-full rounded-lg text-sm border border-zinc-800 text-zinc-100">
                    Pagamento Inscrição - Nome do Atleta
                  </code>
                </div>
              </div>
              <Link href="https://wa.me/+5522999809455" target="_blank">
                <Button
                  className="cursor-pointer w-full rounded-xl h-11 bg-zinc-100 text-black hover:bg-emerald-200/90"
                  type="button"
                >
                  Abrir WhatsApp
                </Button>
              </Link>  
            </div>
          </div>
              <div className="mt-8 text-center">
                <Link href="/">
                  <Button className="cursor-pointer rounded-xl">Voltar para o início</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}