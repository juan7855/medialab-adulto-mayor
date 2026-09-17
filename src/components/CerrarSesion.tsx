"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/**
 * Salir de la cuenta. Discreto a propósito: en el uso real, el mismo
 * teléfono es siempre de la misma persona durante meses, así que esto no es
 * una acción del día a día — sirve para cuando el teléfono cambia de dueño,
 * o para probar con más de un paciente durante el desarrollo.
 */
export default function CerrarSesion() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    setSaliendo(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
    }
  };

  return (
    <button
      onClick={() => void salir()}
      disabled={saliendo}
      className="flex items-center gap-1.5 mx-auto"
      style={{
        background: "none",
        border: "none",
        color: "var(--ink-mute)",
        fontSize: "var(--t-xs)",
        fontWeight: 600,
        opacity: saliendo ? 0.6 : 1,
      }}
      aria-label="Cerrar sesión y volver a la pantalla de la clave"
    >
      <LogOut size={16} strokeWidth={2.2} aria-hidden="true" />
      Cerrar sesión
    </button>
  );
}
