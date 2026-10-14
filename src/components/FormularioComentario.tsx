"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const LARGO_MAXIMO = 500;

export default function FormularioComentario({ postId }: { postId: number }) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`/api/comunidad/posts/${postId}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: texto }),
      });
      if (!res.ok) throw new Error("respuesta no válida");
      setTexto("");
      router.refresh();
    } catch {
      setError("No se pudo enviar. Intente de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <label htmlFor="comentario" className="sr-only">
        Escriba un comentario
      </label>
      <textarea
        id="comentario"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        maxLength={LARGO_MAXIMO}
        rows={2}
        placeholder="Escriba un comentario..."
        className="card"
        style={{
          padding: "0.75rem",
          fontSize: "var(--t-sm)",
          fontWeight: 500,
          lineHeight: 1.4,
          fontFamily: "inherit",
          color: "var(--ink)",
          resize: "none",
        }}
      />
      {error && (
        <p role="alert" style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--red-solid)" }}>
          {error}
        </p>
      )}
      <button
        onClick={() => void enviar()}
        disabled={enviando || texto.trim().length === 0}
        className="btn-cta pressable"
        style={{
          alignSelf: "flex-end",
          minHeight: "2.8rem",
          paddingLeft: "1.2rem",
          paddingRight: "1.2rem",
          opacity: enviando ? 0.6 : 1,
        }}
      >
        <Send size={18} strokeWidth={2.3} aria-hidden="true" />
        {enviando ? "Enviando..." : "Comentar"}
      </button>
    </div>
  );
}
