"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { rem } from "@/lib/scale";
import { todayISO } from "@/lib/today";

const LARGO_MAXIMO = 500;

export default function FormularioAnimo() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        {error ?? "Escribe lo que quieras. Nadie te corrige."}
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
