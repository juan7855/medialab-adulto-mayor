"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { EMERGENCIA } from "@/lib/theme";

/**
 * Botón de emergencia que acompaña a la persona por toda la app: fijo en la
 * esquina inferior derecha, siempre al alcance del pulgar. Rojo con un aro
 * blanco y sombra para que se distinga sobre cualquier fondo, pero compacto
 * para no tapar el contenido. Al final de cada página se deja un espacio de
 * su alto, así nunca queda encima del último botón.
 *
 * No aparece en la pantalla de la clave (todavía no hay sesión y la página de
 * emergencia la exige) ni en la propia pantalla de emergencia.
 */
export default function EmergenciaFlotante() {
  const ruta = usePathname();

  // Con el teclado abierto (p. ej. escribiendo un DM) "position: fixed" se
  // vuelve errático en los navegadores móviles —y más todavía dentro del
  // navegador embebido de apps como WhatsApp—: el botón puede terminar
  // flotando encima de la caja de texto en vez de debajo del teclado. Medir
  // el viewport para adivinar si el teclado está abierto no es confiable ahí
  // (el resize no siempre llega), así que en cambio se sigue el foco: si hay
  // un campo de texto siendo editado, se oculta el botón.
  const [escribiendo, setEscribiendo] = useState(false);
  useEffect(() => {
    const esCampoDeTexto = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.tagName === "TEXTAREA" || el.tagName === "INPUT");
    const alEnfocar = (e: FocusEvent) => esCampoDeTexto(e.target) && setEscribiendo(true);
    const alDesenfocar = (e: FocusEvent) => esCampoDeTexto(e.target) && setEscribiendo(false);
    document.addEventListener("focusin", alEnfocar);
    document.addEventListener("focusout", alDesenfocar);
    return () => {
      document.removeEventListener("focusin", alEnfocar);
      document.removeEventListener("focusout", alDesenfocar);
    };
  }, []);

  const enChat = /^\/comunidad\/mensajes\/\d+/.test(ruta);
  if (ruta === "/" || ruta.startsWith("/emergencia") || escribiendo) return null;

  // En un hilo de DM hay una barra de texto fija abajo (~5 rem de alto);
  // el botón sube por encima de ella para que no se superpongan.
  const abajo = enChat ? "5.5rem" : "1rem";

  return (
    <>
      <div aria-hidden="true" style={{ height: enChat ? "9.5rem" : "5.5rem" }} />
      <Link
        href={EMERGENCIA.href}
        className="pressable flex items-center gap-2"
        style={{
          position: "fixed",
          zIndex: 45,
          bottom: `calc(${abajo} + env(safe-area-inset-bottom))`,
          // El cuerpo mide como mucho 480px y va centrado: el botón se alinea
          // con su borde derecho, no con el de una pantalla ancha.
          right: "max(1rem, calc((100vw - 480px) / 2 + 1rem))",
          minHeight: "3.5rem",
          padding: "0 1.15rem 0 0.95rem",
          borderRadius: "999px",
          backgroundColor: "var(--red-solid)",
          color: "#fff",
          border: "3px solid #fff",
          boxShadow: "0 6px 18px rgba(200, 65, 43, 0.38), 0 2px 6px rgba(30, 43, 40, 0.18)",
          textDecoration: "none",
          fontSize: "var(--t-sm)",
          fontWeight: 700,
        }}
        aria-label={`${EMERGENCIA.label}. ${EMERGENCIA.description}`}
      >
        <Phone size={22} strokeWidth={2.6} fill="#fff" aria-hidden="true" />
        {EMERGENCIA.label}
      </Link>
    </>
  );
}
