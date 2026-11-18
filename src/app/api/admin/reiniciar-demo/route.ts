import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  medicationLogs,
  waterLogs,
  mealLogs,
  routineLogs,
  exerciseLogs,
  foodGroupLogs,
  surveyResponses,
  dailyNotes,
  dailyVitals,
  gameScores,
} from "@/db/schema";

/**
 * Deja los perfiles demo (Álvaro, id 5; Marta, id 4) como recién abiertos:
 * borra los registros del día (medicamentos marcados, agua, comidas,
 * grupos de alimentos, rutina, ejercicios, encuesta, notas y vitales del
 * día, puntajes de juegos) para que el siguiente tester arranque con la
 * pantalla limpia. Sin sesión: el facilitador toca el botón "Reiniciar
 * demo" en la pantalla de la clave entre un tester y el próximo.
 *
 * No toca el catálogo (medicamentos, ejercicios, comidas, rutinas…), ni
 * posts/mensajes de Comunidad — esos actúan como contenido ambiente que da
 * vida a la demo. Si con el uso acumulan ruido se amplía después.
 *
 * Alcance acotado a IDs 4 y 5 explícitamente, no acepta otros: el peor
 * caso de que alguien descubra la URL es un reset de los dos perfiles
 * demo, no tocar un paciente real.
 */

const ID_ALVARO = 5;
const ID_MARTA = 4;

type Perfil = "alvaro" | "marta" | "ambos";

function idsDe(perfil: Perfil): number[] {
  if (perfil === "alvaro") return [ID_ALVARO];
  if (perfil === "marta") return [ID_MARTA];
  return [ID_ALVARO, ID_MARTA];
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { perfil?: string };
  const perfil = body.perfil as Perfil | undefined;
  if (perfil !== "alvaro" && perfil !== "marta" && perfil !== "ambos") {
    return NextResponse.json({ error: "perfil inválido" }, { status: 400 });
  }

  const ids = idsDe(perfil);

  // Todas las tablas que guardan "qué hizo hoy": se vacían completas para
  // los IDs demo. Son logs; no tienen datos irrecuperables.
  await db.delete(medicationLogs).where(inArray(medicationLogs.patientId, ids));
  await db.delete(waterLogs).where(inArray(waterLogs.patientId, ids));
  await db.delete(mealLogs).where(inArray(mealLogs.patientId, ids));
  await db.delete(foodGroupLogs).where(inArray(foodGroupLogs.patientId, ids));
  await db.delete(routineLogs).where(inArray(routineLogs.patientId, ids));
  await db.delete(exerciseLogs).where(inArray(exerciseLogs.patientId, ids));
  await db.delete(dailyNotes).where(inArray(dailyNotes.patientId, ids));
  await db.delete(dailyVitals).where(inArray(dailyVitals.patientId, ids));
  await db.delete(gameScores).where(inArray(gameScores.patientId, ids));

  // surveyResponses tiene unique(patient_id), así que basta con borrar la
  // fila del perfil demo para que la próxima persona vea la encuesta otra
  // vez al entrar.
  for (const id of ids) {
    await db.delete(surveyResponses).where(eq(surveyResponses.patientId, id));
  }

  return NextResponse.json({ ok: true, perfil, ids });
}
