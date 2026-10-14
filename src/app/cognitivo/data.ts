import { Album, Brain, Calculator, Hash, Shapes, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

/** La plataforma del cuidador puede definir otros niveles además de estos. */
export type Level = string;

const LEVEL_ACCENT: Record<string, AccentName> = {
  "fácil": "blue",
  facil: "blue",
  medio: "cyan",
  reto: "purple",
  "difícil": "purple",
};

/** El acento comunica la exigencia: azul tranquilo, morado para el reto. */
export function accentDeNivel(level: string): AccentName {
  return LEVEL_ACCENT[level.toLowerCase()] ?? "blue";
}

const ORDEN = Object.keys(LEVEL_ACCENT);

/** Los niveles que de verdad existen en el catálogo, de menos a más difíciles. */
export function nivelesDe(activities: { level: string }[]): Level[] {
  const presentes = [...new Set(activities.map((a) => a.level))];
  const rango = (l: string) => {
    const i = ORDEN.indexOf(l.toLowerCase());
    return i === -1 ? ORDEN.length : i;
  };
  return presentes.sort((a, b) => rango(a) - rango(b));
}

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
