"use client";

import { useEffect, useState } from "react";
import FilaLista from "@/components/FilaLista";
import { useToday } from "@/lib/today";
import { GROUPS, franjaDe } from "./franjas";

interface Conteo {
  hechas: number;
  total: number;
}

interface Resumen {
  medicamentos: Conteo;
  franjas: Record<string, Conteo>;
}

/**
 * "Todo lo de hoy" como menú: una fila para los medicamentos y una por cada
 * parte del día que tenga tareas. Cada fila abre su propia lista corta, en
 * vez de mostrar el día entero en una sola pantalla larga.
 */
export default function RutinaHub() {
  const date = useToday();
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    if (!date) return;
    let activo = true;
    (async () => {
      try {
        const [a, l, m, ml] = await Promise.all([
          fetch("/api/rutina"),
          fetch(`/api/rutina/logs?date=${date}`),
          fetch("/api/medicamentos"),
          fetch(`/api/medicamentos/logs?date=${date}`),
        ]);
        const actividades = a.ok ? ((await a.json()) as { id: number; timeOfDay: string }[]) : [];
        const logs = l.ok ? ((await l.json()) as { activityId: number; completed: boolean }[]) : [];
        const meds = m.ok ? ((await m.json()) as { id: number }[]) : [];
        const medLogs = ml.ok ? ((await ml.json()) as { medicationId: number; taken: boolean }[]) : [];

        const hechas = new Set(logs.filter((x) => x.completed).map((x) => x.activityId));
        const franjas: Record<string, Conteo> = {};
        for (const act of actividades) {
          const k = franjaDe(act.timeOfDay);
          franjas[k] ??= { hechas: 0, total: 0 };
          franjas[k].total += 1;
          if (hechas.has(act.id)) franjas[k].hechas += 1;
        }
        const ids = new Set(meds.map((x) => x.id));
        const tomados = medLogs.filter((x) => x.taken && ids.has(x.medicationId)).length;

        if (activo) setResumen({ medicamentos: { hechas: tomados, total: meds.length }, franjas });
      } catch {
        // sin conteos: las filas se muestran igual
        if (activo) setResumen({ medicamentos: { hechas: 0, total: 0 }, franjas: {} });
      }
    })();
    return () => {
      activo = false;
    };
  }, [date]);

  if (!resumen) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "9rem" }}
        aria-busy="true"
        aria-label="Cargando lo de hoy"
      >
        <span
          className="animate-spin"
          style={{
            width: 30,
            height: 30,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--green-solid)",
            display: "block",
          }}
        />
      </div>
    );
  }

  const { medicamentos, franjas } = resumen;
  const conTareas = GROUPS.filter((g) => franjas[g.key]?.total);

  return (
    <ul className="flex flex-col gap-3 list-none p-0 m-0">
      <li>
        <FilaLista
          href="/medicamentos"
          titulo="Mis medicamentos"
          subtitulo={
            medicamentos.total === 0
              ? "No tiene medicamentos"
              : `Tomó ${medicamentos.hechas} de ${medicamentos.total}`
          }
          accent="cyan"
          esquina="abajo-der"
        />
      </li>
      {conTareas.map((g) => (
        <li key={g.key}>
          <FilaLista
            href={`/rutina/${g.key}`}
            titulo={g.label}
            subtitulo={`Hizo ${franjas[g.key].hechas} de ${franjas[g.key].total}`}
            accent={g.accent}
            esquina="abajo-izq"
          />
        </li>
      ))}
      {conTareas.length === 0 && (
        <li className="card p-5 text-center" style={{ fontSize: "var(--t-sm)", fontWeight: 600 }}>
          Su familiar todavía no le ha puesto tareas para hoy.
        </li>
      )}
    </ul>
  );
}
