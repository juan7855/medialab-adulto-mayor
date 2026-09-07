import Link from "next/link";
import { ChevronLeft, House } from "lucide-react";

interface AppBarProps {
  backHref: string;
  backLabel: string;
  /** Oculta el botón de inicio cuando ya estamos volviendo a él. */
  showHome?: boolean;
}

/** Barra superior fija: "Atrás" a la izquierda, "Inicio" a la derecha. */
export default function AppBar({ backHref, backLabel, showHome = true }: AppBarProps) {
  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <Link
        href={backHref}
        className="chip-btn"
        style={{ paddingLeft: "0.6rem", paddingRight: "1rem" }}
        aria-label={`Volver a ${backLabel}`}
      >
        <ChevronLeft size={22} strokeWidth={2.4} aria-hidden="true" />
        <span>{backLabel}</span>
      </Link>

      {showHome && (
        <Link
          href="/"
          className="chip-btn"
          style={{ flexDirection: "column", gap: "0.1rem", padding: "0.4rem 0.9rem" }}
          aria-label="Ir al inicio"
        >
          <House size={20} strokeWidth={2} aria-hidden="true" />
          <span style={{ fontSize: "0.68rem" }}>Inicio</span>
        </Link>
      )}
    </div>
  );
}
