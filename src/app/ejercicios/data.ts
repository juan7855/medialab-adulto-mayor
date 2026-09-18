import { Armchair, Dumbbell, Footprints, Scale, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export type Level = "Ligero" | "Moderado";

/** El acento comunica la intensidad: verde suave, ámbar exige algo más. */
export const LEVEL_ACCENT: Record<Level, AccentName> = {
  Ligero: "green",
  Moderado: "orange",
};

export const LEVELS: Level[] = ["Ligero", "Moderado"];

/**
 * El catálogo de ejercicios ahora vive en la base de datos, propio de cada
 * paciente (ver src/db/schema.ts, tabla exercises). Cada fila guarda un
 * emoji, no un icono de Lucide directamente — esto traduce el emoji
 * sembrado a un icono de línea, mismo patrón que RutinaList con
 * routineActivities.emoji.
 */
export const EXERCISE_ICONS: Record<string, LucideIcon> = {
  "🚶": Footprints,
  "🧘": Armchair,
  "⚖️": Scale,
  "💪": Dumbbell,
};

export const EXERCISE_ICON_FALLBACK: LucideIcon = Footprints;

/** "900" -> "15 min". La API sólo manda segundos; el texto se arma aquí. */
export function formatDuration(seconds: number): string {
  const minutos = Math.round(seconds / 60);
  return `${minutos} min`;
}

/** Fila de la tabla `exercises`, tal como la devuelve la API. */
export interface Exercise {
  id: number;
  name: string;
  level: Level;
  emoji: string;
  durationSeconds: number;
  description: string;
  steps: string[];
  tip: string;
}
