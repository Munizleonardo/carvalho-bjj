export type Belt = "BRANCA" | "AZUL" | "ROXA" | "MARROM" | "PRETA";
export type ModalityFilter = "ALL" | "GI" | "NOGI" | "ABS";

export type ParticipantAdmin = {
  id: string;

  full_name: string; // banco: nome
  whatsapp: string;  // banco: wpp
  age: number;       // banco: idade
  weight_kg: number; // banco: peso

  belt_color: Belt;  // banco: faixa
  category: string;  // banco: categoria
  academy?: string | null; // banco: academia

  mod_gi: boolean;
  mod_nogi: boolean;
  mod_abs: boolean;

  created_at?: string;
};

export const beltLabel: Record<Belt, string> = {
  BRANCA: "Branca",
  AZUL: "Azul",
  ROXA: "Roxa",
  MARROM: "Marrom",
  PRETA: "Preta",
};

export function beltDotClasses(belt: Belt) {
  switch (belt) {
    case "BRANCA":
      return "bg-white border-zinc-300";
    case "AZUL":
      return "bg-blue-600 border-blue-600";
    case "ROXA":
      return "bg-violet-600 border-violet-600";
    case "MARROM":
      return "bg-amber-800 border-amber-800";
    case "PRETA":
      return "bg-zinc-950 border-zinc-950";
    default:
      return "bg-zinc-500 border-zinc-500";
  }
}
