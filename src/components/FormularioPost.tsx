"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { rem } from "@/lib/scale";

const LARGO_MAXIMO = 500;

export default function FormularioPost() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicar = async () => {
    setGuardando(true);
    setError(null);

    try {
      const res = await fetch("/api/comunidad/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: texto }),
      });
      if (!res.ok) throw new Error("respuesta no válida");
      router.push("/comunidad");
    } catch {
      setError("No se pudo publicar. Revisa la conexión e intenta de nuevo.");
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="post" className="sr-only">
        Qué quieres contarle a la comunidad
      </label>
      <textarea
        id="post"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO}
        rows={6}
        placeholder="¿Qué quieres contarle a la comunidad?"
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
          minHeight: rem(200),
        }}
      />

      <p
        className="mt-2 px-1"
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 600,
          color: error ? "var(--red-solid)" : "var(--ink-mute)",
          minHeight: "2.6rem",
        }}
        role={error ? "alert" : undefined}
      >
        {error ?? "Lo va a ver toda la comunidad."}
      </p>

      <button
        onClick={() => void publicar()}
        disabled={guardando || texto.trim().length === 0}
        className="btn-cta pressable w-full mt-2"
        style={{ minHeight: rem(84), fontSize: "var(--t-lg)", opacity: guardando ? 0.6 : 1 }}
      >
        <Send size={26} strokeWidth={2.4} aria-hidden="true" />
        {guardando ? "Publicando..." : "Publicar"}
      </button>
    </div>
  );
}
