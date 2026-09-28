"use client";

import { useEffect, useState } from "react";

/**
 * Formatea una fecha en la hora local de quien mira la pantalla. Empieza
 * vacío y se llena después de montar (igual razón que useToday en
 * src/lib/today.ts): formatear en el servidor congelaría la hora en el huso
 * horario del servidor, no el de la persona.
 */
export default function Fecha({ iso }: { iso: string | Date | null }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (!iso) return;
    const d = new Date(iso);
    // Un solo salto de "" al texto formateado al montar en el cliente: es
    // justo lo que evita el desfase de huso horario servidor/navegador.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTexto(
      d.toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    );
  }, [iso]);

  return <span suppressHydrationWarning>{texto}</span>;
}
