"use client";

import { useIsClient } from "@/lib/today";

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
 * Saludo y fecha. Se resuelve en el navegador: la página es estática, así que
 * calcularlo en el servidor lo dejaría congelado en la fecha del build.
 */
export default function Greeting() {
  const isClient = useIsClient();
  const now = isClient ? new Date() : null;

  return (
    <div className="px-1">
      {/* El espacio duro reserva la altura y evita que el bloque salte al hidratar */}
      <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 800, lineHeight: 1.08 }}>
        {now ? greetingFor(now.getHours()) : " "}
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
