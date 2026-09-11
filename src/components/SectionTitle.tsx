import type { LucideIcon } from "lucide-react";
import IconTile from "./IconTile";
import type { AccentName } from "@/lib/theme";

interface SectionTitleProps {
  icon: LucideIcon;
  accent: AccentName;
  children: React.ReactNode;
}

/** Encabezado de bloque: ficha pequeña de icono + texto. */
export default function SectionTitle({ icon, accent, children }: SectionTitleProps) {
  return (
    <h2
      className="flex items-center gap-2.5 px-1"
      style={{ fontSize: "var(--t-md)", fontWeight: 800 }}
    >
      <IconTile icon={icon} accent={accent} size={34} strokeWidth={2.2} />
      {children}
    </h2>
  );
}
