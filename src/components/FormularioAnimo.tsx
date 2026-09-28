"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mic, Square } from "lucide-react";
import { rem } from "@/lib/scale";
import { todayISO } from "@/lib/today";
import { asistentePorId } from "@/lib/asistentes";
import { leerAsistente } from "@/lib/sesion";
import { hablar } from "@/lib/voz";
import { useReconocimientoVoz } from "@/lib/reconocimiento";
import { responderA } from "@/lib/conversacion";

const LARGO_MAXIMO = 500;

export default function FormularioAnimo() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const yaHablo = useRef(false);
  const { escuchando, error: errorVoz, iniciar, detener, disponible: vozDisponible } = useReconocimientoVoz();

  useEffect(() => {
    if (yaHablo.current) return;
    yaHablo.current = true;
    const asistente = asistentePorId(leerAsistente());
    hablar("¿Cómo te encuentras hoy?", asistente?.voz);
  }, []);

  const escucharYResponder = () => {
    setRespuesta(null);
    iniciar((dicho) => {
      setTexto((prev) => (prev ? `${prev} ${dicho}` : dicho));
      const asistente = asistentePorId(leerAsistente());
      const reply = responderA(dicho);
      setRespuesta(reply);
      hablar(reply, asistente?.voz);
    });
  };

  const terminar = async () => {
    setGuardando(true);
    setError(null);

    try {
      const res = await fetch("/api/animo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayISO(), note: texto }),
      });
      if (!res.ok) throw new Error("respuesta no válida");
      router.push("/inicio");
    } catch {
      // No se pierde lo escrito: se avisa y se deja reintentar.
      setError("No se pudo guardar. Revisa la conexión e intenta de nuevo.");
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="animo" className="sr-only">
        Cuenta cómo te encuentras hoy
      </label>
      <textarea
        id="animo"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO}
        rows={5}
        placeholder="Hoy me siento..."
        autoFocus
        className="card"
        style={{
          padding: "1rem",
          fontSize: "var(--t-md)",
          fontWeight: 500,
          lineHeight: 1.45,
          fontFamily: "inherit",
          color: "var(--ink)",
          resize: "none",
          minHeight: rem(180),
        }}
      />

      {vozDisponible && (
        <button
          type="button"
          onClick={escuchando ? detener : escucharYResponder}
          className="chip-btn mt-2"
          style={{ alignSelf: "flex-start" }}
          aria-label={escuchando ? "Dejar de escuchar" : "Contar cómo te sientes hablando"}
        >
          {escuchando ? (
            <Square size={17} strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <Mic size={17} strokeWidth={2.2} aria-hidden="true" />
          )}
          {escuchando ? "Escuchando..." : "Hablar en vez de escribir"}
        </button>
      )}

      {respuesta && (
        <p className="mt-2 px-1" style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
          {respuesta}
        </p>
      )}

      <p
        className="mt-2 px-1"
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 600,
          color: error || errorVoz ? "var(--red-solid)" : "var(--ink-mute)",
          minHeight: "2.6rem",
        }}
        role={error || errorVoz ? "alert" : undefined}
      >
        {error ?? errorVoz ?? "Escribe lo que quieras. Nadie te corrige."}
      </p>

      <button
        onClick={() => void terminar()}
        disabled={guardando}
        className="btn-cta pressable w-full mt-2"
        style={{ minHeight: rem(84), fontSize: "var(--t-lg)", opacity: guardando ? 0.6 : 1 }}
      >
        <Check size={30} strokeWidth={2.8} aria-hidden="true" />
        {guardando ? "Guardando..." : "Listo"}
      </button>
    </div>
  );
}
