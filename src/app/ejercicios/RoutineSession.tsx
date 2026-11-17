import type { AccentName } from "@/lib/theme";
import { ACCENTS } from "@/lib/theme";

export interface ParadaRutina {
  etiqueta: "Calentamiento" | "Cierre" | null;
  posicion: number | null; // 1 a 6, null en calentamiento/cierre
  name: string;
  variant: string | null;
  objective: string;
  steps: string[];
  videoUrl: string | null;
}

/**
 * Cada ejercicio de la rutina como su propio bloque: etiqueta arriba,
 * nombre y variante en su propia línea, video a todo el ancho si existe, y
 * los pasos numerados abajo. Todo apilado en vertical (nada comparte fila
 * con algo de ancho fijo) para no repetir el corte de palabras a la mitad
 * que ya pasó en Medicamentos y en los grupos de alimentos.
 */
export default function RoutineSession({ paradas, accent }: { paradas: ParadaRutina[]; accent: AccentName }) {
  const tone = ACCENTS[accent];

  return (
    <ol className="flex flex-col gap-3 list-none p-0 m-0">
      {paradas.map((parada, i) => (
        <li key={i} className="card p-3.5">
          <span
            className="inline-block"
            style={{
              fontSize: "var(--t-xs)",
              fontWeight: 800,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: "var(--ink)",
              backgroundColor: tone.tint,
              border: `1px solid ${tone.line}`,
              borderRadius: "var(--r-pill)",
              padding: "0.2rem 0.65rem",
            }}
          >
            {parada.etiqueta ?? `Ejercicio ${parada.posicion} de 6`}
          </span>

          <h3 className="mt-2" style={{ fontSize: "var(--t-md)", fontWeight: 800, lineHeight: 1.3 }}>
            {parada.name}
          </h3>
          {parada.variant && (
            <p className="mt-0.5" style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}>
              {parada.variant}
            </p>
          )}

          {parada.videoUrl && (
            <video
              className="mt-3 w-full block"
              style={{ borderRadius: "var(--r-lg)", backgroundColor: "var(--ink)" }}
              src={parada.videoUrl}
              controls
              playsInline
              preload="metadata"
            />
          )}

          <p className="mt-3" style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
            {parada.objective}
          </p>

          <ol className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {parada.steps.map((step, j) => (
              <li key={j} className="flex items-start gap-2.5">
                <span
                  style={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: "999px",
                    backgroundColor: tone.tint,
                    border: `1px solid ${tone.line}`,
                    color: "var(--ink)",
                    fontSize: "var(--t-xs)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {j + 1}
                </span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}>{step}</span>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
