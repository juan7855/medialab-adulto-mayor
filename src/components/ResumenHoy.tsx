"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { rem } from "@/lib/scale";
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
    <Link
      href="/rutina"
      className="pressable flex items-center gap-3 p-3.5"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-xl)",
        boxShadow: "var(--shadow-sm)",
        textDecoration: "none",
        color: "inherit",
      }}
      aria-label={`Todo lo de hoy. ${texto}`}
    >
      <span
        aria-hidden="true"
        style={{
          width: rem(44),
          height: rem(44),
          backgroundColor: "var(--orange-solid)",
          borderRadius: "50% 50% 50% 12%",
          flexShrink: 0,
        }}
      />
      <span className="flex-1 min-w-0">
        <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
          Todo lo de hoy
        </span>
        <span
          className="block mt-0.5"
          style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          {texto}
        </span>
      </span>
      <ChevronRight size={24} strokeWidth={2.3} color="var(--ink-soft)" aria-hidden="true" />
    </Link>
  );
}
