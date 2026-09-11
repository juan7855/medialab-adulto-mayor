import type { LucideIcon } from "lucide-react";
import AppBar from "./AppBar";
import IconTile from "./IconTile";
import SectionIcon from "./SectionIcon";
import type { AccentName } from "@/lib/theme";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Ficha diseñada de la sección (tiene prioridad sobre `icon`). */
  iconSrc?: string;
  /** Icono de Lucide, para pantallas de detalle sin ficha propia. */
  icon?: LucideIcon;
  accent: AccentName;
  backHref?: string;
  backLabel?: string;
}

/** Barra de navegación + título de sección con su ficha de icono. */
export default function PageHeader({
  title,
  subtitle,
  iconSrc,
  icon,
  accent,
  backHref = "/",
  backLabel = "Inicio",
}: PageHeaderProps) {
  return (
    <header role="banner">
      <AppBar backHref={backHref} backLabel={backLabel} showHome={backHref !== "/"} />

      <div className="flex items-center gap-3.5 px-4 pt-5 pb-1">
        {iconSrc ? (
          <SectionIcon src={iconSrc} size={62} />
        ) : icon ? (
          <IconTile icon={icon} accent={accent} size={62} strokeWidth={1.9} />
        ) : null}

        <div className="min-w-0">
          <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 800 }}>{title}</h1>
          {subtitle && (
            <p
              className="mt-1"
              style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)", fontWeight: 600 }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
