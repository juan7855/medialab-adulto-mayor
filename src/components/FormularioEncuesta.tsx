"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PREGUNTAS, type ClavePregunta } from "@/lib/encuesta";
import { ASISTENTE } from "@/lib/asistentes";
import { rem } from "@/lib/scale";

/**
 * Encuesta de bienestar, una pregunta por pantalla (Figma A04/A05): barra de
 * progreso, Panela hace la pregunta y la persona toca un número. Al tocarlo
 * pasa sola a la siguiente; con la última se envía. Así no hay que bajar por
 * una página larga ni buscar el botón de enviar al final.
 */
export default function FormularioEncuesta() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [puntajes, setPuntajes] = useState<Partial<Record<ClavePregunta, number>>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita dos envíos si la última respuesta se toca dos veces seguidas.
  const enviandoRef = useRef(false);

  const pregunta = PREGUNTAS[paso];
  const total = PREGUNTAS.length;
  const valor = puntajes[pregunta.clave] ?? null;

  const enviar = async (finales: Partial<Record<ClavePregunta, number>>) => {
    if (enviandoRef.current) return;
    enviandoRef.current = true;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/encuesta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores: finales }),
      });
      if (!res.ok) throw new Error();
      router.push("/conversemos");
    } catch {
      setError("No se pudo guardar. Toque su respuesta otra vez para intentarlo de nuevo.");
      enviandoRef.current = false;
      setEnviando(false);
    }
  };

  const elegir = (n: number) => {
    if (enviando) return;
    const nuevos = { ...puntajes, [pregunta.clave]: n };
    setPuntajes(nuevos);
    // Una pausa corta para que la persona vea su respuesta marcada.
    window.setTimeout(() => {
      if (paso < total - 1) setPaso(paso + 1);
      else if (PREGUNTAS.every((p) => nuevos[p.clave] !== undefined)) void enviar(nuevos);
    }, 350);
  };

  return (
    <div className="flex flex-col">
      {/* Progreso: un segmento por pregunta */}
      <div
        className="flex gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={paso + 1}
        aria-label={`Pregunta ${paso + 1} de ${total}`}
      >
        {PREGUNTAS.map((p, i) => (
          <span
            key={p.clave}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              backgroundColor: i <= paso ? "var(--green-solid)" : "var(--surface-soft)",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
      <p className="mt-2.5" style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
        Pregunta {paso + 1} de {total}
      </p>

      {/* Panela pregunta */}
      <div className="flex items-center gap-3 mt-5" key={pregunta.clave}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
        <img
          src={ASISTENTE.imagen}
          alt=""
          aria-hidden="true"
          style={{ height: rem(120), width: "auto", flexShrink: 0 }}
        />
        <p
          id="texto-pregunta"
          className="flex-1 min-w-0 animate-fade-in"
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            padding: "1rem 1.1rem",
            fontSize: "var(--t-md)",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {pregunta.texto}
        </p>
      </div>

      {/* Escala 0–10 en botones grandes */}
      <fieldset className="m-0 p-0 mt-6" style={{ border: 0, minWidth: 0 }}>
        <legend className="sr-only">{pregunta.texto}</legend>
        <div className="grid grid-cols-4 gap-2.5">
          {Array.from({ length: 11 }, (_, n) => {
            const activo = valor === n;
            return (
              <label
                key={n}
                className="flex items-center justify-center pressable"
                style={{
                  minHeight: "3.4rem",
                  borderRadius: "var(--r-lg)",
                  fontSize: "var(--t-md)",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor: activo ? "var(--green-solid)" : "var(--surface)",
                  color: activo ? "#fff" : "var(--ink)",
                  border: `var(--border-w) solid ${activo ? "var(--green-solid)" : "var(--line)"}`,
                }}
              >
                <input
                  type="radio"
                  name={pregunta.clave}
                  value={n}
                  checked={activo}
                  onChange={() => elegir(n)}
                  className="sr-only"
                />
                {n}
              </label>
            );
          })}
        </div>
        <div
          className="flex justify-between mt-3"
          style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}
          aria-hidden="true"
        >
          <span>0 = nada</span>
          <span>10 = completamente</span>
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="mt-4"
          style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--red-solid)" }}
        >
          {error}
        </p>
      )}

      <p
        className="text-center mt-5"
        style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}
        aria-live="polite"
      >
        {enviando ? "Guardando…" : "Toque un número. Se guarda solo."}
      </p>

      {paso > 0 && !enviando && (
        <button
          type="button"
          onClick={() => setPaso(paso - 1)}
          className="chip-btn self-start mt-4"
          style={{ minHeight: "var(--touch)", paddingLeft: "0.5rem", paddingRight: "0.95rem" }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} aria-hidden="true" />
          Pregunta anterior
        </button>
      )}
    </div>
  );
}
