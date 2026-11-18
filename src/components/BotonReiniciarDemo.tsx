"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";

/**
 * Botón pequeño y discreto en el pie de la pantalla de la clave, para que
 * el facilitador reinicie la demo entre un tester y el próximo. No se
 * esconde a propósito: cuando un tester lo ve, se le explica que fue algo
 * diseñado para las pruebas de usuario. Lo que hace es llamar a
 * /api/admin/reiniciar-demo con el perfil elegido (ver route.ts).
 *
 * Flujo: estado cerrado -> primer toque abre las opciones (Álvaro, Marta,
 * Ambos) -> segundo toque confirma -> muestra un check breve y vuelve a
 * cerrarse solo. Así no hay un alert() bloqueante ni un modal pesado para
 * una acción que se usa muchas veces en una tarde de pruebas.
 */
export default function BotonReiniciarDemo() {
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState<"alvaro" | "marta" | "ambos" | null>(null);
  const [listo, setListo] = useState<string | null>(null);

  const reiniciar = async (perfil: "alvaro" | "marta" | "ambos") => {
    setEnviando(perfil);
    setListo(null);
    try {
      const res = await fetch("/api/admin/reiniciar-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfil }),
      });
      if (!res.ok) throw new Error("fallo");
      const etiqueta = perfil === "alvaro" ? "Álvaro" : perfil === "marta" ? "Marta" : "ambos";
      setListo(etiqueta);
      setTimeout(() => {
        setListo(null);
        setAbierto(false);
      }, 1800);
    } catch {
      setListo("Error");
      setTimeout(() => setListo(null), 2500);
    } finally {
      setEnviando(null);
    }
  };

  if (listo) {
    return (
      <div
        className="mt-3 flex items-center justify-center gap-1.5"
        role="status"
        style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--green-deep)" }}
      >
        <Check size={14} strokeWidth={2.4} aria-hidden="true" />
        Demo reiniciada ({listo})
      </div>
    );
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="mt-3 inline-flex items-center justify-center gap-1.5 mx-auto"
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 600,
          color: "var(--ink-mute)",
          background: "transparent",
          border: 0,
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
        }}
      >
        <RotateCcw size={13} strokeWidth={2.2} aria-hidden="true" />
        Reiniciar demo
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
      <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
        Reiniciar:
      </span>
      {(["alvaro", "marta", "ambos"] as const).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => reiniciar(p)}
          disabled={enviando !== null}
          className="pressable"
          style={{
            fontSize: "var(--t-xs)",
            fontWeight: 700,
            padding: "0.28rem 0.7rem",
            borderRadius: "999px",
            border: "1px solid var(--line)",
            background: enviando === p ? "var(--surface-soft)" : "var(--surface)",
            color: "var(--ink)",
            opacity: enviando !== null && enviando !== p ? 0.5 : 1,
            cursor: enviando ? "wait" : "pointer",
          }}
        >
          {p === "alvaro" ? "Álvaro" : p === "marta" ? "Marta" : "Ambos"}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setAbierto(false)}
        disabled={enviando !== null}
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 500,
          color: "var(--ink-mute)",
          background: "transparent",
          border: 0,
          padding: "0.3rem 0.4rem",
          cursor: "pointer",
        }}
      >
        Cancelar
      </button>
    </div>
  );
}
