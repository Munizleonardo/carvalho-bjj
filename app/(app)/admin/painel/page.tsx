import { listParticipantsAdmin } from "@/app/_lib/actions/adminInscricoes";
import AdminInscricoesClient from "../../../_components/admin/AdminInscricoesClient";

export const dynamic = "force-dynamic";

export default async function AdminInscricoesPage() {
  const participants = await listParticipantsAdmin();
  return <AdminInscricoesClient initialParticipants={participants} />;
}
