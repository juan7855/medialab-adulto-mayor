import { NextResponse } from "next/server";
import { db } from "@/db";
import { foodGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

/** Los grupos de alimentos de este paciente, para armar "Lo que comí". */
export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const grupos = await db
      .select()
      .from(foodGroups)
      .where(eq(foodGroups.patientId, patientId))
      .orderBy(foodGroups.sortOrder, foodGroups.id);

    return NextResponse.json(grupos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
