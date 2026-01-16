import Link from "next/link";
import { Button } from "../_components/ui/button";

export default function Cash() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 py-10 md:py-16 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Pagamento da Inscrição
          </h1>
          <p className="text-zinc-400">
            Finalize o pagamento para confirmar sua participação
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-6">
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

          {/* PIX */}
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl shadow-sm p-6 backdrop-blur">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/15 rounded-xl text-red-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Pagamento via PIX
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Copie a chave abaixo para realizar o pagamento
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 p-4 bg-black/40 rounded-xl border border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Valor:</span>
                  <span className="font-semibold text-lg text-zinc-100">R$ 100,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Titular:</span>
                  <span className="font-medium text-zinc-200">Federação de Jiu-Jitsu</span>
                </div>

                <div className="border-t border-zinc-800 pt-3">
                  <span className="text-sm text-zinc-400 block mb-2">
                    Chave PIX: <strong>(Telefone)</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2 rounded-lg text-sm font-mono break-all border border-zinc-800 text-zinc-100">
                      22999809455
                    </code>

                    <Button
                      className="cursor-pointer h-9 rounded-md px-3 shrink-0 bg-red-600 hover:bg-red-500 text-white"
                      type="button"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
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
              <Button
                className="cursor-pointer rounded-xl h-10 px-4 bg-transparent border border-zinc-800 text-zinc-200 hover:bg-zinc-900"
                type="button"
              >
                Voltar para o início
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}
