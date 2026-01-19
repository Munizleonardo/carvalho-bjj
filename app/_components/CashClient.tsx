"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Button } from "../_components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type CashData = {
  id: string;
  nome: string;
  wpp: string;
  valor: number;
  mods: { gi: boolean; nogi: boolean; abs: boolean; festival: boolean };
  pix?: {
    qrCodeBase64: string;
    pixCopyPaste: string;
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

  // Redireciona após pagamento aprovado
  React.useEffect(() => {
    if (data?.pix?.status === "approved") {
      const t = setTimeout(() => {
        router.push("/");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [data, router]);

  // Polling de status do pagamento
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
    }, 5000);

    return () => clearInterval(interval);
  }, [id, data]);

  // Carrega dados da inscrição
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

  // 🔑 GERA O PIX (QR CODE)
  React.useEffect(() => {
    if (!id) return;
    if (!data) return;
    if (data.pix) return; // já existe PIX, não recria

    (async () => {
      try {
        const res = await fetch("/api/payments/pix", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId: id,
            amount: data.valor,
          }),
        });

        if (!res.ok) return;

        const json = await res.json();

        setData((prev) =>
          prev
            ? {
                ...prev,
                pix: {
                  pixCopyPaste: json.pixCopyPaste,
                  qrCodeBase64: json.qrCodeBase64,
                  status: json.status,
                },
              }
            : prev
        );
      } catch {
        // silêncio proposital
      }
    })();
  }, [id, data]);

  const valorFormatado = React.useMemo(() => {
    if (!data) return "";
    return data.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
            <h1 className="text-3xl font-bold mb-2">Pagamento da Inscrição</h1>
            <p className="text-zinc-400 mb-3">
              Finalize o pagamento para confirmar sua participação
            </p>

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
                    Modalidades:{" "}
                    <span className="text-zinc-200">
                      {modalidadesLabel || "-"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Valor:</span>
                    <span className="font-semibold text-lg">
                      {valorFormatado}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-zinc-800 pt-4 space-y-4">
                    <div className="flex justify-center">
                      {data.pix ? (
                        <Image
                          src={`data:image/png;base64,${data.pix.qrCodeBase64}`}
                          alt="QR Code PIX"
                          width={208}
                          height={208}
                          className="rounded-xl bg-white p-2"
                        />
                      ) : (
                        <div className="w-52 h-52 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm text-center p-4">
                          Aguardando QR Code...
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-zinc-400 block mb-2">
                        PIX Copia e Cola
                      </span>
                      <div className="flex-1 gap-2 md:flex">
                        <code className="mb-3 md:mb-0 w-full flex bg-black/40 px-3 py-2 rounded-lg text-sm font-mono break-all border border-zinc-800 min-w-[300px]" >
                          <input type="text" value={data.pix?.pixCopyPaste} readOnly className="w-full"/>
                        </code>
                        <Button
                          className="md:flex md:flex-row flex justify-center items-center cursor-pointer bg-red-600 hover:bg-black"
                          onClick={() =>
                            data.pix?.pixCopyPaste &&
                            navigator.clipboard.writeText(data.pix?.pixCopyPaste)
                          }
                          disabled={!data.pix?.pixCopyPaste}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
                  <p className="text-center text-sm text-zinc-200">
                    Após confirmação do pagamento a inscrição será concluída.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <Link href="/">
                    <Button className="cursor-pointer inline-flex items-center gap-2 text-sm bg-red-600/10 text-white hover:text-zinc-100 mb-8 transition-colors">
                      Voltar para o início
                    </Button>
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
