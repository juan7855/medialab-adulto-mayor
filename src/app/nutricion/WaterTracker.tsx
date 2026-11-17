"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassWater } from "lucide-react";
import Toast from "@/components/Toast";
import { useToday } from "@/lib/today";

const GOAL = 8;

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
    if (!date || next < 0 || next > GOAL) return;
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

  // Tocar un vaso marca hasta ahí cuántos lleva. Tocar el último que ya
  // estaba marcado lo desmarca a él solo, para poder corregirse sin un
  // botón aparte.
  const tocarVaso = (indice: number) => {
    const valor = indice + 1;
    void updateWater(valor === glasses ? valor - 1 : valor);
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
      {/* Vasos: cada uno es un botón, no solo un dibujo */}
      <fieldset
        className="m-0 p-0 grid grid-cols-4 gap-2.5"
        style={{ border: 0 }}
        aria-label={`${glasses} de ${GOAL} vasos de agua`}
      >
        {Array.from({ length: GOAL }).map((_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tocarVaso(i)}
              className="flex flex-col items-center justify-center gap-1 pressable"
              style={{
                minHeight: "3.6rem",
                borderRadius: "var(--r-lg)",
                backgroundColor: filled ? "var(--blue-tint)" : "var(--surface)",
                border: `var(--border-w) solid ${filled ? "var(--blue-solid)" : "var(--line)"}`,
              }}
              aria-pressed={filled}
              aria-label={`Vaso ${i + 1} de ${GOAL}${filled ? ", tomado" : ""}`}
            >
              <GlassWater
                size={24}
                strokeWidth={filled ? 2.3 : 1.7}
                color={filled ? "var(--blue-solid)" : "var(--line-strong)"}
                aria-hidden="true"
                style={{ transition: "color 0.25s ease" }}
              />
              <span
                style={{
                  fontSize: "var(--t-xs)",
                  fontWeight: 700,
                  color: filled ? "var(--blue-solid)" : "var(--ink-mute)",
                }}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </fieldset>

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
          {reached
            ? "¡Meta del día alcanzada!"
            : `${glasses} de ${GOAL} vasos`}
        </p>
      </div>

      {toast && <Toast message={toast} tone="success" onClose={() => setToast(null)} />}
    </div>
  );
}
