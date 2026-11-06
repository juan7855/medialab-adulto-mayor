"use client";

import { useState } from "react";
import Link from "next/link";
import FilaLista from "@/components/FilaLista";
import { nivelesDe, type CognitiveActivity, type Level } from "./data";

/**
 * Mente activa, como en el Figma (A23): el juego de hoy destacado en un
 * bloque durazno con el botón "Jugar", y el resto en filas con gota verde.
 * Si el cuidador definió más de un nivel, se puede cambiar de nivel arriba.
 */
export default function CognitiveList({ activities }: { activities: CognitiveActivity[] }) {
  const niveles = nivelesDe(activities);
  const [elegido, setLevel] = useState<Level | null>(null);
  const level = elegido && niveles.includes(elegido) ? elegido : (niveles[0] ?? "");

  if (activities.length === 0) {
    return (
      <div className="card p-6 text-center" style={{ borderRadius: "var(--r-xl)" }}>
        <p style={{ fontSize: "var(--t-base)", fontWeight: 600 }}>Todavía no hay juegos.</p>
        <p className="mt-1.5" style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
          Su familiar se los puede agregar desde su plataforma.
        </p>
      </div>
    );
  }

  const visible = activities.filter((a) => a.level === level);
  const [deHoy, ...resto] = visible;

  return (
    <>
      {niveles.length > 1 && (
        <div className="flex flex-wrap gap-2.5 mb-4" role="tablist" aria-label="Elegir dificultad">
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
          style={{ backgroundColor: "var(--orange-tint)", borderRadius: "var(--r-xl)" }}
          aria-label="El juego de hoy"
        >
          <p
            style={{
              fontSize: "var(--t-xs)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            El juego de hoy
          </p>
          <h2 className="mt-1.5" style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
            {deHoy.name}
          </h2>
          <p className="mt-1.5" style={{ fontSize: "var(--t-sm)", color: "var(--ink-soft)" }}>
            {deHoy.description}
            {deHoy.durationLabel ? ` · ${deHoy.durationLabel}` : ""}
          </p>
          <Link
            href={`/cognitivo/${deHoy.id}`}
            className="btn-cta pressable w-full mt-4"
            style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          >
            Jugar
          </Link>
        </section>
      )}

      {resto.length > 0 && (
        <ul className="flex flex-col gap-3 mt-4 list-none p-0 m-0" aria-label="Más juegos">
          {resto.map((activity, i) => (
            <li key={activity.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <FilaLista
                href={`/cognitivo/${activity.id}`}
                titulo={activity.name}
                subtitulo={activity.description}
                accent="green"
                esquina="abajo-der"
                ariaLabel={`${activity.name}. ${activity.description}. Duración ${activity.durationLabel}`}
              />
            </li>
          ))}
        </ul>
      )}

      <p
        className="text-center mt-6"
        style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}
      >
        Sin reloj ni puntaje. Juegue con calma.
      </p>
    </>
  );
}
