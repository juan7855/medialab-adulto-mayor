"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, CircleDashed, Clock, Undo2, UtensilsCrossed } from "lucide-react";
import Toast, { type ToastTone } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import IconTile from "@/components/IconTile";
import { useToday } from "@/lib/today";
import { rem } from "@/lib/scale";
import { ACCENTS } from "@/lib/theme";
import { acentoPendiente, iconoDe, nombreEnPregunta, type Meal } from "./comidas";

interface MealLog {
  mealId: number;
  eaten: boolean;
  eatenAt: string | null;
}

function formatHour(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MealList({ meals }: { meals: Meal[] }) {
  const date = useToday();
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; tone: ToastTone } | null>(null);
  const [confirm, setConfirm] = useState<Meal | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!date) return;
    try {
      const res = await fetch(`/api/nutricion/comidas?date=${date}`);
      if (res.ok) setLogs((await res.json()) as MealLog[]);
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
    void fetchLogs();
  }, [fetchLogs]);

  const setEaten = async (meal: Meal, eaten: boolean) => {
    setConfirm(null);
    if (!date) return;
    const previous = [...logs];
    const stamp = eaten ? new Date().toISOString() : null;

    setLogs((current) => {
      const exists = current.find((log) => log.mealId === meal.id);
      if (exists) {
        return current.map((log) =>
          log.mealId === meal.id ? { ...log, eaten, eatenAt: stamp } : log,
        );
      }
      return [...current, { mealId: meal.id, eaten, eatenAt: stamp }];
    });

    try {
      await fetch("/api/nutricion/comidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId: meal.id, date, eaten }),
      });
      setToast(
        eaten
          ? { msg: `${meal.name} registrado`, tone: "success" }
          : { msg: `${meal.name} desmarcado`, tone: "info" },
      );
    } catch {
      setLogs(previous);
      setToast({ msg: "No se pudo guardar. Intente de nuevo.", tone: "error" });
    }
  };

  const logOf = (mealId: number) => logs.find((log) => log.mealId === mealId);

  if (loading || !date) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "9rem" }}
        aria-busy="true"
        aria-label="Cargando las comidas de hoy"
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

  if (meals.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>Todavía no hay menú configurado.</p>
      </div>
    );
  }

  // Cuántas quedan por marcar: así la persona ve de entrada que hay algo que
  // hacer, sin tener que deducirlo del color de las tarjetas.
  const pendientes = meals.filter((meal) => !(logOf(meal.id)?.eaten ?? false)).length;

  return (
    <>
      <p
        className="mb-3.5"
        style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--ink)" }}
        aria-live="polite"
      >
        {pendientes === 0
          ? "Ya marcó todas las comidas de hoy."
          : pendientes === 1
            ? "Le falta 1 comida por marcar."
            : `Le faltan ${pendientes} comidas por marcar.`}
      </p>

      <div className="flex flex-col gap-3.5">
        {meals.map((meal) => {
          const log = logOf(meal.id);
          const eaten = log?.eaten ?? false;
          const hour = formatHour(log?.eatenAt ?? null);
          // El verde es el color de "ya comió" en toda la app: mientras la
          // comida está por marcar se pinta del color de su momento del día,
          // nunca de verde (ver acentoPendiente en comidas.ts).
          const pendingAccent = acentoPendiente(meal);
          const tone = eaten ? ACCENTS.green : ACCENTS[pendingAccent];

          return (
            <article
              key={meal.id}
              className="card"
              style={{
                overflow: "hidden",
                backgroundColor: eaten ? "var(--surface-soft)" : "var(--surface)",
              }}
              aria-label={`${meal.name}. ${eaten ? "Ya comido" : "Por marcar"}`}
            >
              {/* Portada teñida con la ficha del plato */}
              <div
                className="flex items-center justify-center"
                style={{
                  height: rem(108),
                  backgroundColor: tone.tint,
                  borderBottom: `1px solid ${tone.line}`,
                }}
              >
                <IconTile
                  icon={eaten ? Check : iconoDe(meal)}
                  accent={eaten ? "green" : pendingAccent}
                  size={62}
                  strokeWidth={eaten ? 2.6 : 1.8}
                />
              </div>

              <div className="p-4">
                <h3
                  style={{
                    fontSize: "var(--t-md)",
                    fontWeight: 800,
                    color: eaten ? "var(--ink-mute)" : "var(--ink)",
                  }}
                >
                  {meal.name}
                </h3>

                {/* La hora y, mientras esté pendiente, el estado escrito: el
                    color por sí solo no basta para saber si falta marcarla. */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="pill">
                    <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
                    {meal.time}
                  </span>

                  {!eaten && (
                    <span
                      className="pill"
                      style={{
                        backgroundColor: tone.tint,
                        borderColor: tone.line,
                      }}
                    >
                      <CircleDashed size={15} strokeWidth={2.4} aria-hidden="true" />
                      Por marcar
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-2 mt-3.5 list-none p-0 m-0">
                  {meal.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5"
                      style={{
                        fontSize: "var(--t-sm)",
                        fontWeight: 500,
                        color: eaten ? "var(--ink-mute)" : "var(--ink)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "999px",
                          backgroundColor: tone.solid,
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {eaten ? (
                  // La fila envuelve: la cápsula lleva nowrap y el botón tiene
                  // ancho propio, así que en pantallas estrechas el botón baja
                  // a su propia línea en vez de salirse de la tarjeta.
                  <div className="flex flex-wrap items-center gap-2.5 mt-4">
                    <span
                      className="pill"
                      style={{
                        backgroundColor: "var(--green-tint)",
                        borderColor: "var(--green-line)",
                      }}
                    >
                      <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                      {hour ? `Ya comió · ${hour}` : "Ya comió"}
                    </span>

                    <button
                      onClick={() => void setEaten(meal, false)}
                      className="btn-soft pressable"
                      style={{ paddingInline: "1rem" }}
                      aria-label={`Desmarcar ${nombreEnPregunta(meal)}`}
                    >
                      <Undo2 size={19} strokeWidth={2.2} aria-hidden="true" />
                      Deshacer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirm(meal)}
                    className="btn-cta pressable w-full mt-4"
                    aria-label={`Marcar ${nombreEnPregunta(meal)} como comido`}
                  >
                    <Check size={20} strokeWidth={2.6} aria-hidden="true" />
                    Listo, ya comí
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {confirm && (
        <ConfirmDialog
          message={`¿Ya comió ${nombreEnPregunta(confirm)}?`}
          onConfirm={() => void setEaten(confirm, true)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Sí, ya comí"
          cancelLabel="Todavía no"
          icon={UtensilsCrossed}
          accent={acentoPendiente(confirm)}
        />
      )}

      {toast && <Toast message={toast.msg} tone={toast.tone} onClose={() => setToast(null)} />}
    </>
  );
}
