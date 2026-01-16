import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { listParticipantsAdmin } from "@/app/_lib/actions/adminInscricoes";
import type { Belt, ModalityFilter, ParticipantAdmin } from "@/app/_lib/types";
import { beltLabel } from "@/app/_lib/types";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function filterList(
  list: ParticipantAdmin[],
  {
    q,
    belt,
    mod,
    minW,
    maxW,
  }: { q?: string; belt?: string; mod?: string; minW?: string; maxW?: string }
) {
  const qq = q ? normalize(q) : "";
  const beltFilter = (belt as "ALL" | Belt | undefined) ?? "ALL";
  const modFilter = (mod as ModalityFilter | undefined) ?? "ALL";
  const min = minW ? Number(minW) : undefined;
  const max = maxW ? Number(maxW) : undefined;

  return list
    .filter((p) => {
      if (!qq) return true;
      return (
        normalize(p.full_name).includes(qq) ||
        normalize(p.whatsapp).includes(qq) ||
        normalize(p.academy ?? "").includes(qq)
      );
    })
    .filter((p) => (beltFilter === "ALL" ? true : p.belt_color === beltFilter))
    .filter((p) => {
      if (modFilter === "ALL") return true;
      if (modFilter === "GI") return p.mod_gi;
      if (modFilter === "NOGI") return p.mod_nogi;
      if (modFilter === "ABS") return p.mod_abs;
      return true;
    })
    .filter((p) => {
      if (min !== undefined && !Number.isNaN(min) && p.weight_kg < min) return false;
      if (max !== undefined && !Number.isNaN(max) && p.weight_kg > max) return false;
      return true;
    });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const all = await listParticipantsAdmin();
  const filtered = filterList(all, {
    q: searchParams.get("q") ?? undefined,
    belt: searchParams.get("belt") ?? undefined,
    mod: searchParams.get("mod") ?? undefined,
    minW: searchParams.get("minW") ?? undefined,
    maxW: searchParams.get("maxW") ?? undefined,
  });

  const doc = new PDFDocument({ size: "A4", margin: 36 });

  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(16).text("Relatório de Inscrições", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#666").text(`Total filtrado: ${filtered.length}`);
  doc.fillColor("#000");
  doc.moveDown(1);

  doc.fontSize(11).text("Atleta", 36, doc.y, { continued: true });
  doc.text("Idade", 250, doc.y, { continued: true });
  doc.text("Peso", 300, doc.y, { continued: true });
  doc.text("Faixa", 350, doc.y, { continued: true });
  doc.text("Categoria", 410, doc.y);
  doc.moveDown(0.25);
  doc.moveTo(36, doc.y).lineTo(559, doc.y).stroke();
  doc.moveDown(0.5);

  for (const p of filtered) {
    const lineY = doc.y;

    const mods = [
      p.mod_gi ? "Gi" : null,
      p.mod_nogi ? "NoGi" : null,
      p.mod_abs ? "Abs" : null,
    ]
      .filter(Boolean)
      .join(", ");

    doc.fontSize(10).text(`${p.full_name} (${p.whatsapp})`, 36, lineY);
    doc.text(String(p.age), 250, lineY);
    doc.text(`${p.weight_kg} kg`, 300, lineY);
    doc.text(beltLabel[p.belt_color], 350, lineY);
    doc.text(p.category || "-", 410, lineY);

    doc.fontSize(9).fillColor("#666").text(`${p.academy ?? "-"} | ${mods || "-"}`, 36, lineY + 12);
    doc.fillColor("#000");

    doc.moveDown(1.2);

    if (doc.y > 760) doc.addPage();
  }

  doc.end();
  const pdf = await done;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="inscricoes.pdf"`,
    },
  });
}
