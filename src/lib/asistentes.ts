/**
 * Los dos asistentes entre los que elige la persona. El elegido acompaña
 * luego en el inicio.
 */
export interface Asistente {
  id: string;
  nombre: string;
  /** Cómo se presenta en la pantalla de elección. */
  presentacion: string;
  /** Ilustración oficial, recortada de Imagenes/personajes.jpeg. */
  imagen: string;
  /** Color de la tarjeta cuando está elegido. */
  tinte: string;
  borde: string;
  /** Qué tipo de voz del navegador se prefiere al hablar como este asistente. */
  voz: "masculina" | "femenina";
}

export const ASISTENTES: Asistente[] = [
  {
    id: "carlos",
    nombre: "Carlos",
    presentacion: "Tranquilo y directo",
    imagen: "/personajes/carlos.png",
    tinte: "var(--green-tint)",
    borde: "var(--green-line)",
    voz: "masculina",
  },
  {
    id: "lucia",
    nombre: "Lucía",
    presentacion: "Atenta y conversadora",
    imagen: "/personajes/lucia.png",
    tinte: "var(--purple-tint)",
    borde: "var(--purple-line)",
    voz: "femenina",
  },
];

export function asistentePorId(id: string | null): Asistente | null {
  if (!id) return null;
  return ASISTENTES.find((a) => a.id === id) ?? null;
}
