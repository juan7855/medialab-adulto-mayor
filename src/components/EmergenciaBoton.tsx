import Link from "next/link";
import { rem } from "@/lib/scale";
import { EMERGENCIA } from "@/lib/theme";

/**
 * Botón de emergencia: píldora roja arriba a la derecha, en todas las
 * pantallas (Figma). Es el único elemento de la app en rojo.
 */
export default function EmergenciaBoton() {
  return (
    <Link
      href={EMERGENCIA.href}
      className="pressable flex items-center gap-2 shrink-0"
      style={{
        backgroundColor: "var(--red-solid)",
        borderRadius: "999px",
        minHeight: "var(--touch)",
        padding: `0 ${rem(14)}`,
        color: "#fff",
        textDecoration: "none",
        fontSize: "var(--t-sm)",
        fontWeight: 600,
      }}
      aria-label={`${EMERGENCIA.label}. ${EMERGENCIA.description}`}
    >
      <span
        aria-hidden="true"
        style={{
          width: rem(14),
          height: rem(14),
          borderRadius: "999px",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      />
      {EMERGENCIA.label}
    </Link>
  );
}
