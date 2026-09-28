"use client";

import { useCallback, useRef, useState } from "react";

/**
 * La Web Speech API no trae tipos completos en lib.dom, así que se declara
 * aquí lo mínimo que se usa (el constructor vive en `window`, con prefijo
 * `webkit` en Chrome/Edge).
 */
interface EventoResultadoVoz extends Event {
  results: SpeechRecognitionResultList;
}

interface ReconocimientoVoz extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((ev: EventoResultadoVoz) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
}

type ConstructorReconocimiento = new () => ReconocimientoVoz;

function obtenerConstructor(): ConstructorReconocimiento | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructorReconocimiento;
    webkitSpeechRecognition?: ConstructorReconocimiento;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function reconocimientoDisponible(): boolean {
  return obtenerConstructor() !== null;
}

/**
 * Escucha lo que dice la persona y devuelve el texto reconocido, con la Web
 * Speech API del navegador (gratis). En navegadores sin soporte (Safari/iOS)
 * `disponible` queda en false y quien use el hook debe ofrecer texto normal
 * en su lugar.
 */
export function useReconocimientoVoz() {
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<ReconocimientoVoz | null>(null);

  const iniciar = useCallback((alTerminar: (texto: string) => void) => {
    const Constructor = obtenerConstructor();
    if (!Constructor) {
      setError("Este navegador no permite escuchar por voz.");
      return;
    }
    setError(null);
    const rec = new Constructor();
    rec.lang = "es-ES";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (ev) => {
      const ultimo = ev.results[ev.results.length - 1];
      const texto = ultimo?.[0]?.transcript ?? "";
      if (texto.trim()) alTerminar(texto.trim());
    };
    rec.onerror = () => {
      setError("No te escuché bien. Intenta de nuevo.");
      setEscuchando(false);
    };
    rec.onend = () => setEscuchando(false);

    recRef.current = rec;
    setEscuchando(true);
    rec.start();
  }, []);

  const detener = useCallback(() => {
    recRef.current?.stop();
  }, []);

  return { escuchando, error, iniciar, detener, disponible: reconocimientoDisponible() };
}
