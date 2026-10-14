import { CookingPot, Croissant, Salad, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

/**
 * El menú (desayuno/almuerzo/cena) ahora vive en la base de datos, propio
 * de cada paciente (ver src/db/schema.ts, tabla meals). Mismo patrón de
 * emoji → icono que en ejercicios y Mente Activa.
 */
export const MEAL_ICONS: Record<string, LucideIcon> = {
  "🥐": Croissant,
  "🍲": CookingPot,
  "🥗": Salad,
};

export const MEAL_ICON_FALLBACK: LucideIcon = CookingPot;

/** Fila de la tabla `meals`, tal como la devuelve la API. */
export interface Meal {
  id: number;
  slug: string;
  name: string;
  /** Cómo se nombra en una pregunta: "¿Ya tomó el desayuno?" */
  article: string;
  time: string;
  emoji: string;
  accent: AccentName;
  items: string[];
}
