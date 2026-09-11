import type { LucideIcon } from "lucide-react";
import { ACCENTS, type AccentName } from "@/lib/theme";
import { rem } from "@/lib/scale";

interface IconTileProps {
  icon: LucideIcon;
  accent: AccentName;
  /** Lado del cuadro, en px sobre la base de 22. Se pinta en rem. */
  size?: number;
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
  strokeWidth = 2,
}: IconTileProps) {
  const tone = ACCENTS[accent];

  return (
    <span
      className="tile"
      style={{
        width: rem(size),
        height: rem(size),
        backgroundColor: tone.solid,
        borderRadius: rem(Math.round(size * 0.22)),
      }}
      aria-hidden="true"
    >
      <Icon color={tone.glyph} strokeWidth={strokeWidth} />
    </span>
  );
}
