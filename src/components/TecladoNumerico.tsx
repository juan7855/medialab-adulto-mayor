"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete } from "lucide-react";
import { rem } from "@/lib/scale";
import { CLAVE_DEMO, abrirSesion } from "@/lib/sesion";

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function TecladoNumerico() {
  const router = useRouter();
  const [digitos, setDigitos] = useState("");
  const [error, setError] = useState(false);

  const pulsar = (tecla: string) => {
    if (digitos.length >= 4) return;
    const siguiente = digitos + tecla;
    setError(false);
    setDigitos(siguiente);

    if (siguiente.length < 4) return;

    if (siguiente === CLAVE_DEMO) {
      abrirSesion();
      router.push("/asistente");
    } else {
      // Se deja ver el cuarto punto un instante antes de avisar del fallo.
      setTimeout(() => {
        setError(true);
        setDigitos("");
      }, 220);
    }
  };

  const borrar = () => {
    setError(false);
    setDigitos((d) => d.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Puntos de progreso */}
      <div
        className="flex gap-3.5"
        role="status"
        aria-live="polite"
        aria-label={`${digitos.length} de 4 números escritos`}
      >
        {[0, 1, 2, 3].map((i) => {
          const lleno = i < digitos.length;
          return (
            <span
              key={i}
              style={{
                width: rem(22),
                height: rem(22),
                borderRadius: "999px",
                backgroundColor: lleno ? "var(--cta)" : "transparent",
                border: `2px solid ${error ? "var(--red-solid)" : lleno ? "var(--cta)" : "var(--line-strong)"}`,
                transition: "background-color 0.15s ease, border-color 0.15s ease",
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <p
        className="text-center mt-3"
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 700,
          minHeight: "1.6rem",
          color: error ? "var(--red-solid)" : "var(--ink-mute)",
        }}
        role={error ? "alert" : undefined}
      >
        {error ? "Clave incorrecta. Intenta de nuevo." : " "}
      </p>

      {/* Teclado */}
      <div className="grid grid-cols-3 gap-3 w-full mt-2">
        {TECLAS.map((tecla) => (
          <button
            key={tecla}
            onClick={() => pulsar(tecla)}
            className="card pressable"
            style={{
              minHeight: rem(76),
              fontSize: "var(--t-xl)",
              fontWeight: 800,
              color: "var(--ink)",
            }}
            aria-label={`Número ${tecla}`}
          >
            {tecla}
          </button>
        ))}

        <span aria-hidden="true" />

        <button
          onClick={() => pulsar("0")}
          className="card pressable"
          style={{
            minHeight: rem(76),
            fontSize: "var(--t-xl)",
            fontWeight: 800,
            color: "var(--ink)",
          }}
          aria-label="Número 0"
        >
          0
        </button>

        <button
          onClick={borrar}
          disabled={digitos.length === 0}
          className="pressable flex items-center justify-center"
          style={{
            minHeight: rem(76),
            borderRadius: "var(--r-lg)",
            backgroundColor: "var(--surface-soft)",
            border: "1px solid var(--line-strong)",
            color: "var(--ink-soft)",
            opacity: digitos.length === 0 ? 0.4 : 1,
          }}
          aria-label="Borrar el último número"
        >
          <Delete size={28} strokeWidth={2.1} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
