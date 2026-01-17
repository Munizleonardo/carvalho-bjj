console.log("TYPES FILE LOADED");

export type ModalityFilter = "ALL" | "GI" | "NOGI" | "ABS";

export const beltDotClasses: Record<BeltColor, string> = {
  BRANCA: "border-white",
  AZUL: "border-blue-500",
  ROXA: "border-purple-500",
  MARROM: "border-brown-500",
  PRETA: "border-black",
};

export const beltLabel: Record<BeltColor, string> = {
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
  "BRANCA",
  "AZUL",
  "ROXA",
  "MARROM",
  "PRETA",
] as const;

export const genderEnum = ["M", "F"] as const;

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

  belt_color: BeltColor; // banco: faixa 
  category: string; // banco: categoria 
  academy?: string | null; // banco: academia 

  mod_gi: boolean; 
  mod_nogi: boolean; 
  mod_abs: boolean;

  created_at?: string; 
};