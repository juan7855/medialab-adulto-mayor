import Link from "next/link";
import { CalendarDays, ChevronRight, Pill } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import SectionIcon from "@/components/SectionIcon";
import MedicationList from "./MedicationList";
import MedicationHistory from "./MedicationHistory";
import { EMERGENCIA, SECTIONS } from "@/lib/theme";

const SECTION = SECTIONS.find((s) => s.href === "/medicamentos")!;

export default function MedicamentosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Medicamentos"
        subtitle="Sus pastillas, a su hora"
        iconSrc={SECTION.icon}
        accent={SECTION.accent}
        backHref="/inicio"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        <section aria-label="Medicamentos de hoy">
          <SectionTitle icon={Pill} accent="cyan">
            Hoy
          </SectionTitle>
          <div className="mt-3">
            <MedicationList />
          </div>
        </section>

        <section aria-label="Historial de los últimos 7 días">
          <SectionTitle icon={CalendarDays} accent="purple">
            Últimos 7 días
          </SectionTitle>
          <div className="mt-3">
            <MedicationHistory />
          </div>
        </section>

        <Link
          href={EMERGENCIA.href}
          className="pressable flex items-center gap-3.5 p-3.5"
          style={{
            backgroundColor: "var(--red-tint)",
            border: "1px solid var(--red-line)",
            borderRadius: "var(--r-lg)",
            textDecoration: "none",
            color: "inherit",
          }}
          aria-label="Emergencia: llamar a un familiar o al 123"
        >
          <SectionIcon src={EMERGENCIA.icon} size={54} />
          <span className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
              {EMERGENCIA.label}
            </span>
            <span
              className="block mt-0.5"
              style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-soft)" }}
            >
              {EMERGENCIA.description}
            </span>
          </span>
          <ChevronRight size={26} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}
