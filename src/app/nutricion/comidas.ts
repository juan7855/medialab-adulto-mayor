import { Apple, CookingPot, Cookie, Croissant, Salad, type LucideIcon } from "lucide-react";
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
  /** Momento del día: lo escribe la plataforma del cuidador ("Desayuno",
   *  "Media mañana", "Almuerzo", "Merienda", "Cena"). */
  slot?: string | null;
}

/**
 * Momento del día de una comida, deducido de lo que haya: el `slot` que
 * escribe la plataforma del cuidador, el slug del menú sembrado o el nombre.
 *
 * Hace falta porque las dos fuentes de datos no se parecen: el cuidador
 * manda `slot: "Media mañana"` con nombres de plato ("Yogur natural"),
 * mientras el menú sembrado manda `slug: "desayuno"`.
 */
const MOMENTOS: Array<{
  patron: RegExp;
  accent: AccentName;
  icono: LucideIcon;
  /** Cómo se nombra en una pregunta: "¿Ya comió el desayuno?" */
  frase: string;
}> = [
  { patron: /desayuno/i, accent: "yellow", icono: Croissant, frase: "el desayuno" },
  { patron: /media\s*ma[ñn]ana/i, accent: "cyan", icono: Apple, frase: "lo de media mañana" },
  { patron: /almuerzo|comida|mediod[íi]a/i, accent: "orange", icono: CookingPot, frase: "el almuerzo" },
  { patron: /merienda|media\s*tarde/i, accent: "purple", icono: Cookie, frase: "la merienda" },
  { patron: /cena/i, accent: "blue", icono: Salad, frase: "la cena" },
];

function momentoDe(meal: Meal) {
  const texto = `${meal.slot ?? ""} ${meal.slug} ${meal.name}`;
  return MOMENTOS.find((m) => m.patron.test(texto));
}

/**
 * Color de una comida que todavía está por marcar.
 *
 * El verde está reservado para "ya comió" (es el color del visto bueno en
 * toda la app), así que una comida pendiente nunca puede ser verde: pintada
 * de verde se lee como ya marcada, y entonces la persona no la marca.
 * Pasaba en todos los perfiles: la plataforma del cuidador manda colores de
 * Tailwind ("emerald" → verde) y el menú sembrado traía la cena en verde.
 *
 * Se prefiere el color del momento del día, que además distingue una comida
 * de otra; si no se reconoce el momento, se respeta el color guardado
 * siempre que no sea verde.
 */
export function acentoPendiente(meal: Meal): AccentName {
  const momento = momentoDe(meal);
  if (momento) return momento.accent;
  return meal.accent === "green" ? "orange" : meal.accent;
}

/**
 * Icono de la comida: el del emoji si lo trae del menú sembrado, y si no el
 * del momento del día — la plataforma del cuidador manda "🍽️" en todas, y
 * cinco tarjetas con el mismo icono no se distinguen entre sí.
 */
export function iconoDe(meal: Meal): LucideIcon {
  return MEAL_ICONS[meal.emoji] ?? momentoDe(meal)?.icono ?? MEAL_ICON_FALLBACK;
}

/**
 * Cómo se nombra la comida dentro de una pregunta: "¿Ya comió el desayuno?".
 *
 * El menú sembrado guarda eso en `article` ("el desayuno"), pero la
 * plataforma del cuidador mete ahí la descripción completa del plato, y la
 * pregunta salía siendo un párrafo ("¿Ya comió Copos de avena, leche
 * desnatada, medio plátano y 3 nueces?"). Cuando `article` no sirve como
 * frase corta se usa el momento del día y, si tampoco se reconoce, el
 * nombre del plato.
 */
export function nombreEnPregunta(meal: Meal): string {
  const article = meal.article.trim();
  const esFraseCorta =
    article.length > 0 && article.length <= 28 && article !== meal.items[0]?.trim();
  if (esFraseCorta) return article;
  return momentoDe(meal)?.frase ?? meal.name;
}
