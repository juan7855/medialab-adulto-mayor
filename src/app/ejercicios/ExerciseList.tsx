"use client";

import { useState } from "react";
import Link from "next/link";
import FilaLista from "@/components/FilaLista";
import { nivelesDe, formatDuration, type Exercise, type Level } from "./data";

const ESQUINAS = ["abajo-der", "abajo-izq", "arriba-der", "arriba-izq"] as const;
const COLORES = ["orange", "cyan", "green", "purple"] as const;

/**
 * Ejercicios, como en el Figma (A06): el ejercicio de hoy destacado en un
 * bloque verde claro con "Empezar", y el resto en filas cortas. Si el
 * cuidador definió más de una intensidad, se elige arriba.
 */
export default function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  const niveles = nivelesDe(exercises);
  const [elegido, setLevel] = useState<Level | null>(null);
  const level = elegido && niveles.includes(elegido) ? elegido : (niveles[0] ?? "");

  if (exercises.length === 0) {
    return (
      <div className="card p-6 text-center" style={{ borderRadius: "var(--r-xl)" }}>
        <p style={{ fontSize: "var(--t-base)", fontWeight: 600 }}>Todavía no hay ejercicios.</p>
        <p className="mt-1.5" style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
          Su familiar se los puede agregar desde su plataforma.
        </p>
      </div>
    );
  }

  const visible = exercises.filter((ex) => ex.level === level);
  const [deHoy, ...resto] = visible;

  return (
    <>
      {niveles.length > 1 && (
        <div className="flex flex-wrap gap-2.5 mb-4" role="tablist" aria-label="Elegir intensidad">
          {niveles.map((option) => {
            const active = option === level;
            return (
              <button
                key={option}
                role="tab"
                aria-selected={active}
                onClick={() => setLevel(option)}
                className="flex-1 pressable"
                style={{
                  minHeight: "var(--touch)",
                  borderRadius: "var(--r-pill)",
                  fontSize: "var(--t-sm)",
                  fontWeight: 600,
                  backgroundColor: active ? "var(--cta-dark)" : "var(--surface)",
                  color: active ? "#fff" : "var(--ink)",
                  border: `var(--border-w) solid ${active ? "var(--cta-dark)" : "var(--line)"}`,
                  textTransform: "capitalize",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {deHoy && (
        <section
          className="p-5"
          style={{ backgroundColor: "var(--green-tint)", borderRadius: "var(--r-xl)" }}
          aria-label="El ejercicio de hoy"
        >
          <p
            style={{
              fontSize: "var(--t-xs)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--green-deep)",
            }}
          >
            El ejercicio de hoy
          </p>
          <h2 className="mt-1.5" style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
            {deHoy.name}
          </h2>
          <p className="mt-1.5" style={{ fontSize: "var(--t-sm)", color: "var(--ink-soft)" }}>
            {formatDuration(deHoy.durationSeconds)}
          </p>
          <Link
            href={`/ejercicios/${deHoy.id}`}
            className="btn-dark pressable w-full mt-4"
            style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          >
            Empezar
          </Link>
        </section>
      )}

      {resto.length > 0 && (
        <ul className="flex flex-col gap-3 mt-4 list-none p-0 m-0" aria-label="Más ejercicios">
          {resto.map((ex, i) => (
            <li key={ex.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <FilaLista
                href={`/ejercicios/${ex.id}`}
                titulo={ex.name}
                subtitulo={formatDuration(ex.durationSeconds)}
                accent={COLORES[i % COLORES.length]}
                esquina={ESQUINAS[i % ESQUINAS.length]}
                ariaLabel={`${ex.name}. ${ex.description}. Duración ${formatDuration(ex.durationSeconds)}`}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
