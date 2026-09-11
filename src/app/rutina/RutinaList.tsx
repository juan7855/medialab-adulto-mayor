"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Armchair,
  Bed,
  Check,
  CircleCheck,
  Clock,
  CookingPot,
  Egg,
  Footprints,
  Moon,
  Phone,
  Pill,
  Salad,
  Sun,
  Sunrise,
  Tv,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import Toast, { type ToastTone } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import SectionTitle from "@/components/SectionTitle";
import { useToday } from "@/lib/today";
import { ACCENTS, type AccentName } from "@/lib/theme";

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

const GROUPS: { key: string; label: string; icon: LucideIcon; accent: AccentName }[] = [
  { key: "morning", label: "Mañana", icon: Sunrise, accent: "yellow" },
  { key: "afternoon", label: "Tarde", icon: Sun, accent: "orange" },
  { key: "evening", label: "Noche", icon: Moon, accent: "purple" },
];

/**
 * La rutina se siembra con un emoji por actividad. Se traduce a un icono de
 * línea para que cada fila se distinga, en vez de repetir el de su franja.
 */
const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  "\u{1F48A}": Pill, // pastilla
  "\u{1F373}": Egg, // desayuno
  "\u{1F6B6}": Footprints, // caminata
  "\u{1F9D8}": Armchair, // estiramiento
  "\u{1F372}": CookingPot, // almuerzo
  "\u{1F634}": Bed, // siesta
  "\u{1F4DE}": Phone, // llamada a familiar
  "\u{1F957}": Salad, // cena
  "\u{1F4FA}": Tv, // ocio
  "\u{1F6CF}": Bed, // preparar para dormir
};

function formatToday(iso: string): string {
  const text = new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function RutinaList() {
  const date = useToday();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [logs, setLogs] = useState<RoutineLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; tone: ToastTone } | null>(null);
  const [confirm, setConfirm] = useState<{ actId: number; title: string } | null>(null);

  const fetchData = useCallback(async () => {
    if (!date) return;
    try {
      const [actRes, logRes] = await Promise.all([
        fetch("/api/rutina"),
        fetch(`/api/rutina/logs?date=${date}`),
      ]);
      if (actRes.ok) setActivities((await actRes.json()) as Activity[]);
      if (logRes.ok) setLogs((await logRes.json()) as RoutineLog[]);
    } catch {
      // se deja la lista como esté
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    // La carga es asíncrona: el estado se actualiza después del await, no
    // de forma síncrona dentro del efecto, así que no encadena renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  const setCompleted = async (actId: number, completed: boolean) => {
    setConfirm(null);
    if (!date) return;
    const previous = [...logs];
    const stamp = completed ? new Date().toISOString() : null;

    setLogs((current) => {
      const exists = current.find((log) => log.activityId === actId);
      if (exists) {
        return current.map((log) =>
          log.activityId === actId ? { ...log, completed, completedAt: stamp } : log,
        );
      }
      return [...current, { activityId: actId, completed, completedAt: stamp }];
    });

    try {
      await fetch("/api/rutina/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: actId, date, completed }),
      });
      setToast(
        completed
          ? { msg: "Actividad completada", tone: "success" }
          : { msg: "Actividad desmarcada", tone: "info" },
      );
    } catch {
      setLogs(previous);
      setToast({ msg: "No se pudo guardar. Intenta de nuevo.", tone: "error" });
    }
  };

  const isCompleted = (actId: number) =>
    logs.find((log) => log.activityId === actId)?.completed ?? false;

  if (loading || !date) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "9rem" }}
        aria-busy="true"
        aria-label="Cargando la rutina"
      >
        <span
          className="animate-spin"
          style={{
            width: 30,
            height: 30,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--purple-solid)",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>No hay actividades programadas.</p>
      </div>
    );
  }

  const done = activities.filter((a) => isCompleted(a.id)).length;
  const total = activities.length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = done === total;

  return (
    <div className="flex flex-col gap-7">
      {/* Progreso del día */}
      <div className="card p-4">
        <p style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--ink-mute)" }}>
          {formatToday(date)}
        </p>

        <div className="flex items-baseline justify-between mt-2">
          <span style={{ fontSize: "var(--t-xl)", fontWeight: 800 }}>
            {done}
            <span style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}> de {total}</span>
          </span>
          <span
            style={{
              fontSize: "var(--t-sm)",
              fontWeight: 800,
              color: "var(--ink-soft)",
            }}
          >
            {percent}%
          </span>
        </div>

        <div
          className="mt-2.5"
          style={{
            height: 8,
            borderRadius: "999px",
            backgroundColor: "var(--line)",
            overflow: "hidden",
          }}
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${done} de ${total} actividades completadas`}
        >
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              borderRadius: "999px",
              backgroundColor: allDone ? "var(--green-solid)" : "var(--purple-solid)",
              transition: "width 0.45s ease, background-color 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Actividades por franja horaria */}
      {GROUPS.map((group) => {
        const items = activities.filter((a) => a.timeOfDay === group.key);
        if (items.length === 0) return null;
        const tone = ACCENTS[group.accent];

        return (
          <section key={group.key} aria-label={`Actividades de la ${group.label}`}>
            <SectionTitle icon={group.icon} accent={group.accent}>
              {group.label}
            </SectionTitle>

            <ul className="flex flex-col gap-2.5 mt-3 list-none p-0 m-0">
              {items.map((activity) => {
                const completed = isCompleted(activity.id);
                const ActivityIcon = ACTIVITY_ICONS[activity.emoji] ?? group.icon;

                return (
                  <li
                    key={activity.id}
                    className="card flex items-center gap-3 p-3.5"
                    style={{
                      backgroundColor: completed ? "var(--surface-soft)" : "var(--surface)",
                    }}
                  >
                    <span
                      style={{
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        borderRadius: 12,
                        backgroundColor: completed ? "var(--green-solid)" : tone.solid,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-hidden="true"
                    >
                      {completed ? (
                        <CircleCheck size={26} strokeWidth={2.2} color={ACCENTS.green.glyph} />
                      ) : (
                        <ActivityIcon size={26} strokeWidth={2} color={tone.glyph} />
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontSize: "var(--t-sm)",
                          fontWeight: 800,
                          lineHeight: 1.25,
                          color: completed ? "var(--ink-mute)" : "var(--ink)",
                          textDecoration: completed ? "line-through" : "none",
                        }}
                      >
                        {activity.title}
                      </div>

                      {activity.description && (
                        <div
                          className="mt-0.5"
                          style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                        >
                          {activity.description}
                        </div>
                      )}

                      {activity.scheduledTime && (
                        <span className="pill mt-1.5">
                          <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
                          {activity.scheduledTime}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        completed
                          ? void setCompleted(activity.id, false)
                          : setConfirm({ actId: activity.id, title: activity.title })
                      }
                      className="pressable flex items-center justify-center"
                      style={{
                        width: "3.3rem",
                        height: "3.3rem",
                        minHeight: "3.3rem",
                        flexShrink: 0,
                        borderRadius: "999px",
                        backgroundColor: completed ? "var(--surface-soft)" : "var(--cta)",
                        border: completed ? "1px solid var(--line-strong)" : "none",
                        color: completed ? "var(--ink-soft)" : "#fff",
                      }}
                      aria-label={
                        completed
                          ? `Desmarcar ${activity.title}`
                          : `Marcar ${activity.title} como completada`
                      }
                    >
                      {completed ? (
                        <Undo2 size={21} strokeWidth={2.3} aria-hidden="true" />
                      ) : (
                        <Check size={25} strokeWidth={2.8} aria-hidden="true" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {confirm && (
        <ConfirmDialog
          message={`¿Completaste ${confirm.title}?`}
          onConfirm={() => void setCompleted(confirm.actId, true)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Sí, ya la hice"
          cancelLabel="Todavía no"
          icon={CircleCheck}
          accent="purple"
        />
      )}

      {toast && <Toast message={toast.msg} tone={toast.tone} onClose={() => setToast(null)} />}
    </div>
  );
}
