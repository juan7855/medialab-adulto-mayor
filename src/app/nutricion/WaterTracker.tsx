"use client";

import { useState, useEffect, useCallback } from "react";
import Toast from "@/components/Toast";

interface WaterTrackerProps {
  date: string;
}

const GOAL = 8;

export default function WaterTracker({ date }: WaterTrackerProps) {
  const [glasses, setGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchWater = useCallback(async () => {
    try {
      const res = await fetch(`/api/nutricion/agua?date=${date}`);
      if (res.ok) {
        const data = await res.json() as { glasses: number };
        setGlasses(data.glasses);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetchWater();
  }, [fetchWater]);

  const updateWater = async (newGlasses: number) => {
    if (newGlasses < 0 || newGlasses > 12) return;
    const prev = glasses;
    setGlasses(newGlasses);
    try {
      await fetch("/api/nutricion/agua", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, glasses: newGlasses }),
      });
      if (newGlasses > prev) {
        if (newGlasses >= GOAL) {
          setToast("¡Meta alcanzada! 🏆 8 vasos de agua");
        } else {
          setToast(`¡Vaso registrado! ${newGlasses} de ${GOAL} 💧`);
        }
      }
    } catch {
      setGlasses(prev);
    }
  };

  const percentage = Math.min((glasses / GOAL) * 100, 100);

  if (loading) {
    return (
      <div className="flex justify-center py-6" aria-busy="true" aria-label="Cargando datos de agua">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Glasses visual */}
      <div
        className="flex flex-wrap justify-center gap-2"
        role="img"
        aria-label={`${glasses} de ${GOAL} vasos de agua tomados`}
      >
        {Array.from({ length: GOAL }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              fontSize: "1.6rem",
              filter: i < glasses ? "none" : "grayscale(1) opacity(0.3)",
            }}
            className="flex items-center justify-center transition-all duration-300"
            aria-hidden="true"
          >
            💧
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full" role="progressbar" aria-valuenow={glasses} aria-valuemin={0} aria-valuemax={GOAL} aria-label={`Progreso: ${glasses} vasos`}>
        <div className="flex justify-between mb-1">
          <span className="font-bold text-blue-700" style={{ fontSize: "1rem" }}>
            {glasses} vasos
          </span>
          <span className="font-semibold text-gray-500" style={{ fontSize: "1rem" }}>
            Meta: {GOAL} vasos
          </span>
        </div>
        <div className="w-full h-5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: glasses >= GOAL ? "#16A34A" : "#2563EB",
            }}
          />
        </div>
        {glasses >= GOAL && (
          <p className="text-center text-green-700 font-bold mt-2" style={{ fontSize: "1rem" }}>
            ✅ ¡Meta alcanzada!
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => void updateWater(glasses - 1)}
          disabled={glasses <= 0}
          aria-label="Quitar un vaso de agua"
          className="flex items-center justify-center rounded-2xl font-extrabold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 active:scale-95 transition-all"
          style={{ width: 88, height: 88, fontSize: "2.5rem" }}
        >
          −
        </button>
        <div
          className="flex flex-col items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="font-extrabold text-blue-700" style={{ fontSize: "2.5rem" }}>
            {glasses}
          </span>
          <span className="text-gray-500 font-medium" style={{ fontSize: "0.85rem" }}>
            vasos
          </span>
        </div>
        <button
          onClick={() => void updateWater(glasses + 1)}
          disabled={glasses >= 12}
          aria-label="Agregar un vaso de agua"
          className="flex items-center justify-center rounded-2xl font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 active:scale-95 transition-all"
          style={{ width: 88, height: 88, fontSize: "2.5rem" }}
        >
          +
        </button>
      </div>

      {toast && (
        <Toast message={toast} emoji="💧" onClose={() => setToast(null)} />
      )}
    </div>
  );
}
