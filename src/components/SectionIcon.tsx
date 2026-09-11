import { rem } from "@/lib/scale";

interface SectionIconProps {
  /** Ruta de la ficha en /public/iconos. */
  src: string;
  /** Lado del cuadro, en px sobre la base de 22. Se pinta en rem. */
  size?: number;
  /** Texto alternativo. Vacío = decorativo (el nombre ya va al lado). */
  alt?: string;
}

/**
 * Ficha de icono de una sección. Son PNG/SVG diseñados para el proyecto: ya
 * traen su propio fondo de color y glifo, así que se pintan tal cual.
 */
export default function SectionIcon({ src, size = 76, alt = "" }: SectionIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- assets locales de 3 KB; optimizarlos no aporta
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      style={{
        width: rem(size),
        height: rem(size),
        borderRadius: rem(Math.round(size * 0.22)),
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
