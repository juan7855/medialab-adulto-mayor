"use client";

import { useState, useEffect, useCallback } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Activity {
  id: number;
  title: string;
  description: string | null;
  timeOfDay: string;
  scheduledTime: string | null;
  emoji: string;
}

interface RoutineLog {
  activityId: number;
  completed: boolean;
  completedAt: string | null;
}

interface RutinaListProps {
  date: string;
}

const TIME_OF_DAY_LABELS: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  morning: { label: "Mañana", emoji: "🌅", color: "#92400E", bg: "#FEF9C3", border: "#FCD34D" },
  afternoon: { label: "Tarde", emoji: "☀️", color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD" },
  evening: { label: "Noche", emoji: "🌙", color: "#5B21B6", bg: "#EDE9FE", border: "#C4B5FD" },
};

export default function RutinaList({ date }: RutinaListProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [logs, setLogs] = useState<RoutineLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; emoji: string } | null>(null);
  const [confirm, setConfirm] = useState<{ actId: number; title: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [actRes, logRes] = await Promise.all([
        fetch("/api/rutina"),
        fetch(`/api/rutina/logs?date=${date}`),
      ]);
      if (actRes.ok) setActivities(await actRes.json() as Activity[]);
      if (logRes.ok) setLogs(await logRes.json() as RoutineLog[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const markCompleted = async (actId: number) => {
    setConfirm(null);
    const prev = [...logs];
    setLogs((l) => {
      const existing = l.find((log) => log.activityId === actId);
      if (existing) return l.map((log) => log.activityId === actId ? { ...log, completed: true, completedAt: new Date().toISOString() } : log);
      return [...l, { activityId: actId, completed: true, completedAt: new Date().toISOString() }];
    });
    try {
      await fetch("/api/rutina/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: actId, date, completed: true }),
      });
      setToast({ msg: "¡Actividad completada!", emoji: "✅" });
    } catch {
      setLogs(prev);
      setToast({ msg: "Error. Intenta de nuevo.", emoji: "❌" });
    }
  };

  const undoComplete = async (actId: number) => {
    const prev = [...logs];
    setLogs((l) => l.map((log) => log.activityId === actId ? { ...log, completed: false, completedAt: null } : log));
    try {
      await fetch("/api/rutina/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: actId, date, completed: false }),
      });
      setToast({ msg: "Actividad desmarcada", emoji: "↩️" });
    } catch {
      setLogs(prev);
    }
  };

  const isCompleted = (actId: number) =>
    logs.find((l) => l.activityId === actId)?.completed ?? false;

  const groups = ["morning", "afternoon", "evening"] as const;

  const completedCount = activities.filter((a) => isCompleted(a.id)).length;
  const totalCount = activities.length;

  if (loading) {
    return (
      <div className="flex justify-center py-8" aria-busy="true" aria-label="Cargando rutina">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 rounded-3xl bg-white shadow">
        <p className="text-gray-500 font-semibold" style={{ fontSize: "1.1rem" }}>
          No hay actividades programadas.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Progress */}
      <div
        className="rounded-3xl p-4 shadow"
        style={{ backgroundColor: "white" }}
        role="region"
        aria-label={`Progreso: ${completedCount} de ${totalCount} actividades completadas`}
      >
        <div className="flex justify-between mb-2">
          <span className="font-bold text-purple-700" style={{ fontSize: "1rem" }}>
            {completedCount} de {totalCount} completadas
          </span>
          <span className="font-bold text-gray-500" style={{ fontSize: "1rem" }}>
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </span>
        </div>
        <div
          className="w-full h-4 rounded-full bg-gray-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              backgroundColor: "#7C3AED",
            }}
          />
        </div>
      </div>

      {/* Activities by time of day */}
      {groups.map((group) => {
        const groupActivities = activities.filter((a) => a.timeOfDay === group);
        if (groupActivities.length === 0) return null;
        const meta = TIME_OF_DAY_LABELS[group];

        return (
          <section key={group} aria-label={`Actividades de la ${meta.label}`}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span style={{ fontSize: "1.5rem" }} aria-hidden="true">{meta.emoji}</span>
              <h2
                className="font-extrabold"
                style={{ fontSize: "1.15rem", color: meta.color }}
              >
                {meta.label}
              </h2>
            </div>

            <div className="flex flex-col gap-3" role="list">
              {groupActivities.map((activity) => {
                const done = isCompleted(activity.id);
                return (
                  <div
                    key={activity.id}
                    role="listitem"
                    className="rounded-2xl p-4 border-2 transition-all"
                    style={{
                      backgroundColor: done ? "#F0FDF4" : meta.bg,
                      borderColor: done ? "#86EFAC" : meta.border,
                    }}
                    aria-label={`${activity.title}${activity.scheduledTime ? ` a las ${activity.scheduledTime}` : ""}. Estado: ${done ? "completado" : "pendiente"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                        style={{ width: 64, height: 64, fontSize: "2rem", backgroundColor: done ? "#DCFCE7" : "white", flexShrink: 0 }}
                        aria-hidden="true"
                      >
                        {done ? "✅" : activity.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-extrabold text-gray-900"
                          style={{
                            fontSize: "1.1rem",
                            textDecoration: done ? "line-through" : "none",
                            color: done ? "#6B7280" : "#111827",
                          }}
                        >
                          {activity.title}
                        </div>
                        {activity.description && (
                          <div className="text-gray-500 font-medium mt-0.5" style={{ fontSize: "0.9rem" }}>
                            {activity.description}
                          </div>
                        )}
                        {activity.scheduledTime && (
                          <div className="text-gray-500 font-medium" style={{ fontSize: "0.9rem" }}>
                            🕐 {activity.scheduledTime}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-3">
                      {!done ? (
                        <button
                          onClick={() => setConfirm({ actId: activity.id, title: activity.title })}
                          className="flex-1 rounded-2xl font-extrabold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all"
                          style={{ minHeight: "56px", fontSize: "1rem" }}
                          aria-label={`Marcar como completado: ${activity.title}`}
                        >
                          ✅ Completado
                        </button>
                      ) : (
                        <button
                          onClick={() => void undoComplete(activity.id)}
                          className="flex-1 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 border-2 border-gray-300 transition-all"
                          style={{ minHeight: "56px", fontSize: "1rem" }}
                          aria-label={`Desmarcar: ${activity.title}`}
                        >
                          ↩️ Desmarcar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={`¿Completaste "${confirm.title}"?`}
          onConfirm={() => void markCompleted(confirm.actId)}
          onCancel={() => setConfirm(null)}
          confirmLabel="✅ Sí, completé"
          cancelLabel="❌ Cancelar"
          emoji="✅"
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.msg}
          emoji={toast.emoji}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
