"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { rem } from "@/lib/scale";
import { ASISTENTE as asistente } from "@/lib/asistentes";
import { useToday } from "@/lib/today";

/**
 * Panela con su globo de diálogo y el botón para contarle cómo se siente la
 * persona. Va dentro de la tarjeta de bienvenida del inicio; si ya escribió
 * algo hoy, el globo lo muestra en lugar de la pregunta.
 */
export default function TarjetaAsistente() {
  const date = useToday();
  const [nota, setNota] = useState<string | null>(null);

  const cargarNota = useCallback(async () => {
    if (!date) return;
    try {
      const res = await fetch(`/api/animo?date=${date}`);
      if (res.ok) {
        const data = (await res.json()) as { note: string | null };
        setNota(data.note);
      }
    } catch {
      // sin nota: se muestra la pregunta
    }
  }, [date]);

  useEffect(() => {
    // La carga es asíncrona: el estado se actualiza después del await, no
    // de forma síncrona dentro del efecto, así que no encadena renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarNota();
  }, [cargarNota]);

  return (
    <>
      <div className="flex items-end gap-2 mt-4">
        <p
          className="flex-1 min-w-0 self-center"
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "var(--r-xl)",
            padding: "0.9rem 1rem",
            fontSize: "var(--t-base)",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {nota ? `Hoy me contó: “${nota}”` : "¿Me cuenta cómo está hoy?"}
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
        <img
          src={asistente.imagen}
          alt="Panela"
          style={{ height: rem(128), width: "auto", display: "block", flexShrink: 0 }}
        />
      </div>

      <Link
        href="/animo"
        className="btn-cta pressable w-full mt-4"
        style={{ backgroundColor: "var(--ink)", fontSize: "var(--t-base)" }}
        aria-label="Contarle a Panela cómo se encuentra hoy"
      >
        {nota ? "Cambiar lo que conté" : "Contarle cómo estoy"}
      </Link>
    </>
  );
}
