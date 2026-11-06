"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FOTOS, type Foto } from "../contenido";
import { COMPONENTES_ESCENA } from "./Escenas";

type Fase = "mirar" | "pregunta" | "resultado" | "fin";

export default function JuegoFoto() {
  const [indiceFoto, setIndiceFoto] = useState(0);
  const foto: Foto = FOTOS[indiceFoto] ?? FOTOS[0];
  const EscenaComp = COMPONENTES_ESCENA[indiceFoto] ?? COMPONENTES_ESCENA[0];
  const total = foto.preguntas.length;

  const [fase, setFase] = useState<Fase>("mirar");
  const [segundos, setSegundos] = useState(foto.segundos);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);

  const pregunta = foto.preguntas[indicePregunta];

  // Countdown
  useEffect(() => {
    if (fase !== "mirar") return;
    if (segundos <= 0) {
      setFase("pregunta");
      return;
    }
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, segundos]);

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

  const otraFoto = () => {
    const sig = indiceFoto + 1;
    if (sig >= FOTOS.length) return;
    setIndiceFoto(sig);
    setSegundos(FOTOS[sig].segundos);
    setFase("mirar");
    setIndicePregunta(0);
    setElegida(null);
    setAciertos(0);
  };

  // ---- Mirar la foto ----
  if (fase === "mirar") {
    const progreso = segundos / foto.segundos;
    return (
      <div className="flex flex-col gap-4">
        <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
          Mire la foto con calma
        </h2>

        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          <EscenaComp />
        </div>

        <div className="flex items-center gap-3">
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              backgroundColor: "var(--surface-soft)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progreso * 100}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: "var(--orange-solid)",
                transition: "width 1s linear",
              }}
            />
          </div>
          <span style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)", fontWeight: 600 }}>
            {segundos === 1
              ? "Queda 1 segundo"
              : `Quedan ${segundos} segundos`}
          </span>
        </div>

        <div
          className="flex items-start gap-2.5 p-3.5"
          style={{
            backgroundColor: "var(--orange-tint)",
            borderRadius: "var(--r-lg)",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "var(--orange-solid)",
              flexShrink: 0,
              marginTop: 3,
            }}
          />
          <p style={{ fontSize: "var(--t-sm)", fontWeight: 500, color: "var(--ink-soft)" }}>
            Mírela de izquierda a derecha y nombre en su mente lo que ve.
          </p>
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          onClick={() => setFase("pregunta")}
        >
          Ya la miré
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

        <p
          className="text-center mt-5"
          style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}
        >
          Después de responder, la vuelve a ver.
        </p>
      </div>
    );
  }

  // ---- Resultado ----
  if (fase === "resultado" && elegida !== null) {
    const acerto = elegida === pregunta.correcta;
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <p style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}>
          Pregunta {indicePregunta + 1} de {total}
        </p>

        <div
          className="p-4"
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
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
          }}
        >
          <EscenaComp />
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full"
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
            ? "¡Todas correctas! Qué buena memoria."
            : aciertos >= total / 2
              ? "¡Bien hecho! Siga practicando."
              : "No se preocupe, la próxima le va mejor."}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {indiceFoto < FOTOS.length - 1 && (
          <button
            type="button"
            className="btn-cta pressable w-full"
            style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
            onClick={otraFoto}
          >
            Otra foto
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
