import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { Clock, Lightbulb, ListChecks } from "lucide-react";
import { db } from "@/db";
import { cognitiveActivities } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import { LEVEL_ACCENT, COGNITIVE_ICONS, COGNITIVE_ICON_FALLBACK } from "../data";
import { ACCENTS } from "@/lib/theme";

interface Props {
  params: Promise<{ id: string }>;
}

// El catálogo es propio de cada paciente: ya no hay un conjunto fijo de
// rutas que generar en el build, se resuelve por sesión en cada visita.
export const dynamic = "force-dynamic";

export default async function CognitiveDetailPage({ params }: Props) {
  const { id } = await params;
  const patientId = (await obtenerPacienteId())!;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return notFound();

  const [activity] = await db
    .select()
    .from(cognitiveActivities)
    .where(and(eq(cognitiveActivities.id, numericId), eq(cognitiveActivities.patientId, patientId)))
    .limit(1);

  if (!activity) return notFound();

  const accent = LEVEL_ACCENT[activity.level as "Fácil" | "Reto"];
  const tone = ACCENTS[accent];
  const Icon = COGNITIVE_ICONS[activity.emoji] ?? COGNITIVE_ICON_FALLBACK;

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title={activity.name}
        subtitle={activity.description}
        icon={Icon}
        accent={accent}
        backHref="/cognitivo"
        backLabel="Mente activa"
      />

      <main className="px-4 pt-3 flex flex-col gap-4" role="main">
        <div className="flex gap-2 px-1">
          <span className="pill" style={{ backgroundColor: tone.tint, borderColor: tone.line }}>
            {activity.level}
          </span>
          <span className="pill">
            <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
            {activity.durationLabel}
          </span>
        </div>

        <section aria-label="Pasos del ejercicio">
          <SectionTitle icon={ListChecks} accent={accent}>
            Cómo hacerlo
          </SectionTitle>

          <ol className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {activity.steps.map((step, i) => (
              <li key={i} className="card flex items-start gap-3.5 p-3.5">
                <span
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: "999px",
                    backgroundColor: tone.tint,
                    border: `1px solid ${tone.line}`,
                    color: "var(--ink)",
                    fontSize: "var(--t-sm)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.45 }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div
          className="flex items-start gap-2.5 p-3.5"
          style={{
            backgroundColor: "var(--yellow-tint)",
            border: "1px solid var(--yellow-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
          aria-label="Consejo"
        >
          <Lightbulb
            size={22}
            strokeWidth={2}
            color="var(--ink-soft)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
            {activity.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
