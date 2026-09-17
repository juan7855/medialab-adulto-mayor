import { NextResponse } from "next/server";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const meds = await db
      .select()
      .from(medications)
      .where(eq(medications.patientId, patientId))
      .orderBy(medications.time);
    return NextResponse.json(meds);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
