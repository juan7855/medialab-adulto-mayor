"use client";

import { useEffect, useRef } from "react";
import { useIsClient } from "@/lib/today";
import { hablar } from "@/lib/voz";

function greetingFor(hour: number): string {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function formatToday(date: Date): string {
  const text = date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Saludo y fecha. La hora se resuelve en el navegador: la página es
 * estática, así que calcularla en el servidor la dejaría congelada en la
 * fecha del build. El nombre, en cambio, ya viene resuelto del servidor (a
 * partir de la sesión), así que se pinta siempre, sin esperar a hidratar.
 */
export default function Greeting({ name }: { name: string }) {
  const isClient = useIsClient();
  const now = isClient ? new Date() : null;
  const yaHablo = useRef(false);

  useEffect(() => {
    if (!isClient || !name || yaHablo.current) return;
    yaHablo.current = true;
    hablar(`${greetingFor(new Date().getHours())}, ${name}. ¿Cómo has estado?`);
  }, [isClient, name]);

  return (
    <div className="px-1">
      {/* El espacio duro reserva la altura y evita que el bloque salte al hidratar */}
      <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 800, lineHeight: 1.08 }}>
        {now ? greetingFor(now.getHours()) : " "}
        {name && `, ${name}`}
      </h1>
      <p
        className="mt-2"
        style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--ink-mute)" }}
      >
        {now ? formatToday(now) : " "}
      </p>
    </div>
  );
}
