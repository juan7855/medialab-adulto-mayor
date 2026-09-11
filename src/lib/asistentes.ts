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
}

export const ASISTENTES: Asistente[] = [
  {
    id: "carlos",
    nombre: "Carlos",
    presentacion: "Tranquilo y directo",
    imagen: "/personajes/carlos.png",
    tinte: "var(--green-tint)",
    borde: "var(--green-line)",
  },
  {
    id: "lucia",
    nombre: "Lucía",
    presentacion: "Atenta y conversadora",
    imagen: "/personajes/lucia.png",
    tinte: "var(--purple-tint)",
    borde: "var(--purple-line)",
  },
];

export function asistentePorId(id: string | null): Asistente | null {
  if (!id) return null;
  return ASISTENTES.find((a) => a.id === id) ?? null;
}
