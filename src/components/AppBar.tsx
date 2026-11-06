import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface AppBarProps {
  backHref: string;
  backLabel: string;
}

/**
 * Barra superior fija con el botón de volver, que dice a dónde lleva
 * ("‹ Hoy", "‹ Nutrición"). La emergencia ya no va aquí: es un
 * botón flotante abajo a la derecha, en todas las pantallas
 * (EmergenciaFlotante, en el layout).
 */
export default function AppBar({ backHref, backLabel }: AppBarProps) {
  return (
    <div
      className="sticky top-0 z-40 flex items-center px-4 py-3"
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
        <span>{backLabel}</span>
      </Link>

    </div>
  );
}
