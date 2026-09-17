import { NextResponse } from "next/server";
import { db } from "@/db";
import { medications, medicationLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get last 7 days
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const allMeds = await db
      .select()
      .from(medications)
      .where(eq(medications.patientId, patientId));
    const totalMeds = allMeds.length;

    if (totalMeds === 0) {
      return NextResponse.json([]);
    }

    const result = await Promise.all(
      days.map(async (date) => {
        const logs = await db
          .select()
          .from(medicationLogs)
          .where(and(eq(medicationLogs.patientId, patientId), eq(medicationLogs.date, date)));

        const taken = logs.filter((l) => l.taken).length;
        return { date, total: totalMeds, taken };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
