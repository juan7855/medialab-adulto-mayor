import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EmergenciaBoton from "./EmergenciaBoton";

interface AppBarProps {
  backHref: string;
  backLabel: string;
  /** Se oculta en la propia pantalla de emergencia. */
  showEmergencia?: boolean;
}

/**
 * Barra superior fija, como en el Figma: "‹ Hoy" (o "‹ Volver" en pantallas
 * internas) a la izquierda y el botón rojo de emergencia a la derecha. El
 * destino completo va en el aria-label; en pantalla, "Volver" es lo bastante
 * corto para que los dos botones quepan en una línea desde 344px. En un
 * teléfono más angosto la emergencia baja a una segunda línea en vez de
 * salirse de la pantalla.
 */
export default function AppBar({ backHref, backLabel, showEmergencia = true }: AppBarProps) {
  const visible = backLabel === "Hoy" ? "Hoy" : "Volver";
  return (
    <div
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <Link
        href={backHref}
        className="chip-btn"
        style={{ minHeight: "var(--touch)", paddingLeft: "0.5rem", paddingRight: "0.95rem" }}
        aria-label={`Volver a ${backLabel}`}
      >
        <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        <span>{visible}</span>
      </Link>

      {showEmergencia && (
        <span className="ml-auto">
          <EmergenciaBoton />
        </span>
      )}
    </div>
  );
}
