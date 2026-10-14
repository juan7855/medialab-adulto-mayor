import { eq } from "drizzle-orm";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";

/** ¿Ya respondió este paciente la encuesta obligatoria? */
export async function encuestaCompleta(patientId: number): Promise<boolean> {
  const filas = await db
    .select({ id: surveyResponses.id })
    .from(surveyResponses)
    .where(eq(surveyResponses.patientId, patientId))
    .limit(1);
  return filas.length > 0;
}
