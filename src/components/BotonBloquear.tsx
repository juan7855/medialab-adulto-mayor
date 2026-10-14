"use client";

import { useEffect, useState } from "react";
import { ShieldOff, ShieldCheck } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

interface BotonBloquearProps {
  patientId: number;
  name: string;
}

/** Bloquea o desbloquea al otro participante de una conversación. Al
 *  montar, consulta si ya está bloqueado para mostrar la acción correcta. */
export default function BotonBloquear({ patientId, name }: BotonBloquearProps) {
  const [bloqueado, setBloqueado] = useState<boolean | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/comunidad/bloqueos")
      .then((r) => r.json())
      .then((ids: number[]) => {
        if (!cancelado) setBloqueado(ids.includes(patientId));
      })
      .catch(() => {
        if (!cancelado) setBloqueado(false);
      });
    return () => {
      cancelado = true;
    };
  }, [patientId]);

  const confirmar = async () => {
    setCargando(true);
    try {
      if (bloqueado) {
        await fetch(`/api/comunidad/bloqueos?patientId=${patientId}`, { method: "DELETE" });
        setBloqueado(false);
      } else {
        await fetch("/api/comunidad/bloqueos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });
        setBloqueado(true);
      }
    } finally {
      setCargando(false);
      setAbierto(false);
    }
  };

  if (bloqueado === null) return null;

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="chip-btn"
        aria-label={bloqueado ? `Desbloquear a ${name}` : `Bloquear a ${name}`}
      >
        {bloqueado ? (
          <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
        ) : (
          <ShieldOff size={16} strokeWidth={2.2} aria-hidden="true" />
        )}
        {bloqueado ? "Desbloquear" : "Bloquear"}
      </button>

      {abierto && (
        <ConfirmDialog
          message={
            bloqueado
              ? `¿Quiere volver a recibir mensajes de ${name}?`
              : `¿Quiere dejar de recibir mensajes de ${name}?`
          }
          onConfirm={() => void confirmar()}
          onCancel={() => setAbierto(false)}
          confirmLabel={cargando ? "Un momento..." : bloqueado ? "Sí, desbloquear" : "Sí, bloquear"}
          icon={bloqueado ? ShieldCheck : ShieldOff}
          accent={bloqueado ? "green" : "red"}
        />
      )}
    </>
  );
}
