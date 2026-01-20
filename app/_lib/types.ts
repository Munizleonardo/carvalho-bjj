// console.log("TYPES FILE LOADED");

export type ModalityFilter = "ALL" | "GI" | "NOGI" | "ABS";

export const beltDotClasses: Record<BeltColor, string> = {
  CINZA: "border-gray-400 bg-gray-400",
  AMARELA: "border-yellow-400 bg-yellow-400",
  LARANJA: "border-orange-400 bg-orange-400",
  VERDE: "border-green-500 bg-green-500",
  BRANCA: "border-white bg-white",
  AZUL: "border-blue-500 bg-blue-500",
  ROXA: "border-purple-500 bg-purple-500",
  MARROM: "border-[#cc6600] bg-[#cc6600]",
  PRETA: "border-black bg-black",
};

export const beltLabel: Record<BeltColor, string> = {
  CINZA: "Cinza",
  AMARELA: "Amarela",
  LARANJA: "Laranja",
  VERDE: "Verde",
  BRANCA: "Branca",
  AZUL: "Azul",
  ROXA: "Roxa",
  MARROM: "Marrom",
  PRETA: "Preta",
};

export const categoryEnum = [ 
  "GALO",
  "PLUMA",
  "PENA",
  "LEVE",
  "MEDIO",
  "MEIO_PESADO",
  "PESADO",
  "SUPER_PESADO",
  "PESADISSIMO",
] as const;

export const beltEnum = [
  "CINZA",
  "AMARELA",
  "LARANJA",
  "VERDE",
  "BRANCA",
  "AZUL",
  "ROXA",
  "MARROM",
  "PRETA",
] as const;

export const genderEnum = ["M", "F"] as const;
export const FESTIVAL_LIMIT = 40;
// ===== Types =====
export type Category = (typeof categoryEnum)[number];
export type BeltColor = (typeof beltEnum)[number];
export type Gender = (typeof genderEnum)[number];

export type ParticipantAdmin = { 
  id: string; 
  full_name: string; 
  cpf: string; 
  whatsapp: string; 
  age: number; 
  weight_kg: number | null; 
  gender: Gender; 
  belt_color: BeltColor; 
  category: Category | null; 
  academy?: string | null; 
  mod_gi: boolean; 
  mod_nogi: boolean; 
  mod_abs: boolean;
  festival: boolean;
  created_at?: string; 
  status: string;
};