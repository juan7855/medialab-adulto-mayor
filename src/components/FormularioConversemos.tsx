"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rem } from "@/lib/scale";
import { LARGO_MAXIMO_NOTA, OPCIONES_SUENO, type OpcionSueno } from "@/lib/encuesta";

const estiloPregunta = { fontSize: "var(--t-base)", fontWeight: 800, lineHeight: 1.25 } as const;

export default function FormularioConversemos() {
  const router = useRouter();
  const [nota, setNota] = useState("");
  const [sueno, setSueno] = useState<OpcionSueno | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    // Nada que guardar: se sigue sin llamar al servidor.
    if (!nota.trim() && !sueno) {
      router.push("/gracias");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/encuesta/conversemos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extraNote: nota, sleepQuality: sueno }),
      });
      if (!res.ok) throw new Error();
      router.push("/gracias");
    } catch {
      // No se pierde lo escrito: se avisa y se deja reintentar.
      setError("No se pudo guardar. Intente de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={(e) => void enviar(e)} className="flex flex-col gap-3.5" noValidate>
      <fieldset className="card p-4 m-0" style={{ minWidth: 0 }}>
        <legend className="p-0 mb-3" style={{ ...estiloPregunta, float: "left", width: "100%" }}>
          ¿Cómo durmió anoche?
        </legend>

        {/* Tocar de nuevo la opción elegida la quita: la pregunta es opcional. */}
        <div className="grid grid-cols-2 gap-2" style={{ clear: "both" }}>
          {OPCIONES_SUENO.map((opcion) => {
            const activo = sueno === opcion;
            return (
              <button
                key={opcion}
                type="button"
                onClick={() => setSueno(activo ? null : opcion)}
                aria-pressed={activo}
                className="pressable"
                style={{
                  minHeight: "3.25rem",
                  borderRadius: "var(--r-pill)",
                  fontSize: "var(--t-base)",
                  fontWeight: 800,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  backgroundColor: activo ? "var(--cta)" : "var(--surface-soft)",
                  color: activo ? "#fff" : "var(--ink)",
                  border: `1px solid ${activo ? "var(--cta)" : "var(--line-strong)"}`,
                }}
              >
                {opcion}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="card p-4 flex flex-col">
        <label htmlFor="nota" className="mb-3" style={estiloPregunta}>
          ¿Hay algo más que quiera contarme?
        </label>
        <textarea
          id="nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          maxLength={LARGO_MAXIMO_NOTA}
          rows={4}
          placeholder="Escriba aquí, si lo desea..."
          style={{
            padding: "0.85rem",
            fontSize: "var(--t-md)",
            fontWeight: 500,
            lineHeight: 1.45,
            fontFamily: "inherit",
            color: "var(--ink)",
            backgroundColor: "var(--surface-soft)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--r-md)",
            resize: "none",
            minHeight: rem(140),
          }}
        />
      </div>

      {error && (
        <p role="alert" style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--red-solid)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="btn-cta pressable w-full mt-2"
        style={{ opacity: enviando ? 0.5 : 1, fontSize: "var(--t-base)" }}
      >
        {enviando ? "Guardando…" : "Continuar"}
      </button>
    </form>
  );
}
