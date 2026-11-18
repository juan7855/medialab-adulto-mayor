import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, routines } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import ExerciseList from "./ExerciseList";
import { numeraRutinas } from "./data";

export default async function EjerciciosPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const filas = await db.select().from(exercises).where(eq(exercises.patientId, patientId));
  const numeroDeRutina = new Map(
    (await db.select().from(routines)).map((r) => [r.id, r.number] as const),
  );
  const orden = numeraRutinas(filas);
  const catalogo = filas.map((ex) => ({
    ...ex,
    routineNumber: ex.routineId != null ? (numeroDeRutina.get(ex.routineId) ?? null) : null,
    ordenRutina: orden.get(ex.id)?.orden ?? null,
    totalRutinas: orden.get(ex.id)?.total ?? null,
  }));

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
