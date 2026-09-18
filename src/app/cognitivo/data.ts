import { Album, Brain, Calculator, Hash, Shapes, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export type Level = "Fácil" | "Reto";

/** El acento comunica la exigencia: azul tranquilo, morado para el reto. */
export const LEVEL_ACCENT: Record<Level, AccentName> = {
  "Fácil": "blue",
  Reto: "purple",
};

export const LEVELS: Level[] = ["Fácil", "Reto"];

/**
 * El catálogo de Mente Activa ahora vive en la base de datos, propio de
 * cada paciente (ver src/db/schema.ts, tabla cognitive_activities). Mismo
 * patrón de emoji → icono que en ejercicios.
 */
export const COGNITIVE_ICONS: Record<string, LucideIcon> = {
  "🧠": Brain,
  "🧮": Calculator,
  "🗂️": Shapes,
  "📔": Album,
  "🔢": Hash,
};

export const COGNITIVE_ICON_FALLBACK: LucideIcon = Brain;

/** Fila de la tabla `cognitive_activities`, tal como la devuelve la API. */
export interface CognitiveActivity {
  id: number;
  name: string;
  level: Level;
  emoji: string;
  durationLabel: string;
  description: string;
  steps: string[];
  tip: string;
}
