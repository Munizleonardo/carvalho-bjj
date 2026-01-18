"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Button } from "../_components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

type CashData = {
  id: string;
  nome: string;
  wpp: string;
  valor: number;
  mods: { gi: boolean; nogi: boolean; abs: boolean; festival: boolean };
  pix?: {
    qr_code_base64: string;
    qr_code: string;
    status: "pending" | "approved";
  };
};



export default function CashClient() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const router = useRouter();

  const [data, setData] = React.useState<CashData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data?.pix?.status === "approved") {
      const t = setTimeout(() => {
        router.push("/");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [data, router]);
  
  React.useEffect(() => {
    if (!id) return;
    if (!data) return;
    if (data.pix?.status === "approved") return;
  
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payments/status?registrationId=${encodeURIComponent(id)}`
        );
  
        if (!res.ok) return;
  
        const json = await res.json();
  
        if (json.status === "approved") {
          setData((prev) =>
            prev && prev.pix
              ? {
                  ...prev,
                  pix: {
                    ...prev.pix,
                    status: "approved",
                  },
                }
              : prev
          );
        }
      } catch {
        // silêncio proposital
      }
    }, 5000); // 5s é o ponto ideal
  
    return () => clearInterval(interval);
  }, [id, data]);

  
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
              <h4 className="font-medium mb-1">Inscrição Quase Finalizada</h4>
              <div className="text-sm text-emerald-200/90">
                Para confirmar, realize o pagamento via PIX pelo QR Code ou Pix Copia e Cola abaixo.
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

                 <div className="mt-4 border-t border-zinc-800 pt-4 space-y-4">
                  <span className="text-sm text-zinc-400 block">
                    Pague via PIX para confirmar sua inscrição
                  </span>

                  <div className="flex justify-center">
                    {data.pix ? (
                      <Image
                        src={`data:image/png;base64,${data.pix.qr_code_base64}`}
                        alt="QR Code PIX"
                        className="w-52 h-52 rounded-xl bg-white p-2"
                      />
                    ) : (
                      <div className="w-52 h-52 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm text-center p-4">
                        Aguardando QR Code...
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-sm text-zinc-400 block mb-2">
                      PIX Copia e Cola
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-black/40 px-3 py-2 rounded-lg text-sm font-mono break-all border border-zinc-800 min-h-[40px] flex items-center">
                        {data.pix?.qr_code || (
                          <span className="text-zinc-600 italic">
                            Aguardando geração do PIX...
                          </span>
                        )}
                      </code>
                      <Button
                        className="cursor-pointer h-9 rounded-md px-3"
                        onClick={() => {
                          if (data.pix?.qr_code) {
                            navigator.clipboard.writeText(data.pix.qr_code);
                          }
                        }}
                        disabled={!data.pix?.qr_code}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
              </div>

              </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-3">
                <p className="text-sm text-zinc-200">
                  Após confirmação do pagamento a inscrição será concluída e a página redirecionada.
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}