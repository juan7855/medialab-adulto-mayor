"use client";

import { useEffect, useState } from "react";
import FilaLista from "./FilaLista";
import { useToday } from "@/lib/today";

/**
 * "Todo lo de hoy": cuántas actividades de la rutina de hoy lleva hechas la
 * persona. Lleva a la rutina completa.
 */
export default function ResumenHoy() {
  const date = useToday();
  const [conteo, setConteo] = useState<{ hechas: number; total: number } | null>(null);

  useEffect(() => {
    if (!date) return;
    let activo = true;
    (async () => {
      try {
        const [a, l] = await Promise.all([
          fetch("/api/rutina"),
          fetch(`/api/rutina/logs?date=${date}`),
        ]);
        if (!a.ok || !l.ok) return;
        const actividades = (await a.json()) as { id: number }[];
        const logs = (await l.json()) as { activityId: number; completed: boolean }[];
        const ids = new Set(actividades.map((x) => x.id));
        const hechas = logs.filter((x) => x.completed && ids.has(x.activityId)).length;
        if (activo) setConteo({ hechas, total: actividades.length });
      } catch {
        // sin conteo: la fila se muestra igual, sin cifras
      }
    })();
    return () => {
      activo = false;
    };
  }, [date]);

  const texto = !conteo
    ? "Su rutina de hoy"
    : conteo.total === 0
      ? "Todavía no hay tareas para hoy"
      : `Hizo ${conteo.hechas} de ${conteo.total} cosas`;

  return (
    <FilaLista
      href="/rutina"
      titulo="Todo lo de hoy"
      subtitulo={texto}
      accent="orange"
      esquina="abajo-der"
    />
  );
}
