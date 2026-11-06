import Link from "next/link";
import { MessageCircleHeart } from "lucide-react";
import { rem } from "@/lib/scale";
import { ASISTENTE as asistente } from "@/lib/asistentes";

/**
 * Panela con su globo de diálogo y la acción principal del día, dentro de la
 * tarjeta de bienvenida del inicio (Figma A02). "Contarle cómo estoy" abre la
 * encuesta de bienestar de nuevo; la respuesta reemplaza a la anterior.
 */
export default function TarjetaAsistente() {
  return (
    <>
      <div className="flex items-center gap-2 mt-4">
        <p
          className="flex-1 min-w-0"
          style={{
            backgroundColor: "var(--surface)",
            border: "var(--border-w) solid var(--line)",
            borderRadius: "var(--r-xl)",
            padding: "1rem 1.1rem",
            fontSize: "var(--t-md)",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          ¿Me cuenta cómo se siente hoy?
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
        <img
          src={asistente.imagen}
          alt="Panela"
          style={{ height: rem(150), width: "auto", display: "block", flexShrink: 0 }}
        />
      </div>

      {/* La acción principal del inicio: verde de la marca, grande y con sombra
          para que sea lo primero que se ve dentro del bloque durazno. */}
      <Link
        href="/encuesta?nueva=1"
        className="btn-cta pressable w-full mt-4 text-center"
        style={{
          minHeight: "4.3rem",
          padding: "0.6rem 0.75rem",
          fontSize: "var(--t-base)",
          fontWeight: 700,
          lineHeight: 1.2,
          boxShadow: "0 6px 16px rgba(0, 154, 116, 0.32)",
        }}
      >
        <MessageCircleHeart size={24} strokeWidth={2.2} aria-hidden="true" style={{ flexShrink: 0 }} />
        <span>Contarle cómo estoy</span>
      </Link>
    </>
  );
}
