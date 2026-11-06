import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ExerciseList from "./ExerciseList";

export default async function EjerciciosPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const catalogo = await db.select().from(exercises).where(eq(exercises.patientId, patientId));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Ejercicios"
        backHref="/inicio"
        backLabel="Hoy"
      />

      <main className="px-4 pt-4" role="main">
        <ExerciseList exercises={catalogo} />
      </main>
    </div>
  );
}
