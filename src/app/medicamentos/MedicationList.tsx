"use client";

import { useState, useEffect, useCallback } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Medication {
  id: number;
  name: string;
  dose: string;
  time: string;
  imageEmoji: string;
  color: string;
}

interface MedLog {
  medicationId: number;
  taken: boolean;
  takenAt: string | null;
}

interface MedicationListProps {
  date: string;
}

export default function MedicationList({ date }: MedicationListProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; emoji: string } | null>(null);
  const [confirm, setConfirm] = useState<{ medId: number; medName: string } | null>(null);
  const [snoozed, setSnoozed] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const [medsRes, logsRes] = await Promise.all([
        fetch("/api/medicamentos"),
        fetch(`/api/medicamentos/logs?date=${date}`),
      ]);
      if (medsRes.ok) setMedications(await medsRes.json() as Medication[]);
      if (logsRes.ok) setLogs(await logsRes.json() as MedLog[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const markTaken = async (medId: number) => {
    setConfirm(null);
    const prev = [...logs];
    setLogs((l) => {
      const existing = l.find((log) => log.medicationId === medId);
      if (existing) return l.map((log) => log.medicationId === medId ? { ...log, taken: true, takenAt: new Date().toISOString() } : log);
      return [...l, { medicationId: medId, taken: true, takenAt: new Date().toISOString() }];
    });
    try {
      await fetch("/api/medicamentos/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicationId: medId, date, taken: true }),
      });
      setToast({ msg: "¡Medicamento registrado!", emoji: "✅" });
    } catch {
      setLogs(prev);
      setToast({ msg: "Error. Intenta de nuevo.", emoji: "❌" });
    }
  };

  const handleSnooze = (medId: number) => {
    setSnoozed((prev) => new Set([...prev, medId]));
    setToast({ msg: "Recordatorio en 10 minutos", emoji: "⏰" });
    setTimeout(() => {
      setSnoozed((prev) => { const s = new Set(prev); s.delete(medId); return s; });
    }, 600000); // 10 min
  };

  const isTaken = (medId: number) =>
    logs.find((l) => l.medicationId === medId)?.taken ?? false;

  if (loading) {
    return (
      <div className="flex justify-center py-8" aria-busy="true" aria-label="Cargando medicamentos">
        <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 font-semibold" style={{ fontSize: "1.1rem" }}>
          No hay medicamentos registrados.
        </p>
        <p className="text-gray-400 mt-2" style={{ fontSize: "0.95rem" }}>
          Consulta a tu médico para agregar medicamentos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4" role="list" aria-label="Lista de medicamentos">
        {medications.map((med) => {
          const taken = isTaken(med.id);
          const isSnoozed = snoozed.has(med.id);

          return (
            <div
              key={med.id}
              role="listitem"
              className="rounded-2xl p-4 border-2 transition-all"
              style={{
                backgroundColor: taken ? "#F0FDF4" : "#FFF5F5",
                borderColor: taken ? "#86EFAC" : med.color,
                opacity: taken ? 0.85 : 1,
              }}
              aria-label={`${med.name}, ${med.dose}, a las ${med.time}. Estado: ${taken ? "tomado" : "pendiente"}`}
            >
              <div className="flex items-center gap-4">
                {/* Emoji */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                  style={{ width: 72, height: 72, fontSize: "2.2rem", backgroundColor: taken ? "#DCFCE7" : "#FEE2E2" }}
                  aria-hidden="true"
                >
                  {med.imageEmoji}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-gray-900" style={{ fontSize: "1.15rem" }}>
                    {med.name}
                  </div>
                  <div className="text-gray-600 font-medium" style={{ fontSize: "1rem" }}>
                    💊 {med.dose}
                  </div>
                  <div className="text-gray-500 font-medium" style={{ fontSize: "0.95rem" }}>
                    🕐 {med.time}
                  </div>
                </div>
                {/* Status badge */}
                {taken && (
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-white bg-green-500"
                    style={{ width: 48, height: 48, fontSize: "1.3rem" }}
                    aria-label="Tomado"
                  >
                    ✓
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {!taken && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setConfirm({ medId: med.id, medName: med.name })}
                    className="flex-1 rounded-2xl font-extrabold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
                    style={{ minHeight: "60px", fontSize: "1.05rem" }}
                    aria-label={`Marcar ${med.name} como tomado`}
                  >
                    ✅ Ya lo tomé
                  </button>
                  <button
                    onClick={() => handleSnooze(med.id)}
                    disabled={isSnoozed}
                    className="flex-1 rounded-2xl font-bold text-orange-700 bg-orange-100 hover:bg-orange-200 disabled:opacity-60 active:scale-95 transition-all border-2 border-orange-300"
                    style={{ minHeight: "60px", fontSize: "1rem" }}
                    aria-label={isSnoozed ? "Recordatorio activado para 10 minutos" : `Recordar en 10 min para ${med.name}`}
                  >
                    {isSnoozed ? "⏰ En 10 min" : "⏰ 10 min"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={`¿Tomaste "${confirm.medName}"?`}
          onConfirm={() => void markTaken(confirm.medId)}
          onCancel={() => setConfirm(null)}
          confirmLabel="✅ Sí, lo tomé"
          cancelLabel="❌ Cancelar"
          emoji="💊"
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
