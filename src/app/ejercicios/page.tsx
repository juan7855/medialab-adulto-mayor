import { Lightbulb } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ExerciseList from "./ExerciseList";
import { SECTIONS } from "@/lib/theme";

const SECTION = SECTIONS.find((s) => s.href === "/ejercicios")!;

export default async function EjerciciosPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const catalogo = await db.select().from(exercises).where(eq(exercises.patientId, patientId));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Ejercicios"
        subtitle="Muévete con calma, siéntete mejor"
        iconSrc={SECTION.icon}
        accent={SECTION.accent}
        backHref="/inicio"
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
            size={22}
            strokeWidth={2}
            color="var(--ink-soft)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
            Muévete todos los días. Aunque sean 10 minutos, cuentan.
          </p>
        </div>

        <ExerciseList exercises={catalogo} />
      </main>
    </div>
  );
}
