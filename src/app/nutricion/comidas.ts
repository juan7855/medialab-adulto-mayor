import { CookingPot, Croissant, Salad, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export interface Meal {
  id: string;
  name: string;
  /** Cómo se nombra en una pregunta: "¿Ya tomaste el desayuno?" */
  article: string;
  time: string;
  icon: LucideIcon;
  accent: AccentName;
  items: string[];
}

/**
 * Las comidas del día son contenido fijo, no filas de la base de datos.
 * Lo que sí se guarda es si ya se comieron (tabla meal_logs).
 */
export const MEALS: Meal[] = [
  {
    id: "desayuno",
    name: "Desayuno",
    article: "el desayuno",
    time: "7:00 – 8:00",
    icon: Croissant,
    accent: "yellow",
    items: ["Avena con fruta", "Té o leche", "Pan integral"],
  },
  {
    id: "almuerzo",
    name: "Almuerzo",
    article: "el almuerzo",
    time: "12:00 – 13:00",
    icon: CookingPot,
    accent: "orange",
    items: ["Sopa de verduras", "Pollo al vapor", "Ensalada verde", "Arroz integral"],
  },
  {
    id: "cena",
    name: "Cena",
    article: "la cena",
    time: "18:00 – 19:00",
    icon: Salad,
    accent: "green",
    items: ["Ensalada con atún", "Pan integral", "Fruta de temporada"],
  },
];
