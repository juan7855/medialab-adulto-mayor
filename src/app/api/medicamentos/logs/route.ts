import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { medications, medicationLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const logs = await db
      .select()
      .from(medicationLogs)
      .where(and(eq(medicationLogs.patientId, patientId), eq(medicationLogs.date, date)));

    return NextResponse.json(
      logs.map((l) => ({
        medicationId: l.medicationId,
        taken: l.taken,
        takenAt: l.takenAt?.toISOString() ?? null,
      }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json() as { medicationId: number; date: string; taken: boolean };
    const { medicationId, date, taken } = body;

    // El medicamento debe ser de este paciente: si no, alguien está
    // mandando el id de otro paciente (a mano o por un bug del cliente).
    const medicamento = await db
      .select({ id: medications.id })
      .from(medications)
      .where(and(eq(medications.id, medicationId), eq(medications.patientId, patientId)))
      .limit(1);

    if (medicamento.length === 0) {
      return NextResponse.json({ error: "Medicamento no encontrado" }, { status: 404 });
    }

    const coincide = and(
      eq(medicationLogs.medicationId, medicationId),
      eq(medicationLogs.date, date),
      eq(medicationLogs.patientId, patientId),
    );

    const existing = await db.select().from(medicationLogs).where(coincide).limit(1);

    if (existing.length > 0) {
      await db
        .update(medicationLogs)
        .set({
          taken,
          takenAt: taken ? new Date() : null,
        })
        .where(coincide);
    } else {
      await db.insert(medicationLogs).values({
        patientId,
        medicationId,
        date,
        taken,
        takenAt: taken ? new Date() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
