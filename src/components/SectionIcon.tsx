interface SectionIconProps {
  /** Ruta de la ficha en /public/iconos. */
  src: string;
  /** Lado del cuadro, en px. */
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
      width={size}
      height={size}
      aria-hidden={alt === "" ? true : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}
