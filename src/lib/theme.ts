/**
 * Acentos de la app, tomados de la paleta del proyecto.
 *
 * `solid` es el color vivo (fichas de icono, barras, puntos), `tint` el
 * lavado claro para fondos y `line` el borde. Ninguno se usa para texto:
 * el texto va siempre en --ink, para que se lea a los 65 y a los 85.
 */
export type AccentName =
  | "green"
  | "orange"
  | "cyan"
  | "blue"
  | "purple"
  | "red"
  | "yellow";

export interface Accent {
  solid: string;
  tint: string;
  line: string;
  /**
   * Color del glifo que va encima de `solid`. Casi siempre crema, como en las
   * fichas diseñadas; el amarillo es demasiado claro y necesita tinta oscura.
   */
  glyph: string;
}

const CREAM = "#FAF8F5";

export const ACCENTS: Record<AccentName, Accent> = {
  green: { solid: "var(--green-solid)", tint: "var(--green-tint)", line: "var(--green-line)", glyph: CREAM },
  orange: { solid: "var(--orange-solid)", tint: "var(--orange-tint)", line: "var(--orange-line)", glyph: CREAM },
  cyan: { solid: "var(--cyan-solid)", tint: "var(--cyan-tint)", line: "var(--cyan-line)", glyph: CREAM },
  blue: { solid: "var(--blue-solid)", tint: "var(--blue-tint)", line: "var(--blue-line)", glyph: CREAM },
  purple: { solid: "var(--purple-solid)", tint: "var(--purple-tint)", line: "var(--purple-line)", glyph: CREAM },
  red: { solid: "var(--red-solid)", tint: "var(--red-tint)", line: "var(--red-line)", glyph: CREAM },
  yellow: { solid: "var(--yellow-solid)", tint: "var(--yellow-tint)", line: "var(--yellow-line)", glyph: "var(--ink)" },
};

export interface Section {
  href: string;
  label: string;
  description: string;
  /** Ficha de icono servida desde /public/iconos. */
  icon: string;
  accent: AccentName;
}

/**
 * El acento de cada sección es el color de fondo de su propia ficha, para que
 * la pantalla entera se lea como una sola familia.
 */
export const SECTIONS: Section[] = [
  {
    href: "/ejercicios",
    label: "Ejercicios",
    description: "Muévete cada día",
    icon: "/iconos/ejercicios.png",
    accent: "green",
  },
  {
    href: "/nutricion",
    label: "Nutrición",
    description: "Comidas y agua",
    icon: "/iconos/nutricion.png",
    accent: "orange",
  },
  {
    href: "/medicamentos",
    label: "Medicamentos",
    description: "Tus pastillas de hoy",
    icon: "/iconos/medicamentos.png",
    accent: "cyan",
  },
  {
    href: "/cognitivo",
    label: "Mente activa",
    description: "Memoria y atención",
    icon: "/iconos/cognitivo.png",
    accent: "blue",
  },
];

export const RUTINA: Section = {
  href: "/rutina",
  label: "Rutina",
  description: "Tu día, paso a paso",
  icon: "/iconos/rutina.svg",
  accent: "purple",
};

export const COMUNIDAD: Section = {
  href: "/comunidad",
  label: "Comunidad",
  description: "Foro y mensajes con otros",
  icon: "/iconos/comunidad.svg",
  accent: "yellow",
};

export const EMERGENCIA: Section = {
  href: "/emergencia",
  label: "Emergencia",
  description: "Llamar a un familiar o al 123",
  icon: "/iconos/emergencia.svg",
  accent: "red",
};
