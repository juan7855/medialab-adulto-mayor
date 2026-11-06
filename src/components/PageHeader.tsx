import type { LucideIcon } from "lucide-react";
import AppBar from "./AppBar";
import type { AccentName } from "@/lib/theme";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /**
   * Ya no se pintan: en el Figma el título va solo, sin ficha de icono. Se
   * conservan para no tocar cada pantalla y por si se quiere volver atrás.
   */
  iconSrc?: string;
  icon?: LucideIcon;
  accent?: AccentName;
  backHref?: string;
  backLabel?: string;
  /** Falso en la propia pantalla de emergencia. */
  showEmergencia?: boolean;
}

/** Barra de navegación + título grande de la pantalla, como en el Figma. */
export default function PageHeader({
  title,
  subtitle,
  backHref = "/inicio",
  backLabel = "Hoy",
  showEmergencia = true,
}: PageHeaderProps) {
  return (
    <header role="banner">
      <AppBar backHref={backHref} backLabel={backLabel} showEmergencia={showEmergencia} />

      <div className="px-4 pt-3 pb-1">
        <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 700 }}>{title}</h1>
        {subtitle && (
          <p
            className="mt-2"
            style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)", fontWeight: 400 }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
