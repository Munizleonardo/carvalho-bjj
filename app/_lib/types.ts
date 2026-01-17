console.log("TYPES FILE LOADED");

export type ModalityFilter = "ALL" | "GI" | "NOGI" | "ABS" | "FESTIVAL";

export const beltDotClasses: Record<BeltColor, string> = {
  BRANCA: "bg-white border-white",
  CINZA: "bg-gray-500 border-gray-500",
  AMARELA: "bg-yellow-500 border-yellow-500",
  LARANJA: "bg-orange-500 border-orange-500",
  VERDE: "bg-green-500 border-green-500",
  AZUL: "bg-blue-500 border-blue-500",
  ROXA: "bg-purple-500 border-purple-500",
  MARROM: "bg-[#993300] border-[#993300]",
  PRETA: "bg-black border-black",
};

export const beltLabel: Record<BeltColor, string> = {
  BRANCA: "Branca",
  CINZA: "Cinza",
  AMARELA: "Amarela",
  LARANJA: "Laranja",
  VERDE: "Verde",
  AZUL: "Azul",
  ROXA: "Roxa",
  MARROM: "Marrom",
  PRETA: "Preta",
};

export const categoryEnum = [  
  "FESTIVAL",
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
  "BRANCA",
  "CINZA",
  "AMARELA",
  "LARANJA",
  "VERDE",
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

  full_name: string; // banco: nome
  whatsapp: string; // banco: wpp 
  age: number; // banco: idade 
  weight_kg: number; // banco: peso 
  gender: Gender; // banco: sexo 
  belt_color: BeltColor; // banco: faixa 
  category: string; // banco: categoria 
  
  academy?: string | null; // banco: academia 

  mod_gi: boolean; 
  mod_nogi: boolean; 
  mod_abs: boolean;
  festival: boolean;

  created_at?: string; 
};