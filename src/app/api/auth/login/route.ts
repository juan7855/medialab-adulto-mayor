import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients, surveyResponses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { crearSesion } from "@/lib/auth";

/** Perfiles demo de las pruebas de usuario: don Álvaro (5) y doña Marta (4). */
const IDS_DEMO = [4, 5];

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

    // En los perfiles demo la encuesta de bienestar se vuelve a pedir en cada
    // ingreso, para que las pruebas de usuario empiecen siempre desde ella.
    // Sólo toca los IDs demo; los pacientes reales conservan su respuesta.
    if (IDS_DEMO.includes(paciente.id)) {
      await db.delete(surveyResponses).where(eq(surveyResponses.patientId, paciente.id));
    }

    await crearSesion(paciente.id);
    return NextResponse.json({ ok: true, name: paciente.name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
