import { listParticipantsAdmin } from "@/app/_lib/actions/adminInscricoes";
import AdminInscricoesClient from "./AdminInscricoesClient";

export default async function AdminInscricoesPage() {
  const participants = await listParticipantsAdmin();
  return <AdminInscricoesClient initialParticipants={participants} />;
}
