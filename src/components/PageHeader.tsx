import type { LucideIcon } from "lucide-react";
import AppBar from "./AppBar";
import IconTile from "./IconTile";
import type { AccentName } from "@/lib/theme";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  accent: AccentName;
  backHref?: string;
  backLabel?: string;
}

/** Barra de navegación + título de sección con su cuadro de icono. */
export default function PageHeader({
  title,
  subtitle,
  icon,
  accent,
  backHref = "/",
  backLabel = "Inicio",
}: PageHeaderProps) {
  return (
    <header role="banner">
      <AppBar backHref={backHref} backLabel={backLabel} showHome={backHref !== "/"} />

      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <IconTile icon={icon} accent={accent} size={58} strokeWidth={1.7} />
        <div className="min-w-0">
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800 }}>{title}</h1>
          {subtitle && (
            <p
              className="mt-0.5"
              style={{ fontSize: "0.85rem", color: "var(--ink-mute)", fontWeight: 500 }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
