"use client";

import { useState, useEffect, useCallback } from "react";
import { AlarmClock, Check, Clock, Pill } from "lucide-react";
import Toast, { type ToastTone } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToday } from "@/lib/today";
import { rem } from "@/lib/scale";

interface Medication {
  id: number;
  name: string;
  dose: string;
  time: string;
  color: string;
}

interface MedLog {
  medicationId: number;
  taken: boolean;
  takenAt: string | null;
}

export default function MedicationList() {
  const date = useToday();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; tone: ToastTone } | null>(null);
  const [confirm, setConfirm] = useState<{ medId: number; medName: string } | null>(null);
  const [snoozed, setSnoozed] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    if (!date) return;
    try {
      const [medsRes, logsRes] = await Promise.all([
        fetch("/api/medicamentos"),
        fetch(`/api/medicamentos/logs?date=${date}`),
      ]);
      if (medsRes.ok) setMedications((await medsRes.json()) as Medication[]);
      if (logsRes.ok) setLogs((await logsRes.json()) as MedLog[]);
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

  const markTaken = async (medId: number) => {
    setConfirm(null);
    if (!date) return;
    const previous = [...logs];

    setLogs((current) => {
      const stamp = new Date().toISOString();
      const exists = current.find((log) => log.medicationId === medId);
      if (exists) {
        return current.map((log) =>
          log.medicationId === medId ? { ...log, taken: true, takenAt: stamp } : log,
        );
      }
      return [...current, { medicationId: medId, taken: true, takenAt: stamp }];
    });

    try {
      await fetch("/api/medicamentos/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId: medId, date, taken: true }),
      });
      setToast({ msg: "Medicamento registrado", tone: "success" });
    } catch {
      setLogs(previous);
      setToast({ msg: "No se pudo guardar. Intenta de nuevo.", tone: "error" });
    }
  };

  const handleSnooze = (medId: number) => {
    setSnoozed((prev) => new Set([...prev, medId]));
    setToast({ msg: "Te recordamos en 10 minutos", tone: "info" });
    setTimeout(() => {
      setSnoozed((prev) => {
        const next = new Set(prev);
        next.delete(medId);
        return next;
      });
    }, 600_000);
  };

  const isTaken = (medId: number) =>
    logs.find((log) => log.medicationId === medId)?.taken ?? false;

  if (loading || !date) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "8rem" }}
        aria-busy="true"
        aria-label="Cargando medicamentos"
      >
        <span
          className="animate-spin"
          style={{
            width: 32,
            height: 32,
            borderRadius: "999px",
            border: "3px solid var(--line)",
            borderTopColor: "var(--cyan-solid)",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 700 }}>No hay medicamentos registrados.</p>
        <p className="mt-1.5" style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)" }}>
          Consulta a tu médico para agregarlos.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label="Medicamentos de hoy">
        {medications.map((med, i) => {
          const taken = isTaken(med.id);
          const isSnoozed = snoozed.has(med.id);
          // El color de cada medicamento viene de la base de datos.
          const tileColor = taken ? "var(--green-solid)" : med.color;

          return (
            <li
              key={med.id}
              className="card p-3.5 animate-rise"
              style={{
                animationDelay: `${i * 45}ms`,
                backgroundColor: taken ? "var(--surface-soft)" : "var(--surface)",
              }}
              aria-label={`${med.name}, ${med.dose}, a las ${med.time}. ${taken ? "Tomado" : "Pendiente"}`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className="tile"
                  style={{
                    width: rem(62),
                    height: rem(62),
                    borderRadius: rem(14),
                    backgroundColor: tileColor,
                  }}
                  aria-hidden="true"
                >
                  {taken ? (
                    <Check strokeWidth={2.6} color="#FAF8F5" />
                  ) : (
                    <Pill strokeWidth={2} color="#FAF8F5" />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "var(--t-md)",
                      fontWeight: 800,
                      color: taken ? "var(--ink-mute)" : "var(--ink)",
                      textDecoration: taken ? "line-through" : "none",
                    }}
                  >
                    {med.name}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                  >
                    {med.dose}
                  </div>
                  <span className="pill mt-2">
                    <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
                    {med.time}
                  </span>
                </div>
              </div>

              {!taken && (
                <div className="flex gap-2.5 mt-3.5">
                  <button
                    onClick={() => setConfirm({ medId: med.id, medName: med.name })}
                    className="flex-1 btn-cta pressable"
                    aria-label={`Marcar ${med.name} como tomado`}
                  >
                    <Check size={20} strokeWidth={2.6} aria-hidden="true" />
                    Ya lo tomé
                  </button>

                  <button
                    onClick={() => handleSnooze(med.id)}
                    disabled={isSnoozed}
                    className="btn-soft pressable"
                    style={{ paddingInline: "1rem", opacity: isSnoozed ? 0.55 : 1 }}
                    aria-label={
                      isSnoozed
                        ? "Recordatorio ya activado"
                        : `Recordar ${med.name} en 10 minutos`
                    }
                  >
                    <AlarmClock size={19} strokeWidth={2.2} aria-hidden="true" />
                    10 min
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {confirm && (
        <ConfirmDialog
          message={`¿Tomaste ${confirm.medName}?`}
          onConfirm={() => void markTaken(confirm.medId)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Sí, ya lo tomé"
          cancelLabel="Todavía no"
          icon={Pill}
          accent="cyan"
        />
      )}

      {toast && <Toast message={toast.msg} tone={toast.tone} onClose={() => setToast(null)} />}
    </>
  );
}
