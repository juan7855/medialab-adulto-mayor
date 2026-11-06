import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Gota, { type Esquina } from "./Gota";
import type { AccentName } from "@/lib/theme";

interface FilaListaProps {
  href: string;
  titulo: string;
  subtitulo?: string;
  accent: AccentName;
  esquina?: Esquina;
  ariaLabel?: string;
}

/**
 * Fila del Figma: tarjeta blanca con borde arena, gota de color, título,
 * subtítulo opcional y flecha. Es el patrón de Nutrición, Ejercicios, Mente
 * activa y "Todo lo de hoy".
 */
export default function FilaLista({
  href,
  titulo,
  subtitulo,
  accent,
  esquina,
  ariaLabel,
}: FilaListaProps) {
  return (
    <Link
      href={href}
      className="card pressable flex items-center gap-3.5 px-3.5 py-4"
      style={{ textDecoration: "none", color: "inherit", borderRadius: "var(--r-xl)" }}
      aria-label={ariaLabel ?? (subtitulo ? `${titulo}. ${subtitulo}` : titulo)}
    >
      <Gota accent={accent} size={44} esquina={esquina} />
      <span className="flex-1 min-w-0">
        <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 600, lineHeight: 1.2 }}>
          {titulo}
        </span>
        {subtitulo && (
          <span
            className="block mt-1"
            style={{ fontSize: "var(--t-sm)", fontWeight: 400, color: "var(--ink-mute)" }}
          >
            {subtitulo}
          </span>
        )}
      </span>
      <ChevronRight size={26} strokeWidth={2.2} color="var(--ink-mute)" aria-hidden="true" />
    </Link>
  );
}
