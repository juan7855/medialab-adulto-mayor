import Link from "next/link";
import {
  Apple,
  CalendarClock,
  ChevronRight,
  HeartPulse,
  PersonStanding,
  Pill,
  Siren,
} from "lucide-react";
import Greeting from "@/components/Greeting";
import IconTile from "@/components/IconTile";
import type { AccentName } from "@/lib/theme";

const SECTIONS: {
  href: string;
  label: string;
  description: string;
  icon: typeof Apple;
  accent: AccentName;
}[] = [
  {
    href: "/ejercicios",
    label: "Ejercicios",
    description: "Muévete cada día",
    icon: PersonStanding,
    accent: "green",
  },
  {
    href: "/nutricion",
    label: "Nutrición",
    description: "Comidas y agua",
    icon: Apple,
    accent: "orange",
  },
  {
    href: "/medicamentos",
    label: "Medicamentos",
    description: "Tus pastillas de hoy",
    icon: Pill,
    accent: "blue",
  },
  {
    href: "/rutina",
    label: "Rutina",
    description: "Tu día paso a paso",
    icon: CalendarClock,
    accent: "purple",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      {/* Marca */}
      <div className="flex items-center gap-2 pt-6 pb-7 px-1">
        <HeartPulse size={20} strokeWidth={2.2} color="var(--ink)" aria-hidden="true" />
        <span
          style={{
            fontSize: "0.82rem",
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
      <nav aria-label="Secciones principales" className="grid grid-cols-2 gap-3.5 mt-7">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="card pressable animate-rise flex flex-col p-4"
            style={{ textDecoration: "none", color: "inherit", animationDelay: `${i * 45}ms` }}
            aria-label={`${section.label}. ${section.description}`}
          >
            <IconTile icon={section.icon} accent={section.accent} size={78} strokeWidth={1.5} />
            <span className="mt-3.5" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
              {section.label}
            </span>
            <span
              className="mt-0.5"
              style={{ fontSize: "0.74rem", fontWeight: 500, color: "var(--ink-mute)" }}
            >
              {section.description}
            </span>
          </Link>
        ))}
      </nav>

      {/* Emergencia */}
      <Link
        href="/emergencia"
        className="pressable flex items-center gap-3.5 mt-4 p-4"
        style={{
          backgroundColor: "var(--red-tint)",
          border: "1px solid var(--red-line)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow)",
          textDecoration: "none",
          color: "inherit",
        }}
        aria-label="Emergencia: llamar a un familiar o al 911"
      >
        <span
          className="tile"
          style={{
            width: 52,
            height: 52,
            backgroundColor: "var(--surface)",
            borderColor: "var(--red-line)",
            borderRadius: "0.85rem",
          }}
          aria-hidden="true"
        >
          <Siren size={26} strokeWidth={1.9} color="var(--red-ink)" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
            Emergencia
          </span>
          <span
            className="block mt-0.5"
            style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--ink-soft)" }}
          >
            Llamar a un familiar o al 911
          </span>
        </span>
        <ChevronRight size={22} strokeWidth={2.2} color="var(--red-ink)" aria-hidden="true" />
      </Link>

      <footer
        className="text-center mt-auto pt-9"
        style={{ fontSize: "0.72rem", color: "var(--ink-mute)", fontWeight: 500 }}
        role="contentinfo"
      >
        MiSalud · Tu salud, día a día
      </footer>
    </main>
  );
}
