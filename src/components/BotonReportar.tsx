"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

interface BotonReportarProps {
  targetType: "post" | "comment" | "message";
  targetId: number;
  compact?: boolean;
}

/** Reportar cualquier post, comentario o mensaje de Comunidad. No oculta
 *  nada por sí solo: sólo avisa. La revisión y el ocultar los hace un
 *  cuidador desde su propia app. */
export default function BotonReportar({ targetType, targetId, compact = false }: BotonReportarProps) {
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const confirmar = async () => {
    setEnviando(true);
    try {
      const res = await fetch("/api/comunidad/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      if (!res.ok) throw new Error("respuesta no válida");
      setToast("Reportado. Un cuidador lo va a revisar.");
    } catch {
      setToast("No se pudo reportar. Intente de nuevo.");
    } finally {
      setEnviando(false);
      setAbierto(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="chip-btn"
        style={compact ? { padding: "0.3rem 0.6rem", fontSize: "var(--t-xs)" } : undefined}
        aria-label="Reportar"
      >
        <Flag size={compact ? 14 : 16} strokeWidth={2.2} aria-hidden="true" />
        Reportar
      </button>

      {abierto && (
        <ConfirmDialog
          message="¿Quiere reportar esto? Un cuidador lo va a revisar."
          onConfirm={() => void confirmar()}
          onCancel={() => setAbierto(false)}
          confirmLabel={enviando ? "Enviando..." : "Sí, reportar"}
          icon={Flag}
          accent="red"
        />
      )}

      {toast && <Toast message={toast} tone="success" onClose={() => setToast(null)} />}
    </>
  );
}
