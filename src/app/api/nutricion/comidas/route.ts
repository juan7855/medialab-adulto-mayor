import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals, mealLogs } from "@/db/schema";
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
      .from(mealLogs)
      .where(and(eq(mealLogs.patientId, patientId), eq(mealLogs.date, date)));

    return NextResponse.json(
      logs.map((l) => ({
        mealId: l.mealId,
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

    const body = (await req.json()) as { mealId: number; date: string; eaten: boolean };
    const { mealId, date, eaten } = body;

    if (!mealId || !date) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // La comida debe ser de este paciente: mismo criterio que en
    // medicamentos/logs y rutina/logs.
    const comida = await db
      .select({ id: meals.id })
      .from(meals)
      .where(and(eq(meals.id, mealId), eq(meals.patientId, patientId)))
      .limit(1);

    if (comida.length === 0) {
      return NextResponse.json({ error: "Comida no encontrada" }, { status: 404 });
    }

    const match = and(
      eq(mealLogs.patientId, patientId),
      eq(mealLogs.mealId, mealId),
      eq(mealLogs.date, date),
    );
    const existing = await db.select().from(mealLogs).where(match).limit(1);

    if (existing.length > 0) {
      await db
        .update(mealLogs)
        .set({ eaten, eatenAt: eaten ? new Date() : null })
        .where(match);
    } else {
      await db.insert(mealLogs).values({
        patientId,
        mealId,
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
