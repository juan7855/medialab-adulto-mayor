import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import { PREGUNTAS, type RespuestaEncuesta } from "@/lib/encuesta";

export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = (await req.json()) as Partial<RespuestaEncuesta>;

    // Todo es obligatorio: se valida aquí, no sólo en el formulario.
    const puntajes: Record<string, number> = {};
    for (const p of PREGUNTAS) {
      const v = body.scores?.[p.clave];
      if (!Number.isInteger(v) || (v as number) < 0 || (v as number) > 10) {
        return NextResponse.json({ error: "Faltan respuestas" }, { status: 400 });
      }
      puntajes[p.clave] = v as number;
    }

    // Una sola respuesta por paciente: si ya existía, la última reemplaza a
    // la anterior. Las dos preguntas de /conversemos se vacían porque
    // pertenecían a la respuesta vieja; esa pantalla viene justo después.
    const puntajesFila = {
      lifeSatisfaction: puntajes.lifeSatisfaction,
      dailyWorthwhile: puntajes.dailyWorthwhile,
      happyYesterday: puntajes.happyYesterday,
      anxiousYesterday: puntajes.anxiousYesterday,
      sadYesterday: puntajes.sadYesterday,
    };
    await db
      .insert(surveyResponses)
      .values({ patientId, ...puntajesFila })
      .onConflictDoUpdate({
        target: surveyResponses.patientId,
        set: { ...puntajesFila, extraNote: null, sleepQuality: null, createdAt: new Date() },
      });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
