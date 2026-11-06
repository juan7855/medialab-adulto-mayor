"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FIGURAS } from "../contenido";
import { COMPONENTES_FIGURA } from "./Figuras";

type Fase = "mirar" | "dibujar" | "comparar" | "fin";

export default function JuegoDibujo() {
  const [indiceFigura, setIndiceFigura] = useState(0);
  const figura = FIGURAS[indiceFigura] ?? FIGURAS[0];
  const FiguraComp = COMPONENTES_FIGURA[indiceFigura] ?? COMPONENTES_FIGURA[0];

  const [fase, setFase] = useState<Fase>("mirar");
  const [segundos, setSegundos] = useState(figura.segundos);

  // Countdown
  useEffect(() => {
    if (fase !== "mirar") return;
    if (segundos <= 0) {
      setFase("dibujar");
      return;
    }
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [fase, segundos]);

  // ---- Canvas para dibujar ----
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dibujando = useRef(false);
  const ultimoPunto = useRef<{ x: number; y: number } | null>(null);

  const obtenerXY = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if ("touches" in e) {
        const t = e.touches[0];
        if (!t) return null;
        return {
          x: (t.clientX - rect.left) * scaleX,
          y: (t.clientY - rect.top) * scaleY,
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const empezarTrazo = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      dibujando.current = true;
      ultimoPunto.current = obtenerXY(e);
    },
    [obtenerXY],
  );

  const moverTrazo = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!dibujando.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const punto = obtenerXY(e);
      if (!punto || !ultimoPunto.current) return;
      ctx.strokeStyle = "#E09339";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(ultimoPunto.current.x, ultimoPunto.current.y);
      ctx.lineTo(punto.x, punto.y);
      ctx.stroke();
      ultimoPunto.current = punto;
    },
    [obtenerXY],
  );

  const pararTrazo = useCallback(() => {
    dibujando.current = false;
    ultimoPunto.current = null;
  }, []);

  const borrarCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const otraFigura = () => {
    const sig = indiceFigura + 1;
    if (sig >= FIGURAS.length) {
      setFase("fin");
      return;
    }
    setIndiceFigura(sig);
    setSegundos(FIGURAS[sig].segundos);
    setFase("mirar");
  };

  // ---- Mirar la figura ----
  if (fase === "mirar") {
    const progreso = segundos / figura.segundos;
    return (
      <div className="flex flex-col gap-4">
        <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
          Mire bien esta figura
        </h2>

        <div
          className="flex items-center justify-center"
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            aspectRatio: "1",
            padding: "1.5rem",
          }}
        >
          <FiguraComp />
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
            Dígala en palabras: {figura.descripcion.toLowerCase()}.
          </p>
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          onClick={() => setFase("dibujar")}
        >
          Ya la tengo
        </button>
      </div>
    );
  }

  // ---- Dibujar ----
  if (fase === "dibujar") {
    return (
      <div className="flex flex-col gap-4">
        <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
          Ahora dibújela con el dedo
        </h2>

        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            aspectRatio: "1",
            overflow: "hidden",
            touchAction: "none",
          }}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ width: "100%", height: "100%", display: "block" }}
            onMouseDown={empezarTrazo}
            onMouseMove={moverTrazo}
            onMouseUp={pararTrazo}
            onMouseLeave={pararTrazo}
            onTouchStart={empezarTrazo}
            onTouchMove={moverTrazo}
            onTouchEnd={pararTrazo}
            onTouchCancel={pararTrazo}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn-soft pressable flex-1"
            style={{ minHeight: "3.4rem", fontSize: "var(--t-base)" }}
            onClick={borrarCanvas}
          >
            Borrar
          </button>
          <button
            type="button"
            className="btn-cta pressable flex-[2]"
            style={{ minHeight: "3.4rem", fontSize: "var(--t-base)" }}
            onClick={() => setFase("comparar")}
          >
            Listo
          </button>
        </div>
      </div>
    );
  }

  // ---- Comparar ----
  if (fase === "comparar") {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>Así quedó</h2>

        <div
          style={{
            position: "relative",
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            aspectRatio: "1",
            padding: "1.5rem",
            overflow: "hidden",
          }}
        >
          {/* Dibujo del usuario (canvas como imagen) */}
          {canvasRef.current && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={canvasRef.current.toDataURL()}
              alt="Su dibujo"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
          {/* Figura original como trazo punteado verde */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <FiguraComp estilo="trazo" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <span className="flex items-center gap-2" style={{ fontSize: "var(--t-sm)" }}>
            <span
              style={{
                width: 20,
                height: 4,
                borderRadius: 2,
                backgroundColor: "var(--green-solid)",
              }}
            />
            La figura
          </span>
          <span className="flex items-center gap-2" style={{ fontSize: "var(--t-sm)" }}>
            <span
              style={{
                width: 20,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E09339",
              }}
            />
            Su dibujo
          </span>
        </div>

        <button
          type="button"
          className="btn-cta pressable w-full"
          style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
          onClick={otraFigura}
        >
          {indiceFigura < FIGURAS.length - 1 ? "Otra figura" : "Terminé"}
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
          ¡Buen trabajo!
        </p>
        <p
          className="mt-1"
          style={{ fontSize: "var(--t-sm)", color: "var(--ink-soft)" }}
        >
          Dibujó las {FIGURAS.length} figuras. Eso ejercita la memoria visual.
        </p>
      </div>
      <Link
        href="/cognitivo"
        className="btn-soft pressable w-full text-center"
        style={{ minHeight: "3.6rem", fontSize: "var(--t-base)" }}
      >
        Volver a Mente activa
      </Link>
    </div>
  );
}
