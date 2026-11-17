"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FilaLista from "@/components/FilaLista";
import { formatDuration, type Exercise } from "./data";

const ESQUINAS = ["abajo-der", "abajo-izq", "arriba-der", "arriba-izq"] as const;
const COLORES = ["orange", "cyan", "green", "purple"] as const;

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/**
 * Ejercicios: el de hoy destacado arriba, y el resto de la semana en filas
 * cortas abajo. Antes había pestañas de intensidad (Descanso/Suave/
 * Moderada) que mezclaban el contenido viejo con las Rutinas; se quitaron
 * — el día ya dice de por sí si toca caminar, descansar o hacer la rutina.
 */
export default function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  // El día se calcula en el navegador, no al renderizar en el servidor: el
  // servidor puede estar en otro huso horario y adivinar mal cerca de la
  // medianoche. Arranca en null (mismo resultado en servidor y cliente,
  // nada de "hydration mismatch") y se corrige apenas monta.
  const [hoyDiaSemana, setHoyDiaSemana] = useState<number | null>(null);
  useEffect(() => {
    setHoyDiaSemana(new Date().getDay());
  }, []);
  // Antes de montar (o si por algún hueco de datos nada coincide), se cae al
  // primero que haya en vez de dejar la tarjeta vacía.
  const deHoy = exercises.find((ex) => ex.dayOfWeek === hoyDiaSemana) ?? exercises[0];

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

  // El resto de la semana, ordenado desde mañana hacia adelante (y cerrando
  // con los días previos a hoy): así se lee como "qué sigue".
  const base = hoyDiaSemana ?? 0;
  const resto = exercises
    .filter((ex) => ex.id !== deHoy?.id)
    .slice()
    .sort((a, b) => ((a.dayOfWeek - base + 7) % 7) - ((b.dayOfWeek - base + 7) % 7));

  return (
    <>
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
            {deHoy.routineId && " · 6 ejercicios con video"}
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
        <>
          <h2
            className="mt-5 mb-2 px-1"
            style={{ fontSize: "var(--t-sm)", fontWeight: 800, color: "var(--ink-soft)" }}
          >
            Esta semana
          </h2>
          <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label="Resto de la semana">
            {resto.map((ex, i) => (
              <li key={ex.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
                <FilaLista
                  href={`/ejercicios/${ex.id}`}
                  titulo={ex.name}
                  subtitulo={`${DIAS[ex.dayOfWeek]} · ${formatDuration(ex.durationSeconds)}`}
                  accent={COLORES[i % COLORES.length]}
                  esquina={ESQUINAS[i % ESQUINAS.length]}
                  ariaLabel={`${ex.name} el ${DIAS[ex.dayOfWeek]}. Duración ${formatDuration(ex.durationSeconds)}`}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
