import type { LucideIcon } from "lucide-react";
import { ACCENTS, type AccentName } from "@/lib/theme";

interface IconTileProps {
  icon: LucideIcon;
  accent: AccentName;
  /** Lado del cuadro, en px. */
  size?: number;
  iconSize?: number;
  strokeWidth?: number;
}

/**
 * Cuadro de icono al estilo de las fichas de sección: fondo de color vivo y
 * glifo crema. Se usa donde el icono sale de los datos (recetas, actividades)
 * y no hay una ficha diseñada.
 */
export default function IconTile({
  icon: Icon,
  accent,
  size = 56,
  iconSize,
  strokeWidth = 2,
}: IconTileProps) {
  const tone = ACCENTS[accent];

  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: tone.solid,
        borderRadius: Math.round(size * 0.22),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <Icon
        size={iconSize ?? Math.round(size * 0.52)}
        color={tone.glyph}
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
