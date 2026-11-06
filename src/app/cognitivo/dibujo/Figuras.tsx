/** Las 4 figuras geométricas del juego "Dibuja de memoria". */

interface FiguraProps {
  estilo?: "original" | "trazo";
}

const COLOR_ORIGINAL = "var(--ink)";
const COLOR_TRAZO = "var(--green-solid)";
const STROKE_W = 4;
const DASH = "10 6";

function estilos(e: "original" | "trazo") {
  return {
    stroke: e === "original" ? COLOR_ORIGINAL : COLOR_TRAZO,
    strokeWidth: STROKE_W,
    fill: "none",
    strokeDasharray: e === "trazo" ? DASH : undefined,
  };
}

export function Figura1({ estilo = "original" }: FiguraProps) {
  const s = estilos(estilo);
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <rect x="20" y="20" width="160" height="160" {...s} />
      <polygon points="100,35 175,170 25,170" {...s} />
    </svg>
  );
}

export function Figura2({ estilo = "original" }: FiguraProps) {
  const s = estilos(estilo);
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <circle cx="100" cy="100" r="85" {...s} />
      <line x1="100" y1="25" x2="100" y2="175" {...s} />
      <line x1="25" y1="100" x2="175" y2="100" {...s} />
    </svg>
  );
}

export function Figura3({ estilo = "original" }: FiguraProps) {
  const s = estilos(estilo);
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      {/* paredes */}
      <rect x="30" y="90" width="140" height="100" {...s} />
      {/* techo */}
      <polygon points="100,20 20,90 180,90" {...s} />
      {/* puerta */}
      <rect x="80" y="135" width="40" height="55" {...s} />
    </svg>
  );
}

export function Figura4({ estilo = "original" }: FiguraProps) {
  const s = estilos(estilo);
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <rect x="20" y="20" width="160" height="160" {...s} />
      <polygon points="100,30 185,175 15,175" {...s} />
      <circle cx="100" cy="120" r="45" {...s} />
    </svg>
  );
}

export const COMPONENTES_FIGURA = [Figura1, Figura2, Figura3, Figura4] as const;
