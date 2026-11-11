"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Un enlace `tel:` que, antes de abrir la marcación, avisa por Telegram.
 *
 * Existe porque la pantalla de Emergencia es un componente de servidor
 * estático: los botones eran `<a href="tel:...">` puros y no quedaba
 * constancia de que alguien pidió ayuda. Esto envuelve el mismo enlace, con
 * los mismos estilos, y le agrega el aviso.
 *
 * Tres detalles que importan:
 *
 * - No se espera (`await`) la respuesta ni se llama a preventDefault: el
 *   teléfono abre la marcación de inmediato, como antes. El aviso viaja en
 *   paralelo.
 * - `keepalive: true` para que la petición sobreviva si el navegador
 *   congela o descarga la página al pasar a la app de teléfono.
 * - El `.catch()` vacío es a propósito: si el aviso falla, la llamada sigue.
 *   Nunca una pantalla de emergencia debe depender de que haya red para
 *   avisar.
 */

type Props = {
  href: string;
  aviso: { tipo: "123" | "contacto"; contacto?: string; rol?: string };
  className?: string;
  style?: CSSProperties;
  "aria-label": string;
  children: ReactNode;
};

export default function LlamadaAvisada({
  href,
  aviso,
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: Props) {
  function avisar() {
    try {
      void fetch("/api/emergencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aviso),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Ni siquiera un fetch que lanza sincrónicamente debe estorbar.
    }
  }

  return (
    <a
      href={href}
      onClick={avisar}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
