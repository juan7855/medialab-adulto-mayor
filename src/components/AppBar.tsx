import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

interface AppBarProps {
  backHref: string;
  backLabel: string;
}

export default function AppBar({ backHref, backLabel }: AppBarProps) {
  const yaEsInicio = backHref === "/inicio";

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
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

      {!yaEsInicio && (
        <Link
          href="/inicio"
          className="chip-btn"
          style={{ minHeight: "var(--touch)", paddingLeft: "0.75rem", paddingRight: "0.75rem" }}
          aria-label="Ir al inicio"
        >
          <Home size={20} strokeWidth={2.4} aria-hidden="true" />
          <span>Inicio</span>
        </Link>
      )}
    </div>
  );
}
