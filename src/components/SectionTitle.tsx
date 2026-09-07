import type { LucideIcon } from "lucide-react";
import { ACCENTS, type AccentName } from "@/lib/theme";

interface SectionTitleProps {
  icon: LucideIcon;
  accent: AccentName;
  children: React.ReactNode;
}

/** Encabezado de bloque: icono de línea coloreado + texto. */
export default function SectionTitle({ icon: Icon, accent, children }: SectionTitleProps) {
  return (
    <h2 className="flex items-center gap-2 px-1" style={{ fontSize: "1.1rem", fontWeight: 800 }}>
      <Icon size={22} strokeWidth={2} color={ACCENTS[accent].ink} aria-hidden="true" />
      {children}
    </h2>
  );
}
