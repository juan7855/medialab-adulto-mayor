"use client";

import { useState, useEffect } from "react";

interface DayHistory {
  date: string;
  total: number;
  taken: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
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
      <div className="flex justify-center py-4" aria-busy="true" aria-label="Cargando historial">
        <div className="w-10 h-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-gray-500 text-center font-medium" style={{ fontSize: "1rem" }}>
        Sin historial disponible todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2" role="list" aria-label="Historial de medicamentos por día">
      {history.map((day) => {
        const allTaken = day.total > 0 && day.taken === day.total;
        const noneTaken = day.taken === 0;
        const partial = !allTaken && !noneTaken;

        return (
          <div
            key={day.date}
            role="listitem"
            className="flex items-center gap-4 rounded-2xl p-4"
            style={{
              backgroundColor: allTaken ? "#DCFCE7" : noneTaken ? "#FEE2E2" : "#FEF9C3",
              border: `2px solid ${allTaken ? "#86EFAC" : noneTaken ? "#FCA5A5" : "#FCD34D"}`,
            }}
            aria-label={`${formatDate(day.date)}: ${day.taken} de ${day.total} medicamentos tomados`}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white text-xl"
              style={{
                width: 48,
                height: 48,
                backgroundColor: allTaken ? "#16A34A" : noneTaken ? "#DC2626" : "#CA8A04",
              }}
              aria-hidden="true"
            >
              {allTaken ? "✓" : noneTaken ? "✗" : "~"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800 capitalize" style={{ fontSize: "1rem" }}>
                {formatDate(day.date)}
              </div>
              <div className="font-medium text-gray-600" style={{ fontSize: "0.9rem" }}>
                {day.taken} de {day.total} tomados
              </div>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "0.9rem",
                color: allTaken ? "#15803D" : noneTaken ? "#B91C1C" : "#B45309",
              }}
              aria-hidden="true"
            >
              {allTaken ? "Completo" : noneTaken ? "Ninguno" : "Parcial"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
