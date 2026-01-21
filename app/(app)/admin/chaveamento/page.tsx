// app/(app)/admin/chaveamento/page.tsx
import { Suspense } from "react";
import ChaveamentoClient from "../../../_components/admin/ChaveamentoClient";

export default function ChaveamentoPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400 p-6">Carregando chaveamento...</div>}>
      <ChaveamentoClient />
    </Suspense>
  );
}
