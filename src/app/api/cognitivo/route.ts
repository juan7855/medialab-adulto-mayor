import { NextResponse } from "next/server";
import { db } from "@/db";
import { cognitiveActivities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

/** El catálogo de actividades de Mente Activa de este paciente. Antes era
 *  un array fijo en el código, igual para todos; ahora cada paciente tiene
 *  el suyo. */
export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const catalogo = await db
      .select()
      .from(cognitiveActivities)
      .where(eq(cognitiveActivities.patientId, patientId));
    return NextResponse.json(catalogo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
