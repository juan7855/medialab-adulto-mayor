"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Undo2 } from "lucide-react";
import Toast, { type ToastTone } from "@/components/Toast";
import IconTile from "@/components/IconTile";
import { useToday } from "@/lib/today";
import { ACCENTS } from "@/lib/theme";
import { FOOD_GROUP_ICONS, FOOD_GROUP_ICON_FALLBACK, type FoodGroup } from "./grupos";

interface FoodGroupLog {
  foodGroupId: number;
  eaten: boolean;
  eatenAt: string | null;
}

/**
 * "Lo que comí" como grupos de alimentos (Carbohidratos, Proteínas...), no
 * como platos fijos: la persona marca qué grupos incluyó hoy, cada uno con
 * la guía propia de su condición. Se puede marcar y desmarcar sin
 * confirmación — es un error fácil de corregir, no una toma de medicamento.
 */
export default function FoodGroupList({ groups }: { groups: FoodGroup[] }) {
  const date = useToday();
  const [logs, setLogs] = useState<FoodGroupLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; tone: ToastTone } | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!date) return;
    try {
      const res = await fetch(`/api/nutricion/grupos/logs?date=${date}`);
      if (res.ok) setLogs((await res.json()) as FoodGroupLog[]);
    } catch {
      // se deja la lista como esté
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLogs();
  }, [fetchLogs]);

  const toggle = async (group: FoodGroup, eaten: boolean) => {
    if (!date) return;
    const previous = [...logs];
    const stamp = eaten ? new Date().toISOString() : null;

    setLogs((current) => {
      const exists = current.find((log) => log.foodGroupId === group.id);
      if (exists) {
        return current.map((log) =>
          log.foodGroupId === group.id ? { ...log, eaten, eatenAt: stamp } : log,
        );
      }
      return [...current, { foodGroupId: group.id, eaten, eatenAt: stamp }];
    });

    try {
      await fetch("/api/nutricion/grupos/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodGroupId: group.id, date, eaten }),
      });
      setToast(
        eaten
          ? { msg: `${group.name} registrado`, tone: "success" }
          : { msg: `${group.name} desmarcado`, tone: "info" },
      );
    } catch {
      setLogs(previous);
      setToast({ msg: "No se pudo guardar. Intente de nuevo.", tone: "error" });
    }
  };

  const logOf = (groupId: number) => logs.find((log) => log.foodGroupId === groupId);

  if (loading || !date) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "9rem" }}
        aria-busy="true"
        aria-label="Cargando los grupos de alimentos"
      >
        <span
          className="animate-spin"
          style={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--orange-solid)",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>
          Todavía no hay grupos de alimentos configurados.
        </p>
        <p className="mt-1.5" style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)" }}>
          Su familiar los puede agregar desde su plataforma.
        </p>
      </div>
    );
  }

  const pendientes = groups.filter((g) => !(logOf(g.id)?.eaten ?? false)).length;

  return (
    <>
      <p
        className="mb-3.5"
        style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--ink)" }}
        aria-live="polite"
      >
        {pendientes === 0
          ? "Ya marcó todos los grupos de hoy."
          : pendientes === 1
            ? "Le falta 1 grupo por marcar."
            : `Le faltan ${pendientes} grupos por marcar.`}
      </p>

      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {groups.map((group) => {
          const log = logOf(group.id);
          const eaten = log?.eaten ?? false;
          const Icon = FOOD_GROUP_ICONS[group.emoji] ?? FOOD_GROUP_ICON_FALLBACK;
          const tone = eaten ? ACCENTS.green : ACCENTS[group.accent];

          return (
            <li key={group.id}>
              <button
                onClick={() => void toggle(group, !eaten)}
                className="card pressable w-full text-left flex items-center gap-3.5 p-4"
                style={{
                  backgroundColor: eaten ? "var(--green-tint)" : "var(--surface)",
                  border: `2px solid ${eaten ? "var(--green-solid)" : "var(--line)"}`,
                }}
                aria-pressed={eaten}
                aria-label={`${group.name}. ${group.description}. ${eaten ? "Ya lo comió, toque para desmarcar." : "Por marcar, toque para marcar como comido."}`}
              >
                <IconTile icon={eaten ? Check : Icon} accent={eaten ? "green" : group.accent} size={54} />

                <span className="flex-1 min-w-0">
                  <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 700 }}>
                    {group.name}
                  </span>
                  <span
                    className="block mt-1"
                    style={{ fontSize: "var(--t-sm)", fontWeight: 400, color: "var(--ink-mute)" }}
                  >
                    {group.description}
                  </span>
                </span>

                <span
                  className="pill flex-shrink-0"
                  style={
                    eaten
                      ? { backgroundColor: "var(--green-tint)", borderColor: "var(--green-line)", color: "var(--green-deep)" }
                      : { backgroundColor: tone.tint, borderColor: tone.line }
                  }
                  aria-hidden="true"
                >
                  {eaten ? (
                    <>
                      <Undo2 size={16} strokeWidth={2.2} />
                      Deshacer
                    </>
                  ) : (
                    <>
                      <Check size={16} strokeWidth={2.2} />
                      Marcar
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {toast && <Toast message={toast.msg} tone={toast.tone} onClose={() => setToast(null)} />}
    </>
  );
}
