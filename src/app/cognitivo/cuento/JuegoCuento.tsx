"use client";

import { useState } from "react";
import Link from "next/link";
import { ASISTENTE } from "@/lib/asistentes";
import { CUENTOS, type Cuento } from "../contenido";
import { rem } from "@/lib/scale";

type Fase = "lectura" | "pregunta" | "resultado" | "fin";

export default function JuegoCuento() {
  const [indiceCuento, setIndiceCuento] = useState(0);
  const cuento: Cuento = CUENTOS[indiceCuento] ?? CUENTOS[0];
  const total = cuento.preguntas.length;

  const [fase, setFase] = useState<Fase>("lectura");
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);

  const pregunta = cuento.preguntas[indicePregunta];

  const elegir = (i: number) => {
    if (elegida !== null) return;
    setElegida(i);
    if (i === pregunta.correcta) setAciertos((a) => a + 1);
    setFase("resultado");
  };

  const siguiente = () => {
    if (indicePregunta < total - 1) {
      setIndicePregunta((p) => p + 1);
      setElegida(null);
      setFase("pregunta");
    } else {
      setFase("fin");
    }
  };

  const otroCuento = () => {
    const sig = indiceCuento + 1;
    if (sig >= CUENTOS.length) return;
    setIndiceCuento(sig);
    setFase("lectura");
    setIndicePregunta(0);
    setElegida(null);
    setAciertos(0);
  };

  // ---- Lectura del cuento ----
  if (fase === "lectura") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASISTENTE.imagen}
            alt=""
            aria-hidden="true"
            style={{ height: rem(100), width: "auto", flexShrink: 0 }}
          />
          <p
            className="flex-1 min-w-0"
            style={{
              backgroundColor: "var(--surface)",
              border: "var(--border-w) solid var(--line)",
              borderRadius: "var(--r-xl)",
              padding: "0.9rem 1rem",
              fontSize: "var(--t-md)",
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            Le voy a contar algo. Fíjese en quién, dónde y qué pasó.
          </p>
        </div>

        <div
          className="p-5"
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
          }}
        >
          <p
            style={{
              fontSize: "var(--t-md)",
              fontWeight: 500,
              lineHeight: 1.55,
            }}
          >
            {cuento.texto}
          </p>
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          onClick={() => setFase("pregunta")}
        >
          Ya lo leí
        </button>
      </div>
    );
  }

  // ---- Pregunta ----
  if (fase === "pregunta") {
    return (
      <div className="flex flex-col animate-fade-in" key={indicePregunta}>
        <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
          Pregunta {indicePregunta + 1} de {total}
        </p>

        <h2
          className="mt-3"
          style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}
        >
          {pregunta.texto}
        </h2>

        <div className="flex flex-col gap-3 mt-6">
          {pregunta.opciones.map((op, i) => (
            <button
              key={i}
              type="button"
              className="pressable"
              onClick={() => elegir(i)}
              style={{
                minHeight: "3.6rem",
                padding: "0.9rem 1.2rem",
                borderRadius: "var(--r-xl)",
                backgroundColor: "var(--surface)",
                border: "var(--border-w) solid var(--line)",
                fontSize: "var(--t-base)",
                fontWeight: 600,
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {op}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="self-center mt-5"
          style={{
            fontSize: "var(--t-sm)",
            color: "var(--green-solid)",
            fontWeight: 600,
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => setFase("lectura")}
        >
          Leer el cuento otra vez
        </button>
      </div>
    );
  }

  // ---- Resultado de la pregunta ----
  if (fase === "resultado" && elegida !== null) {
    const acerto = elegida === pregunta.correcta;
    return (
      <div className="flex flex-col animate-fade-in">
        <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
          Pregunta {indicePregunta + 1} de {total}
        </p>

        <div
          className="mt-3 p-4"
          style={{
            borderRadius: "var(--r-lg)",
            backgroundColor: acerto
              ? "var(--green-tint)"
              : "var(--red-tint)",
            fontSize: "var(--t-base)",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: acerto
                ? "var(--green-solid)"
                : "var(--red-solid)",
              marginRight: "0.5rem",
              verticalAlign: "middle",
            }}
          />
          {acerto
            ? `¡Bien! ${pregunta.opciones[pregunta.correcta]}.`
            : `Era "${pregunta.opciones[pregunta.correcta]}".`}
        </div>

        <div
          className="mt-4 p-4"
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-lg)",
          }}
        >
          <p
            style={{
              fontSize: "var(--t-xs)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
              marginBottom: "0.5rem",
            }}
          >
            Esto decía el cuento
          </p>
          <p
            style={{
              fontSize: "var(--t-sm)",
              fontWeight: 500,
              lineHeight: 1.45,
            }}
          >
            {cuento.texto.slice(0, 120)}…
          </p>
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full mt-5"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          onClick={siguiente}
        >
          {indicePregunta < total - 1 ? "Siguiente pregunta" : "Ver resultado"}
        </button>
      </div>
    );
  }

  // ---- Fin ----
  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ASISTENTE.imagen}
        alt=""
        aria-hidden="true"
        style={{ height: rem(120), width: "auto" }}
      />

      <div
        className="w-full p-5 text-center"
        style={{
          backgroundColor: "var(--green-tint)",
          borderRadius: "var(--r-xl)",
          border: "var(--border-w) solid var(--green-line)",
        }}
      >
        <p style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
          {aciertos} de {total}
        </p>
        <p
          className="mt-1"
          style={{ fontSize: "var(--t-sm)", color: "var(--ink-soft)" }}
        >
          {aciertos === total
            ? "¡Todas correctas! Muy bien."
            : aciertos >= total / 2
              ? "¡Bien hecho! Siga practicando."
              : "No se preocupe, la próxima le va mejor."}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {indiceCuento < CUENTOS.length - 1 && (
          <button
            type="button"
            className="btn-cta pressable w-full"
            style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
            onClick={otroCuento}
          >
            Otro cuento
          </button>
        )}
        <Link
          href="/cognitivo"
          className="btn-soft pressable w-full text-center"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
        >
          Volver a Mente activa
        </Link>
      </div>
    </div>
  );
}
