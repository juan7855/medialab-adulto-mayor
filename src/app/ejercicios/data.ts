import { Armchair, Dumbbell, Footprints, Scale, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

/** La plataforma del cuidador define sus propios niveles (Suave, Moderada...). */
export type Level = string;

const LEVEL_ACCENT: Record<string, AccentName> = {
  descanso: "cyan",
  suave: "green",
  ligero: "green",
  moderada: "orange",
  moderado: "orange",
  intensa: "red",
};

/** El acento comunica la intensidad: verde suave, ámbar exige algo más. */
export function accentDeNivel(level: string): AccentName {
  return LEVEL_ACCENT[level.toLowerCase()] ?? "green";
}

const ORDEN = Object.keys(LEVEL_ACCENT);

/** Los niveles que de verdad existen en el catálogo, de menos a más intensos. */
export function nivelesDe(exercises: { level: string }[]): Level[] {
  const presentes = [...new Set(exercises.map((e) => e.level))];
  const rango = (l: string) => {
    const i = ORDEN.indexOf(l.toLowerCase());
    return i === -1 ? ORDEN.length : i;
  };
  return presentes.sort((a, b) => rango(a) - rango(b));
}

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
  routineId: number | null;
  routineNumber: number | null;
  dayOfWeek: number;
}

/**
 * Nombre descriptivo de cada rutina para la persona. El número de la rutina
 * (recursos/Rutinas_con_avatares.docx) no se muestra: cada paciente recibe
 * un grupo distinto, y ver "Rutina 5" sin la 1 le hace pensar que se saltó
 * algo.
 */
const NOMBRE_RUTINA: Record<number, string> = {
  1: "Equilibrio al caminar",
  2: "Fuerza funcional",
  3: "Movilidad y coordinación",
  4: "Estabilidad de piernas",
  5: "Integración y coordinación",
};

/** Título de la tarjeta: en días de rutina, el nombre descriptivo; en los demás, el suyo. */
export function tituloDeEjercicio(ex: Pick<Exercise, "name" | "routineNumber">): string {
  if (ex.routineNumber == null) return ex.name;
  return NOMBRE_RUTINA[ex.routineNumber] ?? ex.name;
}
