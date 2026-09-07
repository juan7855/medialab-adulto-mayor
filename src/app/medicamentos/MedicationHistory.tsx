"use client";

import { useState, useEffect } from "react";

interface DayHistory {
  date: string;
  total: number;
  taken: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const text = date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Estado del día según cuántas dosis se registraron. */
function statusOf(day: DayHistory) {
  if (day.total > 0 && day.taken === day.total) {
    return { label: "Completo", tint: "var(--green-tint)", line: "var(--green-line)", ink: "var(--green-ink)" };
  }
  if (day.taken === 0) {
    return { label: "Ninguno", tint: "var(--red-tint)", line: "var(--red-line)", ink: "var(--red-ink)" };
  }
  return { label: "Parcial", tint: "var(--amber-tint)", line: "var(--amber-line)", ink: "var(--amber-ink)" };
}

export default function MedicationHistory() {
  const [history, setHistory] = useState<DayHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/medicamentos/historial")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setHistory(data as DayHistory[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "5rem" }}
        aria-busy="true"
        aria-label="Cargando historial"
      >
        <span
          className="animate-spin"
          style={{
            width: 26,
            height: 26,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--blue-ink)",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p
        className="text-center py-4"
        style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--ink-mute)" }}
      >
        Todavía no hay historial.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 list-none p-0 m-0" aria-label="Historial de los últimos 7 días">
      {history.map((day) => {
        const status = statusOf(day);
        const ratio = day.total > 0 ? day.taken / day.total : 0;

        return (
          <li
            key={day.date}
            className="flex items-center gap-3"
            style={{
              backgroundColor: "var(--surface-soft)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-md)",
              padding: "0.7rem 0.85rem",
            }}
            aria-label={`${formatDate(day.date)}: ${day.taken} de ${day.total} medicamentos tomados`}
          >
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "0.86rem", fontWeight: 700 }}>{formatDate(day.date)}</div>

              {/* Barra de cumplimiento del día */}
              <div
                className="mt-1.5"
                style={{
                  height: 5,
                  borderRadius: "999px",
                  backgroundColor: "var(--line)",
                  overflow: "hidden",
                }}
                aria-hidden="true"
              >
                <div
                  style={{
                    width: `${ratio * 100}%`,
                    height: "100%",
                    borderRadius: "999px",
                    backgroundColor: status.ink,
                  }}
                />
              </div>
            </div>

            <span
              className="pill"
              style={{ backgroundColor: status.tint, borderColor: status.line, color: status.ink }}
            >
              {day.taken}/{day.total} · {status.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
