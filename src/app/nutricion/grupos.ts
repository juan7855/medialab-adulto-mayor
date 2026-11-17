import { Apple, Beef, Droplet, Milk, Wheat, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

/**
 * Los grupos principales de alimentos viven en la base de datos, propios de
 * cada paciente (ver src/db/schema.ts, tabla food_groups): la guía de cada
 * grupo cambia según su condición. Mismo patrón emoji → icono que en
 * ejercicios y el menú.
 */
export const FOOD_GROUP_ICONS: Record<string, LucideIcon> = {
  "🍞": Wheat,
  "🍗": Beef,
  "🥑": Droplet,
  "🍎": Apple,
  "🥛": Milk,
};

export const FOOD_GROUP_ICON_FALLBACK: LucideIcon = Apple;

/** Fila de la tabla `food_groups`, tal como la devuelve la API. */
export interface FoodGroup {
  id: number;
  name: string;
  emoji: string;
  description: string;
  accent: AccentName;
}
