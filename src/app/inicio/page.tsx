import Link from "next/link";
import { ChevronRight, HeartPulse } from "lucide-react";
import TarjetaAsistente from "@/components/TarjetaAsistente";
import Greeting from "@/components/Greeting";
import SectionIcon from "@/components/SectionIcon";
import { EMERGENCIA, RUTINA, SECTIONS, type Section } from "@/lib/theme";

/**
 * Una sola fila para todas las secciones.
 *
 * Antes había una rejilla de 2×2 más filas anchas, dos patrones en la misma
 * pantalla. La rejilla dejaba 171px de texto y "Medicamentos" mide 211px a
 * 1.2rem, así que se salía de la tarjeta; "Mente activa" también. La fila
 * ancha da 271px: entran todas las etiquetas a tamaño completo, y además
 * todos los elementos quedan alineados por el mismo eje.
 */
function SectionRow({ section, tinted = false }: { section: Section; tinted?: boolean }) {
  return (
    <Link
      href={section.href}
      className="pressable flex items-center gap-3 p-3.5"
      style={{
        backgroundColor: tinted ? "var(--red-tint)" : "var(--surface)",
        border: `1px solid ${tinted ? "var(--red-line)" : "var(--line)"}`,
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow)",
        textDecoration: "none",
        color: "inherit",
      }}
      aria-label={`${section.label}. ${section.description}`}
    >
      <SectionIcon src={section.icon} size={54} />

      <span className="flex-1 min-w-0">
        <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
          {section.label}
        </span>
        <span
          className="block mt-0.5"
          style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
        >
          {section.description}
        </span>
      </span>

      <ChevronRight size={22} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      {/* Marca */}
      <div className="flex items-center gap-2 pt-6 pb-6 px-1">
        <HeartPulse size={22} strokeWidth={2.2} color="var(--ink)" aria-hidden="true" />
        <span
          style={{
            fontSize: "var(--t-xs)",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          MiSalud
        </span>
      </div>

      <Greeting />

      <div className="mt-5">
        <TarjetaAsistente />
      </div>

      <nav aria-label="Secciones principales" className="flex flex-col gap-3 mt-7">
        {SECTIONS.map((section, i) => (
          <div
            key={section.href}
            className="animate-rise"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <SectionRow section={section} />
          </div>
        ))}

        <SectionRow section={RUTINA} />
        <SectionRow section={EMERGENCIA} tinted />
      </nav>

      <footer
        className="text-center mt-auto pt-9"
        style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)", fontWeight: 500 }}
        role="contentinfo"
      >
        MiSalud · Tu salud, día a día
      </footer>
    </main>
  );
}
