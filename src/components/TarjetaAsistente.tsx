"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { rem } from "@/lib/scale";
import { ASISTENTE as asistente } from "@/lib/asistentes";
import { useToday } from "@/lib/today";

/**
 * Panela, acompañando en el inicio, con lo que la persona
 * escribió hoy sobre cómo se encuentra.
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
      // sin nota: la tarjeta se muestra igual
    }
  }, [date]);

  useEffect(() => {
    // La carga es asíncrona: el estado se actualiza después del await, no
    // de forma síncrona dentro del efecto, así que no encadena renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargarNota();
  }, [cargarNota]);

  return (
    <div
      className="card flex items-stretch gap-3.5 p-3.5"
      style={{ backgroundColor: asistente.tinte, borderColor: asistente.borde }}
    >
      <span
        className="flex items-end justify-center"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid ${asistente.borde}`,
          borderRadius: "var(--r-md)",
          overflow: "hidden",
          height: rem(104),
          width: rem(88),
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
        <img
          src={asistente.imagen}
          alt=""
          style={{ height: rem(96), width: "auto", display: "block" }}
        />
      </span>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 800 }}>
          Hoy te acompaña {asistente.nombre}
        </p>

        {nota ? (
          <p
            className="mt-1"
            style={{
              fontSize: "var(--t-xs)",
              fontWeight: 500,
              color: "var(--ink-soft)",
              lineHeight: 1.4,
            }}
          >
            Escribiste: “{nota}”
          </p>
        ) : (
          <Link
            href="/animo"
            className="chip-btn mt-2"
            style={{ alignSelf: "flex-start" }}
            aria-label="Contar cómo te encuentras hoy"
          >
            <Pencil size={17} strokeWidth={2.2} aria-hidden="true" />
            Cuéntame cómo estás
          </Link>
        )}
      </div>
    </div>
  );
}
