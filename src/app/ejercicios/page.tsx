import { Lightbulb, PersonStanding } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ExerciseList from "./ExerciseList";

export default function EjerciciosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Ejercicios"
        subtitle="Muévete con calma, siéntete mejor"
        icon={PersonStanding}
        accent="green"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4" role="main">
        <div
          className="flex items-start gap-2.5 p-3.5 mb-4"
          style={{
            backgroundColor: "var(--green-tint)",
            border: "1px solid var(--green-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
        >
          <Lightbulb
            size={19}
            strokeWidth={2}
            color="var(--green-ink)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink-soft)" }}>
            Muévete todos los días. Aunque sean 10 minutos, cuentan.
          </p>
        </div>

        <ExerciseList />
      </main>
    </div>
  );
}
