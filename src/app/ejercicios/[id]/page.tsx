import { notFound } from "next/navigation";
import { and, eq, asc } from "drizzle-orm";
import { Clock, ListChecks, TriangleAlert } from "lucide-react";
import { db } from "@/db";
import { exercises, routines, routineExercises } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import ActivityTimer from "@/components/ActivityTimer";
import RoutineSession, { type ParadaRutina } from "../RoutineSession";
import { accentDeNivel, EXERCISE_ICONS, EXERCISE_ICON_FALLBACK, formatDuration } from "../data";
import { ACCENTS } from "@/lib/theme";

interface Props {
  params: Promise<{ id: string }>;
}

// El catálogo es propio de cada paciente: ya no hay un conjunto fijo de
// rutas que generar en el build, se resuelve por sesión en cada visita.
export const dynamic = "force-dynamic";

export default async function ExerciseDetailPage({ params }: Props) {
  const { id } = await params;
  const patientId = (await obtenerPacienteId())!;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return notFound();

  const [exercise] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.id, numericId), eq(exercises.patientId, patientId)))
    .limit(1);

  if (!exercise) return notFound();

  const accent = accentDeNivel(exercise.level);
  const tone = ACCENTS[accent];
  const Icon = EXERCISE_ICONS[exercise.emoji] ?? EXERCISE_ICON_FALLBACK;

  let rutinaNombre: string | null = null;
  let paradas: ParadaRutina[] = [];

  if (exercise.routineId) {
    const [rutina] = await db.select().from(routines).where(eq(routines.id, exercise.routineId)).limit(1);
    rutinaNombre = rutina?.name ?? null;

    const principales = await db
      .select()
      .from(routineExercises)
      .where(eq(routineExercises.routineId, exercise.routineId))
      .orderBy(asc(routineExercises.orderIndex));

    // El calentamiento y el cierre vienen de Rutina 3 (Movilidad), no de la
    // rutina principal, así que cada uno se busca por su propio id.
    const calentamiento = exercise.warmupExerciseId
      ? (await db.select().from(routineExercises).where(eq(routineExercises.id, exercise.warmupExerciseId)).limit(1))[0]
      : undefined;
    const cierre = exercise.cooldownExerciseId
      ? (await db.select().from(routineExercises).where(eq(routineExercises.id, exercise.cooldownExerciseId)).limit(1))[0]
      : undefined;

    paradas = [
      ...(calentamiento
        ? [
            {
              etiqueta: "Calentamiento" as const,
              posicion: null,
              name: calentamiento.name,
              variant: calentamiento.variant,
              objective: calentamiento.objective,
              steps: calentamiento.steps,
              videoUrl: calentamiento.videoUrl,
            },
          ]
        : []),
      ...principales.map((ej) => ({
        etiqueta: null,
        posicion: ej.orderIndex,
        name: ej.name,
        variant: ej.variant,
        objective: ej.objective,
        steps: ej.steps,
        videoUrl: ej.videoUrl,
      })),
      ...(cierre
        ? [
            {
              etiqueta: "Cierre" as const,
              posicion: null,
              name: cierre.name,
              variant: cierre.variant,
              objective: cierre.objective,
              steps: cierre.steps,
              videoUrl: cierre.videoUrl,
            },
          ]
        : []),
    ];
  }

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title={exercise.name}
        subtitle={rutinaNombre ?? exercise.description}
        icon={Icon}
        accent={accent}
        backHref="/ejercicios"
        backLabel="Ejercicios"
      />

      <main className="px-4 pt-3 flex flex-col gap-4" role="main">
        {/* Metadatos */}
        <div className="flex gap-2 px-1">
          <span className="pill" style={{ backgroundColor: tone.tint, borderColor: tone.line }}>
            {exercise.level}
          </span>
          <span className="pill">
            <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
            {formatDuration(exercise.durationSeconds)}
          </span>
        </div>

        {/* Temporizador */}
        <section className="card" aria-label="Temporizador">
          <ActivityTimer
            totalSeconds={exercise.durationSeconds}
            exerciseName={exercise.name}
            exerciseId={String(exercise.id)}
            accent={accent}
          />
        </section>

        {/* Pasos */}
        {paradas.length > 0 ? (
          <section aria-label="Ejercicios de la rutina">
            <SectionTitle icon={ListChecks} accent={accent}>
              La rutina paso a paso
            </SectionTitle>
            <div className="mt-3">
              <RoutineSession paradas={paradas} accent={accent} />
            </div>
          </section>
        ) : (
          <section aria-label="Pasos del ejercicio">
            <SectionTitle icon={ListChecks} accent={accent}>
              Pasos a seguir
            </SectionTitle>

            <ol className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
              {exercise.steps.map((step, i) => (
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
        )}

        {/* Advertencia */}
        <div
          className="flex items-start gap-2.5 p-3.5"
          style={{
            backgroundColor: "var(--yellow-tint)",
            border: "1px solid var(--yellow-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
          aria-label="Consejo de seguridad"
        >
          <TriangleAlert
            size={22}
            strokeWidth={2}
            color="var(--ink-soft)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
            {exercise.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
