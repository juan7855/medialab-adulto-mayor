import Link from "next/link";
import { CalendarDays, ChevronRight, Pill, Siren } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import MedicationList from "./MedicationList";
import MedicationHistory from "./MedicationHistory";

export default function MedicamentosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Medicamentos"
        subtitle="Tus pastillas, a su hora"
        icon={Pill}
        accent="blue"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        {/* Medicamentos de hoy */}
        <section aria-label="Medicamentos de hoy">
          <SectionTitle icon={Pill} accent="blue">
            Hoy
          </SectionTitle>
          <div className="mt-3">
            <MedicationList />
          </div>
        </section>

        {/* Historial */}
        <section aria-label="Historial de los últimos 7 días">
          <SectionTitle icon={CalendarDays} accent="purple">
            Últimos 7 días
          </SectionTitle>
          <div className="mt-3">
            <MedicationHistory />
          </div>
        </section>

        {/* Emergencia */}
        <Link
          href="/emergencia"
          className="pressable flex items-center gap-3.5 p-4"
          style={{
            backgroundColor: "var(--red-tint)",
            border: "1px solid var(--red-line)",
            borderRadius: "var(--r-lg)",
            textDecoration: "none",
            color: "inherit",
          }}
          aria-label="Emergencia: llamar a un familiar o al 911"
        >
          <span
            className="tile"
            style={{
              width: 48,
              height: 48,
              backgroundColor: "var(--surface)",
              borderColor: "var(--red-line)",
              borderRadius: "0.8rem",
            }}
            aria-hidden="true"
          >
            <Siren size={24} strokeWidth={1.9} color="var(--red-ink)" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: "1rem", fontWeight: 800 }}>
              Emergencia
            </span>
            <span
              className="block mt-0.5"
              style={{ fontSize: "0.76rem", fontWeight: 500, color: "var(--ink-soft)" }}
            >
              Llamar a un familiar o al 911
            </span>
          </span>
          <ChevronRight size={22} strokeWidth={2.2} color="var(--red-ink)" aria-hidden="true" />
        </Link>
      </main>
    </div>
  );
}
