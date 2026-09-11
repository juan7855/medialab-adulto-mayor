import Link from "next/link";
import { ChevronLeft, House } from "lucide-react";

interface AppBarProps {
  backHref: string;
  backLabel: string;
  /** Se oculta cuando el botón de atrás ya lleva al inicio. */
  showHome?: boolean;
}

/** Barra superior fija: "Atrás" a la izquierda, "Inicio" a la derecha. */
export default function AppBar({ backHref, backLabel, showHome = true }: AppBarProps) {
  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 90%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <Link
        href={backHref}
        className="chip-btn"
        style={{ paddingLeft: "0.55rem", paddingRight: "1rem" }}
        aria-label={`Volver a ${backLabel}`}
      >
        <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
        <span>{backLabel}</span>
      </Link>

      {showHome && (
        <Link
          href="/inicio"
          className="chip-btn"
          style={{ flexDirection: "column", gap: "0.05rem", padding: "0.4rem 0.9rem" }}
          aria-label="Ir al inicio"
        >
          <House size={21} strokeWidth={2.1} aria-hidden="true" />
          <span style={{ fontSize: "0.62rem" }}>Inicio</span>
        </Link>
      )}
    </div>
  );
}
