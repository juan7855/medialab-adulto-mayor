import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import {
  LARGO_MAXIMO_NOTA,
  OPCIONES_SUENO,
  type OpcionSueno,
  type RespuestaConversemos,
} from "@/lib/encuesta";

/** Guarda las dos preguntas opcionales en la fila de la encuesta del paciente. */
export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = (await req.json()) as RespuestaConversemos;
    // Se recorta en el servidor: el límite del textarea es una comodidad,
    // no una garantía.
    const extraNote = (body.extraNote ?? "").trim().slice(0, LARGO_MAXIMO_NOTA) || null;
    const sleepQuality = OPCIONES_SUENO.includes(body.sleepQuality as OpcionSueno)
      ? (body.sleepQuality as OpcionSueno)
      : null;

    await db
      .update(surveyResponses)
      .set({ extraNote, sleepQuality })
      .where(eq(surveyResponses.patientId, patientId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
