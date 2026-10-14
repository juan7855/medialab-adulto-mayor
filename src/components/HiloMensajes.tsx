"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Fecha from "./Fecha";
import BotonBloquear from "./BotonBloquear";

const LARGO_MAXIMO = 500;
const INTERVALO_REFRESCO_MS = 6000;

interface Mensaje {
  id: number;
  conversationId: number;
  senderPatientId: number;
  content: string;
  createdAt: string;
  readAt: string | null;
}

interface HiloMensajesProps {
  conversationId: number;
  miId: number;
  otroId: number;
  otroNombre: string;
}

/** El hilo de un DM. Se refresca sola cada pocos segundos mientras la
 *  pantalla está abierta — no hay websockets en ningún otro lado de la app,
 *  así que un polling simple es proporcional acá también. */
export default function HiloMensajes({ conversationId, miId, otroId, otroNombre }: HiloMensajesProps) {
  const [mensajes, setMensajes] = useState<Mensaje[] | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`/api/comunidad/conversaciones/${conversationId}/mensajes`);
      if (!res.ok) return;
      setMensajes(await res.json());
    } catch {
      // El próximo refresco lo intenta de nuevo; no hace falta mostrar error acá.
    }
  }, [conversationId]);

  useEffect(() => {
    // cargar() actualiza el estado después de su propio await, no de forma
    // síncrona dentro del efecto, así que no encadena renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargar();
    const id = setInterval(() => void cargar(), INTERVALO_REFRESCO_MS);
    return () => clearInterval(id);
  }, [cargar]);

  const enviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`/api/comunidad/conversaciones/${conversationId}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: texto }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "error");
      }
      setTexto("");
      await cargar();
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "No se pudo enviar. Intente de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="px-4 pt-2 pb-1 flex justify-end">
        <BotonBloquear patientId={otroId} name={otroNombre} />
      </div>

      <main className="flex-1 px-4 pt-2" role="main">
        {mensajes === null ? null : mensajes.length === 0 ? (
          <p
            className="text-center mt-8"
            style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
          >
            Escríbele algo a {otroNombre}.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {mensajes.map((m) => {
              const esMio = m.senderPatientId === miId;
              return (
                <li key={m.id} className="flex" style={{ justifyContent: esMio ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "80%",
                      backgroundColor: esMio ? "var(--blue-tint)" : "var(--surface)",
                      border: `1px solid ${esMio ? "var(--blue-line)" : "var(--line)"}`,
                      borderRadius: "var(--r-lg)",
                      padding: "0.6rem 0.85rem",
                    }}
                  >
                    <p style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}>{m.content}</p>
                    <span
                      className="block mt-0.5 text-right"
                      style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}
                    >
                      <Fecha iso={m.createdAt} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <div className="sticky bottom-0 px-4 pt-2 pb-4" style={{ backgroundColor: "var(--bg)" }}>
        {error && (
          <p role="alert" className="mb-1.5" style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--red-solid)" }}>
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <label htmlFor="mensaje" className="sr-only">
            Escriba un mensaje
          </label>
          <textarea
            id="mensaje"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={LARGO_MAXIMO}
            rows={1}
            placeholder="Escriba un mensaje..."
            className="card flex-1"
            style={{
              padding: "0.7rem 0.9rem",
              fontSize: "var(--t-sm)",
              fontWeight: 500,
              fontFamily: "inherit",
              color: "var(--ink)",
              resize: "none",
            }}
          />
          <button
            onClick={() => void enviar()}
            disabled={enviando || texto.trim().length === 0}
            className="btn-cta pressable"
            style={{ minHeight: "3.2rem", minWidth: "3.2rem", padding: 0, opacity: enviando ? 0.6 : 1 }}
            aria-label="Enviar mensaje"
          >
            <Send size={20} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
