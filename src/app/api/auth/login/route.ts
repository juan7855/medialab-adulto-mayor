import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { crearSesion } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { pin?: string };
    const pin = (body.pin ?? "").trim();

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
    }

    const filas = await db.select().from(patients).where(eq(patients.pin, pin)).limit(1);
    const paciente = filas[0];

    if (!paciente) {
      // Mismo mensaje que si el formato fuera inválido: no hay que revelar
      // si el pin existe o no.
      return NextResponse.json({ error: "Clave inválida" }, { status: 401 });
    }

    await crearSesion(paciente.id);
    return NextResponse.json({ ok: true, name: paciente.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
