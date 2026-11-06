"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Clock, Pill } from "lucide-react";
import Gota from "@/components/Gota";
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

/** "14:00" → "2:00 p. m.", como en el Figma. Si no hay hora, nada. */
function horaLegible(time: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(time ?? "");
  if (!m) return "";
  const h = Number(m[1]);
  const sufijo = h < 12 ? "a. m." : "p. m.";
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${sufijo}`;
}

/** Hora local en que se marcó: "7:05". */
function horaDeMarca(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${String(d.getMinutes()).padStart(2, "0")}`;
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
      setToast({ msg: "No se pudo guardar. Intente de nuevo.", tone: "error" });
    }
  };

  const handleSnooze = (medId: number) => {
    setSnoozed((prev) => new Set([...prev, medId]));
    setToast({ msg: "Se lo recordamos en 10 minutos", tone: "info" });
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
          Consulte a su médico para agregarlos.
        </p>
      </div>
    );
  }

  // El siguiente pendiente se resalta con borde naranja, como en el Figma.
  const siguiente = medications.find((m) => !isTaken(m.id))?.id;

  return (
    <>
      <ul className="flex flex-col gap-3 list-none p-0 m-0" aria-label="Medicamentos de hoy">
        {medications.map((med, i) => {
          const taken = isTaken(med.id);
          const isSnoozed = snoozed.has(med.id);
          const hora = horaLegible(med.time);

          if (taken) {
            const tomadoA = horaDeMarca(logs.find((l) => l.medicationId === med.id)?.takenAt);
            return (
              <li
                key={med.id}
                className="flex items-center gap-3.5 p-3.5 animate-rise"
                style={{
                  animationDelay: `${i * 45}ms`,
                  backgroundColor: "var(--green-tint)",
                  border: "2px solid var(--green-solid)",
                  borderRadius: "var(--r-xl)",
                }}
                aria-label={`${med.name}${hora ? `, ${hora}` : ""}. Ya se lo tomó${tomadoA ? ` a las ${tomadoA}` : ""}.`}
              >
                <span
                  className="tile"
                  style={{
                    width: rem(46),
                    height: rem(46),
                    borderRadius: "999px",
                    backgroundColor: "var(--green-solid)",
                  }}
                  aria-hidden="true"
                >
                  <Check strokeWidth={3} color="#fff" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block" style={{ fontSize: "var(--t-base)", fontWeight: 600 }}>
                    {hora ? `${hora} · ` : ""}
                    {med.name}
                  </span>
                  <span
                    className="block mt-0.5"
                    style={{ fontSize: "var(--t-sm)", fontWeight: 400, color: "var(--green-deep)" }}
                  >
                    {tomadoA ? `Se lo tomó a las ${tomadoA}` : "Ya se lo tomó"}
                  </span>
                </span>
              </li>
            );
          }

          const esSiguiente = med.id === siguiente;
          return (
            <li
              key={med.id}
              className="card p-4 animate-rise"
              style={{
                animationDelay: `${i * 45}ms`,
                borderRadius: "var(--r-xl)",
                border: esSiguiente ? "2px solid var(--orange-solid)" : undefined,
              }}
              aria-label={`${med.name}, ${med.dose}${hora ? `, a las ${hora}` : ""}. Pendiente`}
            >
              <div className="flex items-center gap-3.5">
                <Gota accent="cyan" size={58} esquina="abajo-der" enCuadro />

                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "var(--t-md)", fontWeight: 600, lineHeight: 1.2 }}>
                    {med.name}
                  </div>
                  {hora && (
                    <span
                      className="pill mt-2"
                      style={
                        esSiguiente
                          ? { backgroundColor: "var(--orange-tint)", borderColor: "var(--orange-line)" }
                          : undefined
                      }
                    >
                      <Clock size={17} strokeWidth={2.2} aria-hidden="true" />
                      {hora}
                    </span>
                  )}
                  <div
                    className="mt-1.5"
                    style={{ fontSize: "var(--t-sm)", fontWeight: 400, color: "var(--ink-mute)" }}
                  >
                    {med.dose}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => setConfirm({ medId: med.id, medName: med.name })}
                  className="flex-1 btn-cta pressable"
                  aria-label={`Marcar ${med.name} como tomado`}
                >
                  Ya lo tomé
                </button>

                <button
                  onClick={() => handleSnooze(med.id)}
                  disabled={isSnoozed}
                  className="btn-soft pressable"
                  style={{
                    paddingInline: "1rem",
                    color: isSnoozed ? "var(--ink-mute)" : undefined,
                    borderColor: isSnoozed ? "var(--line)" : undefined,
                  }}
                  aria-label={
                    isSnoozed ? "Recordatorio ya activado" : `Recordar ${med.name} en 10 minutos`
                  }
                >
                  En 10 min
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {confirm && (
        <ConfirmDialog
          message={`¿Tomó ${confirm.medName}?`}
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
