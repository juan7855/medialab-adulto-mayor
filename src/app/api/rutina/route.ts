import { NextResponse } from "next/server";
import { db } from "@/db";
import { routineActivities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const activities = await db
      .select()
      .from(routineActivities)
      .where(eq(routineActivities.patientId, patientId))
      .orderBy(routineActivities.timeOfDay, routineActivities.scheduledTime);
    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
