"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Toast from "@/components/Toast";

interface ExerciseTimerProps {
  totalSeconds: number;
  exerciseName: string;
  exerciseId: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ExerciseTimer({
  totalSeconds,
  exerciseName,
  exerciseId,
}: ExerciseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [running, stopTimer]);

  useEffect(() => {
    if (finished) {
      setToast("¡Ejercicio completado! 🎉");
      // Save to DB
      fetch("/api/ejercicios/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseName, exerciseId }),
      }).catch(() => {});
    }
  }, [finished, exerciseName, exerciseId]);

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleStartPause = () => {
    if (finished) {
      setTimeLeft(totalSeconds);
      setFinished(false);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    setTimeLeft(totalSeconds);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Circular timer */}
      <div className="relative flex items-center justify-center" aria-live="polite" aria-label={`Tiempo: ${formatTime(timeLeft)}`}>
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={finished ? "#16A34A" : "#2563EB"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute text-center">
          <div
            className="font-extrabold text-gray-900"
            style={{ fontSize: "2.2rem", letterSpacing: "-0.02em" }}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="text-gray-500 font-medium" style={{ fontSize: "0.85rem" }}>
            {finished ? "¡Listo!" : running ? "En curso" : "Pausado"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full px-4">
        <button
          onClick={handleStartPause}
          className="flex-1 rounded-2xl font-extrabold text-white transition-all active:scale-95"
          style={{
            minHeight: "72px",
            fontSize: "1.3rem",
            backgroundColor: finished ? "#16A34A" : running ? "#DC2626" : "#2563EB",
          }}
          aria-label={finished ? "Reiniciar ejercicio" : running ? "Pausar temporizador" : "Iniciar temporizador"}
        >
          {finished ? "🔄 Repetir" : running ? "⏸ Pausar" : "▶ Iniciar"}
        </button>
        {!finished && (
          <button
            onClick={handleReset}
            className="rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 border-2 border-gray-300 transition-all"
            style={{ minHeight: "72px", minWidth: "88px", fontSize: "1.1rem" }}
            aria-label="Reiniciar temporizador"
          >
            🔁
          </button>
        )}
      </div>

      {toast && (
        <Toast
          message={toast}
          emoji="🎉"
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
}
