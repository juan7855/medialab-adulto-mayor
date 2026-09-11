"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassWater, Minus, Plus } from "lucide-react";
import Toast from "@/components/Toast";
import { useToday } from "@/lib/today";

const GOAL = 8;
const MAX = 12;

export default function WaterTracker() {
  const date = useToday();
  const [glasses, setGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchWater = useCallback(async () => {
    if (!date) return;
    try {
      const res = await fetch(`/api/nutricion/agua?date=${date}`);
      if (res.ok) {
        const data = (await res.json()) as { glasses: number };
        setGlasses(data.glasses);
      }
    } catch {
      // se mantiene el valor actual
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    // La carga es asíncrona: el estado se actualiza después del await, no
    // de forma síncrona dentro del efecto, así que no encadena renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchWater();
  }, [fetchWater]);

  const updateWater = async (next: number) => {
    if (!date || next < 0 || next > MAX) return;
    const previous = glasses;
    setGlasses(next);

    try {
      await fetch("/api/nutricion/agua", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, glasses: next }),
      });
      if (next > previous) {
        setToast(
          next >= GOAL ? "¡Meta alcanzada! 8 vasos" : `Vaso registrado · ${next} de ${GOAL}`,
        );
      }
    } catch {
      setGlasses(previous);
    }
  };

  const percentage = Math.min((glasses / GOAL) * 100, 100);
  const reached = glasses >= GOAL;

  if (loading || !date) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "9rem" }}
        aria-busy="true"
        aria-label="Cargando el registro de agua"
      >
        <span
          className="animate-spin"
          style={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--blue-solid)",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Vasos */}
      <div
        className="flex justify-between"
        role="img"
        aria-label={`${glasses} de ${GOAL} vasos de agua`}
      >
        {Array.from({ length: GOAL }).map((_, i) => {
          const filled = i < glasses;
          return (
            <GlassWater
              key={i}
              size={26}
              strokeWidth={filled ? 2.2 : 1.7}
              color={filled ? "var(--blue-solid)" : "var(--line-strong)"}
              aria-hidden="true"
              style={{ transition: "color 0.25s ease" }}
            />
          );
        })}
      </div>

      {/* Barra de progreso */}
      <div
        role="progressbar"
        aria-valuenow={glasses}
        aria-valuemin={0}
        aria-valuemax={GOAL}
        aria-label={`Progreso de agua: ${glasses} de ${GOAL} vasos`}
      >
        <div
          style={{
            height: 10,
            borderRadius: "999px",
            backgroundColor: "var(--line)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              borderRadius: "999px",
              backgroundColor: reached ? "var(--green-solid)" : "var(--blue-solid)",
              transition: "width 0.45s ease, background-color 0.3s ease",
            }}
          />
        </div>
        <p
          className="mt-2 text-center"
          style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--ink-mute)" }}
        >
          {reached ? "¡Meta del día alcanzada!" : `Meta: ${GOAL} vasos`}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => void updateWater(glasses - 1)}
          disabled={glasses <= 0}
          aria-label="Quitar un vaso de agua"
          className="btn-soft pressable"
          style={{ width: "3.6rem", opacity: glasses <= 0 ? 0.4 : 1 }}
        >
          <Minus size={24} strokeWidth={2.6} aria-hidden="true" />
        </button>

        <div className="text-center" aria-live="polite" aria-atomic="true">
          <div style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1 }}>{glasses}</div>
          <div style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
            {glasses === 1 ? "vaso" : "vasos"}
          </div>
        </div>

        <button
          onClick={() => void updateWater(glasses + 1)}
          disabled={glasses >= MAX}
          aria-label="Agregar un vaso de agua"
          className="btn-cta pressable"
          style={{ width: "3.6rem", opacity: glasses >= MAX ? 0.4 : 1 }}
        >
          <Plus size={24} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>

      {toast && <Toast message={toast} tone="success" onClose={() => setToast(null)} />}
    </div>
  );
}
