import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { routineActivities, routineLogs } from "@/db/schema";
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
      .from(routineLogs)
      .where(and(eq(routineLogs.patientId, patientId), eq(routineLogs.date, date)));

    return NextResponse.json(
      logs.map((l) => ({
        activityId: l.activityId,
        completed: l.completed,
        completedAt: l.completedAt?.toISOString() ?? null,
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

    const body = await req.json() as { activityId: number; date: string; completed: boolean };
    const { activityId, date, completed } = body;

    // La actividad debe ser de este paciente: mismo criterio que en
    // medicamentos/logs.
    const actividad = await db
      .select({ id: routineActivities.id })
      .from(routineActivities)
      .where(and(eq(routineActivities.id, activityId), eq(routineActivities.patientId, patientId)))
      .limit(1);

    if (actividad.length === 0) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 });
    }

    const coincide = and(
      eq(routineLogs.activityId, activityId),
      eq(routineLogs.date, date),
      eq(routineLogs.patientId, patientId),
    );

    const existing = await db.select().from(routineLogs).where(coincide).limit(1);

    if (existing.length > 0) {
      await db
        .update(routineLogs)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(coincide);
    } else {
      await db.insert(routineLogs).values({
        patientId,
        activityId,
        date,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
