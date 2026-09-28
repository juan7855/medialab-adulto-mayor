"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface IniciarConversacionBotonProps {
  patientId: number;
  name: string;
}

/** Crea (o reusa) la conversación con este paciente y entra al hilo. */
export default function IniciarConversacionBoton({ patientId, name }: IniciarConversacionBotonProps) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/comunidad/conversaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "error");
      router.push(`/comunidad/mensajes/${data.id}`);
    } catch {
      setError("No se pudo abrir la conversación.");
      setCargando(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => void iniciar()}
        disabled={cargando}
        className="card pressable w-full flex items-center justify-between gap-3 p-3.5"
        style={{ opacity: cargando ? 0.6 : 1 }}
      >
        <span style={{ fontSize: "var(--t-md)", fontWeight: 700 }}>{name}</span>
        <ChevronRight size={20} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
      </button>
      {error && (
        <p
          role="alert"
          className="mt-1 px-1"
          style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--red-solid)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
