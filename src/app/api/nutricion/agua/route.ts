import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { waterLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString().split("T")[0];

    const result = await db
      .select()
      .from(waterLogs)
      .where(and(eq(waterLogs.patientId, patientId), eq(waterLogs.date, date)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ glasses: 0 });
    }

    return NextResponse.json({ glasses: result[0].glasses });
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

    const body = await req.json() as { date: string; glasses: number };
    const { date, glasses } = body;

    const coincide = and(eq(waterLogs.patientId, patientId), eq(waterLogs.date, date));
    const existing = await db.select().from(waterLogs).where(coincide).limit(1);

    if (existing.length > 0) {
      await db.update(waterLogs).set({ glasses }).where(coincide);
    } else {
      await db.insert(waterLogs).values({ patientId, date, glasses });
    }

    return NextResponse.json({ ok: true, glasses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
