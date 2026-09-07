import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ExerciseTimer from "./ExerciseTimer";
import { EXERCISES } from "../data";

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: exercise.color }}>
      <PageHeader
        title={exercise.name}
        emoji={exercise.emoji}
        color={exercise.levelColor}
        backHref="/ejercicios"
        backLabel="Ejercicios"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* Info card */}
        <div
          className="rounded-3xl p-5 shadow flex items-center gap-4"
          style={{ backgroundColor: "white" }}
          role="region"
          aria-label="Información del ejercicio"
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-2xl"
            style={{ width: 80, height: 80, fontSize: "2.8rem", backgroundColor: exercise.color }}
            aria-hidden="true"
          >
            {exercise.emoji}
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900" style={{ fontSize: "1.25rem" }}>
              {exercise.name}
            </h2>
            <p className="text-gray-600 mt-1" style={{ fontSize: "1rem" }}>
              {exercise.description}
            </p>
            <div className="flex gap-3 mt-2">
              <span
                className="rounded-full px-3 py-0.5 font-bold text-white"
                style={{ backgroundColor: exercise.levelColor, fontSize: "0.85rem" }}
              >
                {exercise.level}
              </span>
              <span className="font-semibold text-gray-600" style={{ fontSize: "0.95rem" }}>
                ⏱ {exercise.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div
          className="rounded-3xl shadow"
          style={{ backgroundColor: "white" }}
          role="region"
          aria-label="Temporizador"
        >
          <div className="px-5 pt-5 pb-2">
            <h3 className="font-extrabold text-gray-800 text-center" style={{ fontSize: "1.2rem" }}>
              ⏱ Temporizador
            </h3>
          </div>
          <ExerciseTimer
            totalSeconds={exercise.durationSeconds}
            exerciseName={exercise.name}
            exerciseId={exercise.id}
          />
        </div>

        {/* Steps */}
        <div
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          role="region"
          aria-label="Pasos del ejercicio"
        >
          <h3
            className="font-extrabold text-gray-800 mb-4"
            style={{ fontSize: "1.2rem" }}
          >
            📋 Pasos a seguir
          </h3>
          <ol className="flex flex-col gap-3" aria-label={`Pasos para ${exercise.name}`}>
            {exercise.steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl p-4"
                style={{ backgroundColor: exercise.color, fontSize: "1.05rem" }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full font-extrabold text-white"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: exercise.levelColor,
                    fontSize: "1.1rem",
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="font-medium text-gray-800 leading-snug pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tip */}
        <div
          className="rounded-3xl p-5 shadow flex items-start gap-3"
          style={{ backgroundColor: "#FEF3C7", border: "2px solid #FCD34D" }}
          role="note"
          aria-label="Consejo de seguridad"
        >
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">⚠️</span>
          <p className="font-semibold text-yellow-900" style={{ fontSize: "1.05rem" }}>
            {exercise.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
