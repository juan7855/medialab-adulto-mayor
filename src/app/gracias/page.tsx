import { eq } from "drizzle-orm";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PantallaGracias from "@/components/PantallaGracias";

/** Cierre de la encuesta: Panela agradece y la persona sigue al siguiente paso. */
export default async function GraciasPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const [patient] = await db
    .select({ name: patients.name })
    .from(patients)
    .where(eq(patients.id, patientId));
  const primerNombre = patient?.name.split(" ")[0] ?? "";

  return <PantallaGracias name={primerNombre} />;
}
