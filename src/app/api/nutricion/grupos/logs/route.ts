import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodGroups, foodGroupLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const date = req.nextUrl.searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "Falta la fecha" }, { status: 400 });
    }

    const logs = await db
      .select()
      .from(foodGroupLogs)
      .where(and(eq(foodGroupLogs.patientId, patientId), eq(foodGroupLogs.date, date)));

    return NextResponse.json(
      logs.map((l) => ({
        foodGroupId: l.foodGroupId,
        eaten: l.eaten,
        eatenAt: l.eatenAt?.toISOString() ?? null,
      })),
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

    const body = (await req.json()) as { foodGroupId: number; date: string; eaten: boolean };
    const { foodGroupId, date, eaten } = body;

    if (!foodGroupId || !date) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // El grupo debe ser de este paciente: mismo criterio que en
    // nutricion/comidas y medicamentos/logs.
    const grupo = await db
      .select({ id: foodGroups.id })
      .from(foodGroups)
      .where(and(eq(foodGroups.id, foodGroupId), eq(foodGroups.patientId, patientId)))
      .limit(1);

    if (grupo.length === 0) {
      return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
    }

    const match = and(
      eq(foodGroupLogs.patientId, patientId),
      eq(foodGroupLogs.foodGroupId, foodGroupId),
      eq(foodGroupLogs.date, date),
    );
    const existing = await db.select().from(foodGroupLogs).where(match).limit(1);

    if (existing.length > 0) {
      await db
        .update(foodGroupLogs)
        .set({ eaten, eatenAt: eaten ? new Date() : null })
        .where(match);
    } else {
      await db.insert(foodGroupLogs).values({
        patientId,
        foodGroupId,
        date,
        eaten,
        eatenAt: eaten ? new Date() : null,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
