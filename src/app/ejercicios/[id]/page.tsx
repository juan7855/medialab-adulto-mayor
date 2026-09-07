import { notFound } from "next/navigation";
import { Clock, ListChecks, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import ExerciseTimer from "./ExerciseTimer";
import { EXERCISES, LEVEL_ACCENT } from "../data";
import { ACCENTS } from "@/lib/theme";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return EXERCISES.map((ex) => ({ id: ex.id }));
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { id } = await params;
  const exercise = EXERCISES.find((e) => e.id === id);
  if (!exercise) return notFound();

  const accentName = LEVEL_ACCENT[exercise.level];
  const tone = ACCENTS[accentName];

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title={exercise.name}
        subtitle={exercise.description}
        icon={exercise.icon}
        accent={accentName}
        backHref="/ejercicios"
        backLabel="Ejercicios"
      />

      <main className="px-4 pt-3 flex flex-col gap-4" role="main">
        {/* Metadatos */}
        <div className="flex gap-2 px-1">
          <span
            className="pill"
            style={{ backgroundColor: tone.tint, borderColor: tone.line, color: tone.ink }}
          >
            {exercise.level}
          </span>
          <span className="pill">
            <Clock size={13} strokeWidth={2.2} aria-hidden="true" />
            {exercise.duration}
          </span>
        </div>

        {/* Temporizador */}
        <section className="card" aria-label="Temporizador">
          <ExerciseTimer
            totalSeconds={exercise.durationSeconds}
            exerciseName={exercise.name}
            exerciseId={exercise.id}
            accent={accentName}
          />
        </section>

        {/* Pasos */}
        <section aria-label="Pasos del ejercicio">
          <SectionTitle icon={ListChecks} accent={accentName}>
            Pasos a seguir
          </SectionTitle>

          <ol className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {exercise.steps.map((step, i) => (
              <li key={i} className="card flex items-start gap-3.5 p-3.5">
                <span
                  className="tile"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "999px",
                    backgroundColor: tone.tint,
                    borderColor: tone.line,
                    color: tone.ink,
                    fontSize: "0.86rem",
                    fontWeight: 800,
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.45 }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Advertencia */}
        <div
          className="flex items-start gap-2.5 p-3.5"
          style={{
            backgroundColor: "var(--amber-tint)",
            border: "1px solid var(--amber-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
          aria-label="Consejo de seguridad"
        >
          <TriangleAlert
            size={19}
            strokeWidth={2}
            color="var(--amber-ink)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--ink-soft)" }}>
            {exercise.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
