import type { LucideIcon } from "lucide-react";
import { ACCENTS, type AccentName } from "@/lib/theme";

interface IconTileProps {
  icon: LucideIcon;
  accent: AccentName;
  /** Lado del cuadro, en px. */
  size?: number;
  /** Tamaño del icono. Por defecto, algo más de la mitad del cuadro. */
  iconSize?: number;
  strokeWidth?: number;
  radius?: string;
}

/** Cuadro redondeado teñido con un icono de línea centrado. */
export default function IconTile({
  icon: Icon,
  accent,
  size = 56,
  iconSize,
  strokeWidth = 1.75,
  radius,
}: IconTileProps) {
  const a = ACCENTS[accent];

  return (
    <span
      className="tile"
      style={{
        width: size,
        height: size,
        backgroundColor: a.tint,
        borderColor: a.line,
        borderRadius: radius ?? (size >= 72 ? "1.15rem" : "0.85rem"),
      }}
      aria-hidden="true"
    >
      <Icon
        size={iconSize ?? Math.round(size * 0.52)}
        color={a.ink}
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
