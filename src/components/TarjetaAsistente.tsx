import Link from "next/link";
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

      <Link
        href="/encuesta?nueva=1"
        className="btn-dark pressable w-full mt-4"
        style={{ minHeight: "3.8rem", fontSize: "var(--t-base)" }}
      >
        Contarle cómo estoy
      </Link>
    </>
  );
}
