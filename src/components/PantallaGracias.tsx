"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { rem } from "@/lib/scale";
import { ASISTENTE } from "@/lib/asistentes";
import { hablar } from "@/lib/voz";

/**
 * Pantalla de agradecimiento tras la encuesta: Panela grande sobre manchas de
 * color suaves, un globo de diálogo y un solo botón para seguir.
 */
export default function PantallaGracias({ name }: { name: string }) {
  const yaHablo = useRef(false);
  const mensaje = name ? `¡Gracias, ${name}! Ya quedó anotado.` : "¡Gracias! Ya quedó anotado.";

  useEffect(() => {
    if (yaHablo.current) return;
    yaHablo.current = true;
    hablar(mensaje);
  }, [mensaje]);

  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      <div
        className="relative flex-1 flex items-end justify-center overflow-hidden"
        style={{ minHeight: rem(330), marginTop: "1.5rem" }}
        aria-hidden="true"
      >
        {/* Manchas de color de fondo */}
        <span
          style={{
            position: "absolute",
            left: "-14%",
            top: "8%",
            width: "70%",
            aspectRatio: "1",
            borderRadius: "999px",
            backgroundColor: "var(--cyan-tint)",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "-8%",
            bottom: "4%",
            width: "46%",
            aspectRatio: "1",
            borderRadius: "50% 50% 14% 50%",
            backgroundColor: "var(--orange-tint)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
        <img
          src={ASISTENTE.imagen}
          alt=""
          className="animate-rise"
          style={{ position: "relative", height: rem(300), width: "auto", display: "block" }}
        />
      </div>

      {/* Globo de diálogo con piquito hacia Panela */}
      <div className="relative mt-5" role="status">
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-0.45rem",
            left: "calc(50% - 0.5rem)",
            width: "1rem",
            height: "1rem",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRight: "none",
            borderBottom: "none",
            transform: "rotate(45deg)",
          }}
        />
        <p
          className="card"
          style={{
            padding: "1.1rem 1.25rem",
            borderRadius: "var(--r-xl)",
            fontSize: "var(--t-md)",
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          {mensaje}
        </p>
      </div>

      <Link href="/animo" className="btn-cta pressable w-full mt-8" style={{ fontSize: "var(--t-base)" }}>
        Continuar
      </Link>
    </main>
  );
}
