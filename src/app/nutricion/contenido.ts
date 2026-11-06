import type { AccentName } from "@/lib/theme";

/** Recetas de la lista. El detalle de cada una vive en receta/data.ts. */
export const RECIPES: {
  id: string;
  name: string;
  accent: AccentName;
  time: string;
  difficulty: string;
}[] = [
  { id: "sopa-verduras", name: "Sopa de Verduras", accent: "orange", time: "30 min", difficulty: "Fácil" },
  { id: "ensalada-atun", name: "Ensalada con Atún", accent: "green", time: "15 min", difficulty: "Muy fácil" },
  { id: "avena-fruta", name: "Avena con Fruta", accent: "cyan", time: "10 min", difficulty: "Muy fácil" },
];

export const TIPS = [
  "Beba al menos 8 vasos de agua al día.",
  "Coma 5 porciones de frutas y verduras cada día.",
  "Reduzca la sal para cuidar su corazón.",
  "Coma pescado 2 veces por semana.",
];
