import Link from "next/link";
import { ChevronRight, HeartPulse } from "lucide-react";
import Greeting from "@/components/Greeting";
import SectionIcon from "@/components/SectionIcon";
import { EMERGENCIA, RUTINA, SECTIONS, type Section } from "@/lib/theme";

/** Tarjeta ancha: ficha a la izquierda, texto al centro, flecha a la derecha. */
function WideCard({
  section,
  tinted = false,
}: {
  section: Section;
  tinted?: boolean;
}) {
  return (
    <Link
      href={section.href}
      className="pressable flex items-center gap-3.5 p-3.5"
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
      <SectionIcon src={section.icon} size={62} />
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
      <ChevronRight size={26} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
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

      {/* Accesos principales */}
      <nav aria-label="Secciones principales" className="grid grid-cols-2 gap-3 mt-7">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="card pressable animate-rise flex flex-col p-3.5"
            style={{ textDecoration: "none", color: "inherit", animationDelay: `${i * 45}ms` }}
            aria-label={`${section.label}. ${section.description}`}
          >
            <SectionIcon src={section.icon} size={74} />
            <span className="mt-3" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
              {section.label}
            </span>
            <span
              className="mt-0.5"
              style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
            >
              {section.description}
            </span>
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-3 mt-3">
        <WideCard section={RUTINA} />
        <WideCard section={EMERGENCIA} tinted />
      </div>

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
