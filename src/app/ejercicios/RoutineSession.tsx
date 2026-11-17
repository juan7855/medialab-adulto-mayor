"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
 * Lista plegable de los ejercicios de la rutina. Cada parada se ve apenas
 * como una fila corta (etiqueta + nombre + flecha), y al tocar despliega
 * video, objetivo y pasos. La idea es que al llegar la persona vea de un
 * vistazo los 8 pasos de su sesión sin bajar media pantalla, y entre al
 * detalle del que esté por hacer.
 *
 * El video se muestra centrado con un tope de alto (`VIDEO_MAX_HEIGHT`),
 * no a todo lo ancho: los clips originales son verticales 9:16 y a pantalla
 * completa se comían toda la vista.
 */
const VIDEO_MAX_HEIGHT = 260; // en px

export default function RoutineSession({
  paradas,
  accent,
}: {
  paradas: ParadaRutina[];
  accent: AccentName;
}) {
  const tone = ACCENTS[accent];
  const [abierto, setAbierto] = useState<number | null>(null);

  const alTocar = (i: number) => setAbierto((prev) => (prev === i ? null : i));

  return (
    <ol className="flex flex-col gap-2.5 list-none p-0 m-0">
      {paradas.map((parada, i) => {
        const estaAbierto = abierto === i;
        const idContenido = `rutina-parada-${i}`;
        return (
          <li key={i} className="card" style={{ overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => alTocar(i)}
              aria-expanded={estaAbierto}
              aria-controls={idContenido}
              className="pressable w-full flex items-center gap-3 p-3.5 text-left"
              style={{ background: "transparent", border: 0, cursor: "pointer" }}
            >
              <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span
                  className="pill self-start"
                  style={{
                    fontWeight: 800,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    backgroundColor: tone.tint,
                    borderColor: tone.line,
                  }}
                >
                  {parada.etiqueta ?? `Ejercicio ${parada.posicion} de 6`}
                </span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 700, lineHeight: 1.3 }}>
                  {parada.name}
                </span>
              </span>
              <ChevronDown
                size={22}
                strokeWidth={2.2}
                color="var(--ink-mute)"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  transition: "transform 180ms ease",
                  transform: estaAbierto ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {estaAbierto && (
              <div
                id={idContenido}
                className="px-3.5 pb-3.5 pt-0 animate-rise"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                {parada.variant && (
                  <p
                    className="mt-3"
                    style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}
                  >
                    {parada.variant}
                  </p>
                )}

                {parada.videoUrl && (
                  // Mismo marco que las fotos de Comunidad (FotoDePost):
                  // borde y radio --r-md, con el video centrado y con un
                  // tope de alto para que no ocupe media pantalla.
                  <div
                    className="mt-3 flex items-center justify-center"
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "var(--r-md)",
                      overflow: "hidden",
                      backgroundColor: "var(--ink)",
                    }}
                  >
                    <video
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: VIDEO_MAX_HEIGHT,
                        height: "auto",
                        width: "auto",
                      }}
                      src={parada.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                )}

                <p
                  className="mt-3"
                  style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}
                >
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
                      <span
                        style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
