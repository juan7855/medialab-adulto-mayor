"use client";

import { useEffect } from "react";
import { useIsClient } from "@/lib/today";
import { hablar } from "@/lib/voz";

// A nivel de módulo: sobrevive a la navegación interna (el componente se
// vuelve a montar al regresar al inicio) y se reinicia al abrir la app.
let saludoDicho = false;

function greetingFor(hour: number): string {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

/**
 * Saludo. La hora se resuelve en el navegador: la página es estática, así
 * que calcularla en el servidor la dejaría congelada en la fecha del build.
 * El nombre, en cambio, ya viene resuelto del servidor (a partir de la
 * sesión), así que se pinta siempre, sin esperar a hidratar.
 */
export default function Greeting({ name }: { name: string }) {
  const isClient = useIsClient();
  const now = isClient ? new Date() : null;

  useEffect(() => {
    if (!isClient || !name || saludoDicho) return;
    saludoDicho = true;
    hablar(`${greetingFor(new Date().getHours())}, ${name}. ¿Cómo ha estado?`);
  }, [isClient, name]);

  return (
    <h1 style={{ lineHeight: 1.1 }}>
      {/* El espacio duro reserva la altura y evita que el bloque salte al hidratar */}
      <span
        className="block"
        style={{ fontSize: "var(--t-md)", fontWeight: 600, color: "var(--ink-soft)" }}
      >
        {now ? `${greetingFor(now.getHours())},` : " "}
      </span>
      <span className="block mt-1" style={{ fontSize: "var(--t-2xl)", fontWeight: 800 }}>
        {name || " "}
      </span>
    </h1>
  );
}
