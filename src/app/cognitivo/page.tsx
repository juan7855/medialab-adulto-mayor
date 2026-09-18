import { Lightbulb } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cognitiveActivities } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import CognitiveList from "./CognitiveList";
import type { Level } from "./data";
import { SECTIONS } from "@/lib/theme";

const SECTION = SECTIONS.find((s) => s.href === "/cognitivo")!;

export default async function CognitivoPage() {
  const patientId = (await obtenerPacienteId())!;
  const catalogo = await db
    .select()
    .from(cognitiveActivities)
    .where(eq(cognitiveActivities.patientId, patientId));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Mente activa"
        subtitle="Memoria, atención y lenguaje"
        iconSrc={SECTION.icon}
        accent={SECTION.accent}
        backHref="/inicio"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4" role="main">
        <div
          className="flex items-start gap-2.5 p-3.5 mb-4"
          style={{
            backgroundColor: "var(--blue-tint)",
            border: "1px solid var(--blue-line)",
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
            Un rato corto cada día ayuda más que una sesión larga de vez en cuando.
          </p>
        </div>

        <CognitiveList activities={catalogo.map((a) => ({ ...a, level: a.level as Level }))} />
      </main>
    </div>
  );
}
