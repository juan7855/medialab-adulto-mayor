import { rem } from "@/lib/scale";
import { ASISTENTE as asistente } from "@/lib/asistentes";

/** Panela con su globo de diálogo, dentro de la tarjeta de bienvenida del inicio. */
export default function TarjetaAsistente() {
  return (
    <div className="flex items-end gap-2 mt-4">
      <p
        className="flex-1 min-w-0 self-center"
        style={{
          backgroundColor: "var(--surface)",
          borderRadius: "var(--r-xl)",
          padding: "0.9rem 1rem",
          fontSize: "var(--t-base)",
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        Hoy lo acompaño yo. ¿Por dónde quiere empezar?
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
      <img
        src={asistente.imagen}
        alt="Panela"
        style={{ height: rem(128), width: "auto", display: "block", flexShrink: 0 }}
      />
    </div>
  );
}
