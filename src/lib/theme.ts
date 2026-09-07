/**
 * Acentos de la app. Cada sección tiene un tinte de fondo, una tinta para el
 * icono/texto y un borde. Los valores viven en globals.css para que el tema
 * se pueda ajustar en un solo sitio.
 */
export type AccentName =
  | "green"
  | "orange"
  | "blue"
  | "purple"
  | "red"
  | "amber";

export interface Accent {
  tint: string;
  ink: string;
  line: string;
}

export const ACCENTS: Record<AccentName, Accent> = {
  green: { tint: "var(--green-tint)", ink: "var(--green-ink)", line: "var(--green-line)" },
  orange: { tint: "var(--orange-tint)", ink: "var(--orange-ink)", line: "var(--orange-line)" },
  blue: { tint: "var(--blue-tint)", ink: "var(--blue-ink)", line: "var(--blue-line)" },
  purple: { tint: "var(--purple-tint)", ink: "var(--purple-ink)", line: "var(--purple-line)" },
  red: { tint: "var(--red-tint)", ink: "var(--red-ink)", line: "var(--red-line)" },
  amber: { tint: "var(--amber-tint)", ink: "var(--amber-ink)", line: "var(--amber-line)" },
};

export function accent(name: AccentName): Accent {
  return ACCENTS[name];
}

/** Acento de cada sección principal, usado en el inicio y en las cabeceras. */
export const SECTION_ACCENT = {
  ejercicios: "green",
  nutricion: "orange",
  medicamentos: "blue",
  rutina: "purple",
  emergencia: "red",
} as const satisfies Record<string, AccentName>;
