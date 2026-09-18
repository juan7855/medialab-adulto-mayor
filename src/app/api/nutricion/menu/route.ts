import { NextResponse } from "next/server";
import { db } from "@/db";
import { meals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

/** El menú (desayuno/almuerzo/cena) de este paciente. Antes era fijo en el
 *  código, igual para todos; ahora cada paciente tiene el suyo. */
export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const menu = await db.select().from(meals).where(eq(meals.patientId, patientId));
    return NextResponse.json(menu);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
