import type { ReactNode } from "react";
import { rem } from "@/lib/scale";
import { ACCENTS, type AccentName } from "@/lib/theme";

/**
 * Glifos simples de cada sección (la forma del icono de referencia, en
 * trazo plano). Se pintan en el color de la sección sobre su cuadro claro.
 * Viven en código, no en PNG, para que tomen el color del acento y se vean
 * nítidos a cualquier tamaño. `tint` es el color del cuadro, para separar
 * las formas que se montan entre sí.
 */
const GLIFOS: Record<string, (tint: string) => ReactNode> = {
  // Ejercicios: una persona estirando un brazo.
  "/ejercicios": () => (
    <>
      <circle cx="13" cy="4.6" r="2.4" fill="currentColor" />
      <path
        d="M13 9.6 L12.2 14.2 M13 11 L8.4 7.2 M13 11 L17.4 13.6 M12.2 14.2 L8.2 19.6 M12.2 14.2 L16.6 18.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  // Nutrición: tenedor y cuchillo.
  "/nutricion": () => (
    <>
      <rect x="4.6" y="3" width="1.8" height="6.4" rx="0.9" fill="currentColor" />
      <rect x="7.6" y="3" width="1.8" height="6.4" rx="0.9" fill="currentColor" />
      <rect x="10.6" y="3" width="1.8" height="6.4" rx="0.9" fill="currentColor" />
      <rect x="4.6" y="8" width="7.8" height="2.2" rx="1.1" fill="currentColor" />
      <rect x="7.6" y="9.6" width="1.8" height="11.6" rx="0.9" fill="currentColor" />
      <path d="M16.4 3 C19.6 4.4 20.4 8.4 19 11.4 H16.4 Z" fill="currentColor" />
      <rect x="16.4" y="10.8" width="2.2" height="10.2" rx="1.1" fill="currentColor" />
    </>
  ),
  // Medicamentos: una cápsula inclinada, con una mitad más clara.
  "/medicamentos": () => (
    <g transform="rotate(-45 12 12)">
      <rect x="2.6" y="8.8" width="18.8" height="6.4" rx="3.2" fill="currentColor" />
      <rect x="11.4" y="8.8" width="5" height="6.4" fill="currentColor" opacity="0.55" />
    </g>
  ),
  // Comunidad: dos globos de conversación, el de atrás recortado por el de delante.
  "/comunidad": (tint) => (
    <>
      <path
        d="M3.5 5.5 h11 a2.6 2.6 0 0 1 2.6 2.6 v5.2 a2.6 2.6 0 0 1 -2.6 2.6 H8 l-3.4 2.8 v-2.8 h-1.1 a2.6 2.6 0 0 1 -2.6 -2.6 V8.1 a2.6 2.6 0 0 1 2.6 -2.6 Z"
        fill="currentColor"
      />
      <path
        d="M11.2 11.2 h7.6 a2.4 2.4 0 0 1 2.4 2.4 v3.8 a2.4 2.4 0 0 1 -2.4 2.4 h-0.3 v2.6 l-3.1 -2.6 h-4.2 a2.4 2.4 0 0 1 -2.4 -2.4 v-3.8 a2.4 2.4 0 0 1 2.4 -2.4 Z"
        fill="currentColor"
        style={{ stroke: tint }}
        strokeWidth="1.4"
      />
    </>
  ),
  // Mente activa: una nube de pensamiento con burbujas.
  "/cognitivo": () => (
    <>
      <circle cx="14" cy="9.6" r="5.6" fill="currentColor" />
      <circle cx="9.2" cy="9" r="4.4" fill="currentColor" />
      <circle cx="16.6" cy="6.6" r="3.2" fill="currentColor" />
      <circle cx="6.6" cy="18.4" r="1.9" fill="currentColor" />
      <circle cx="4.2" cy="21.4" r="1.2" fill="currentColor" />
    </>
  ),
};

interface IconoSeccionProps {
  href: string;
  accent: AccentName;
  /** Lado del cuadro, en px sobre la base de 22 (se pinta en rem). */
  size?: number;
}

/** Ficha de icono de una sección: glifo del acento sobre cuadro claro. */
export default function IconoSeccion({ href, accent, size = 52 }: IconoSeccionProps) {
  const tone = ACCENTS[accent];
  return (
    <span
      aria-hidden="true"
      className="tile"
      style={{
        width: rem(size),
        height: rem(size),
        backgroundColor: tone.tint,
        borderRadius: rem(Math.round(size * 0.3)),
        color: tone.solid,
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {GLIFOS[href]?.(tone.tint)}
      </svg>
    </span>
  );
}
