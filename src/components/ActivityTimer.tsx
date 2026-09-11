"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import Toast from "@/components/Toast";
import { ACCENTS, type AccentName } from "@/lib/theme";
import { todayISO } from "@/lib/today";

interface ActivityTimerProps {
  totalSeconds: number;
  exerciseName: string;
  exerciseId: string;
  accent: AccentName;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ActivityTimer({
  totalSeconds,
  exerciseName,
  exerciseId,
  accent,
}: ActivityTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /** El tiempo restante también vive en un ref para poder decidir el final
   *  dentro del callback del intervalo, sin encadenar efectos. */
  const remainingRef = useRef(totalSeconds);

  const tone = ACCENTS[accent];
  // El anillo lleva el color del acento; el botón, el navy de CTA, que es
  // el único de la paleta con contraste suficiente para texto blanco.
  const ringColor = finished ? ACCENTS.green.solid : tone.solid;

  const complete = useCallback(() => {
    setRunning(false);
    setFinished(true);
    setToast("¡Ejercicio completado!");

    fetch("/api/ejercicios/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // La fecha se manda desde el navegador: el servidor corre en UTC
      // y adelantaría el día durante la tarde-noche en América.
      body: JSON.stringify({ exerciseName, exerciseId, date: todayISO() }),
    }).catch(() => {});
  }, [exerciseName, exerciseId]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      remainingRef.current -= 1;
      setTimeLeft(Math.max(remainingRef.current, 0));

      if (remainingRef.current <= 0) {
        clearInterval(id);
        complete();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [running, complete]);

  const restart = () => {
    remainingRef.current = totalSeconds;
    setTimeLeft(totalSeconds);
    setFinished(false);
  };

  const handleStartPause = () => {
    if (finished) {
      restart();
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    restart();
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      {/* Anillo de progreso */}
      <div
        className="relative flex items-center justify-center"
        aria-live="polite"
        aria-label={`Tiempo restante: ${formatTime(timeLeft)}`}
      >
        <svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true">
          <circle
            cx="95"
            cy="95"
            r={radius}
            fill="none"
            strokeWidth="9"
            style={{ stroke: "var(--line)" }}
          />
          <circle
            cx="95"
            cy="95"
            r={radius}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 95 95)"
            style={{
              stroke: ringColor,
              transition: "stroke-dashoffset 0.8s ease, stroke 0.3s ease",
            }}
          />
        </svg>

        <div className="absolute text-center">
          <div
            style={{
              fontSize: "var(--t-2xl)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatTime(timeLeft)}
          </div>
          <div
            className="mt-0.5"
            style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--ink-mute)" }}
          >
            {finished ? "¡Listo!" : running ? "En curso" : "En pausa"}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-2.5 w-full">
        <button
          onClick={handleStartPause}
          className="flex-1 btn-cta pressable"
          aria-label={finished ? "Repetir ejercicio" : running ? "Pausar" : "Iniciar"}
        >
          {finished ? (
            <RotateCcw size={20} strokeWidth={2.3} aria-hidden="true" />
          ) : running ? (
            <Pause size={20} strokeWidth={2.3} aria-hidden="true" />
          ) : (
            <Play size={20} strokeWidth={2.3} aria-hidden="true" />
          )}
          {finished ? "Repetir" : running ? "Pausar" : "Iniciar"}
        </button>

        {!finished && (
          <button
            onClick={handleReset}
            className="btn-soft pressable"
            style={{ minWidth: "3.6rem" }}
            aria-label="Reiniciar temporizador"
          >
            <RotateCcw size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        )}
      </div>

      {toast && (
        <Toast message={toast} tone="success" onClose={() => setToast(null)} duration={3000} />
      )}
    </div>
  );
}
